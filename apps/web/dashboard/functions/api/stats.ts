/**
 * Stats API for Cloudflare Pages Functions
 */

interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { DB } = context.env;
  const url = new URL(context.request.url);
  const project = url.searchParams.get('project');
  
  try {
    // Overall stats
    let statsQuery = `
      SELECT 
        COUNT(*) as total_sessions,
        COALESCE(SUM(tokens_in), 0) as total_tokens_in,
        COALESCE(SUM(tokens_out), 0) as total_tokens_out,
        COALESCE(SUM(cost_usd), 0) as total_cost
      FROM sessions
    `;
    
    if (project) {
      statsQuery += ' WHERE project = ?';
    }
    
    const stats = project 
      ? await DB.prepare(statsQuery).bind(project).first()
      : await DB.prepare(statsQuery).first();
    
    // Recent sessions
    let recentQuery = `
      SELECT id, project, branch, ended_at, summary, tokens_in, tokens_out, cost_usd
      FROM sessions
    `;
    if (project) {
      recentQuery += ' WHERE project = ?';
    }
    recentQuery += ' ORDER BY ended_at DESC LIMIT 10';
    
    const { results: recent } = project
      ? await DB.prepare(recentQuery).bind(project).all()
      : await DB.prepare(recentQuery).all();
    
    // Projects list
    const { results: projects } = await DB.prepare(`
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
      ? await DB.prepare(pendingQuery).bind(project).all()
      : await DB.prepare(pendingQuery).all();
    
    return new Response(JSON.stringify({
      stats,
      recent,
      projects,
      pending
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch stats', detail: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
