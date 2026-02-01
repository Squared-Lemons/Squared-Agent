interface Env {
  DB: D1Database;
  CORS_ORIGIN: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (url.pathname === '/api/stats' || url.pathname === '/stats') {
        return await handleStats(request, env, corsHeaders);
      }
      
      if (url.pathname === '/api/sessions' || url.pathname === '/sessions') {
        if (request.method === 'POST') {
          return await handleCreateSession(request, env, corsHeaders);
        }
        return await handleSessions(request, env, corsHeaders);
      }

      if (url.pathname === '/api/learnings' || url.pathname === '/learnings') {
        return await handleLearnings(request, env, corsHeaders);
      }

      if (url.pathname === '/api/pending' || url.pathname === '/pending') {
        return await handlePending(request, env, corsHeaders);
      }

      if (url.pathname === '/api/settings' || url.pathname === '/settings') {
        return handleSettings(request, corsHeaders);
      }

      // Health check
      if (url.pathname === '/' || url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', time: new Date().toISOString() }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: 'Internal error', 
        detail: error instanceof Error ? error.message : String(error) 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};

async function handleStats(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const project = url.searchParams.get('project');

  let statsQuery = `
    SELECT 
      COUNT(*) as total_sessions,
      COALESCE(SUM(tokens_in), 0) as total_tokens_in,
      COALESCE(SUM(tokens_out), 0) as total_tokens_out,
      COALESCE(SUM(cache_read), 0) as total_cache_read,
      COALESCE(SUM(cache_create), 0) as total_cache_create,
      COALESCE(SUM(cost_usd), 0) as total_cost
    FROM sessions
  `;
  
  if (project) {
    statsQuery += ' WHERE project = ?';
  }
  
  const stats = project 
    ? await env.DB.prepare(statsQuery).bind(project).first()
    : await env.DB.prepare(statsQuery).first();
  
  // Recent sessions
  let recentQuery = `
    SELECT id, project, branch, ended_at, summary, tokens_in, tokens_out, cache_read, cache_create, cost_usd
    FROM sessions
  `;
  if (project) {
    recentQuery += ' WHERE project = ?';
  }
  recentQuery += ' ORDER BY ended_at DESC LIMIT 10';
  
  const { results: recent } = project
    ? await env.DB.prepare(recentQuery).bind(project).all()
    : await env.DB.prepare(recentQuery).all();
  
  // Projects list
  const { results: projects } = await env.DB.prepare(`
    SELECT DISTINCT project, COUNT(*) as session_count, SUM(cost_usd) as total_cost
    FROM sessions
    GROUP BY project
    ORDER BY session_count DESC
  `).all();
  
  // Pending items
  let pendingQuery = 'SELECT * FROM pending WHERE resolved_session IS NULL';
  if (project) {
    pendingQuery += ' AND project = ?';
  }
  pendingQuery += ' ORDER BY created_at DESC';
  
  const { results: pending } = project
    ? await env.DB.prepare(pendingQuery).bind(project).all()
    : await env.DB.prepare(pendingQuery).all();

  return new Response(JSON.stringify({ stats, recent, projects, pending }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleSessions(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const project = url.searchParams.get('project');
  const date = url.searchParams.get('date'); // YYYY-MM-DD format
  const limit = parseInt(url.searchParams.get('limit') || '100');

  let results: any[];
  
  if (date) {
    // Filter by date - match sessions where ended_at starts with the date
    const datePattern = `${date}%`;
    const { results: r } = await env.DB.prepare(
      'SELECT * FROM sessions WHERE (ended_at LIKE ?1 OR started_at LIKE ?1) ORDER BY ended_at DESC LIMIT ?2'
    ).bind(datePattern, limit).all();
    results = r;
  } else if (project) {
    const { results: r } = await env.DB.prepare(
      'SELECT * FROM sessions WHERE project = ?1 ORDER BY ended_at DESC LIMIT ?2'
    ).bind(project, limit).all();
    results = r;
  } else {
    const { results: r } = await env.DB.prepare(
      'SELECT * FROM sessions ORDER BY ended_at DESC LIMIT ?1'
    ).bind(limit).all();
    results = r;
  }

  return new Response(JSON.stringify({ sessions: results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleCreateSession(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const body = await request.json() as Record<string, unknown>;
  const { id, project, branch, started_at, ended_at, summary, tokens_in, tokens_out, cache_read, cache_create, cost_usd } = body;

  await env.DB.prepare(`
    INSERT INTO sessions (id, project, branch, started_at, ended_at, summary, tokens_in, tokens_out, cache_read, cache_create, cost_usd)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    project,
    branch || null,
    started_at || null,
    ended_at || null,
    summary || null,
    tokens_in || 0,
    tokens_out || 0,
    cache_read || 0,
    cache_create || 0,
    cost_usd || 0
  ).run();

  return new Response(JSON.stringify({ success: true, id }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleLearnings(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const project = url.searchParams.get('project');
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('q');
  const limit = parseInt(url.searchParams.get('limit') || '100');

  let query = 'SELECT * FROM learnings WHERE 1=1';
  const params: (string | number)[] = [];

  if (project) {
    query += ' AND project = ?';
    params.push(project);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (search) {
    query += ' AND content LIKE ?';
    params.push(`%${search}%`);
  }

  query += ' ORDER BY created_at DESC LIMIT ?';
  params.push(limit);

  let stmt = env.DB.prepare(query);
  for (const p of params) {
    stmt = stmt.bind(p);
  }

  const { results } = await stmt.all();

  return new Response(JSON.stringify({ learnings: results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handleSettings(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
  // Settings endpoint - returns default settings for cloud deployment
  // In a full implementation, these would be stored in D1 or KV
  const defaultSettings = {
    plan: 'pro',
    monthlyPrice: 20,
    billingCycleStart: 1,
    notes: ''
  };

  if (request.method === 'PUT') {
    // Accept the settings but just echo them back (stateless for now)
    try {
      const body = await request.json();
      return new Response(JSON.stringify(body), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch {
      return new Response(JSON.stringify(defaultSettings), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify(defaultSettings), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

async function handlePending(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  const url = new URL(request.url);
  const project = url.searchParams.get('project');

  let query = 'SELECT * FROM pending WHERE resolved_session IS NULL';
  if (project) {
    query += ' AND project = ?';
  }
  query += ' ORDER BY created_at DESC';

  const { results } = project
    ? await env.DB.prepare(query).bind(project).all()
    : await env.DB.prepare(query).all();

  return new Response(JSON.stringify({ pending: results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
