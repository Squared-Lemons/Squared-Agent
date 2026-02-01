/**
 * Sessions API for Cloudflare Pages Functions
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const url = new URL(context.request.url);
  const project = url.searchParams.get('project');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  
  try {
    let query = 'SELECT * FROM sessions';
    const params: string[] = [];
    
    if (project) {
      query += ' WHERE project = ?';
      params.push(project);
    }
    
    query += ' ORDER BY ended_at DESC LIMIT ?';
    params.push(limit.toString());
    
    const { results } = await DB.prepare(query).bind(...params).all();
    
    return new Response(JSON.stringify({ sessions: results }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch sessions' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  
  try {
    const body = await context.request.json();
    const { id, project, branch, started_at, ended_at, summary, tokens_in, tokens_out, cost_usd } = body;
    
    await DB.prepare(`
      INSERT INTO sessions (id, project, branch, started_at, ended_at, summary, tokens_in, tokens_out, cost_usd)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(id, project, branch, started_at, ended_at, summary, tokens_in || 0, tokens_out || 0, cost_usd || 0).run();
    
    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
