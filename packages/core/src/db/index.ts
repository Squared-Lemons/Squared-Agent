/**
 * Database abstraction layer for Squared Agent
 * Works with SQLite locally and Cloudflare D1 in production
 */

import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

// Type definitions
export interface Session {
  id: string;
  project: string;
  branch?: string;
  started_at?: string;
  ended_at?: string;
  summary?: string;
  tokens_in: number;
  tokens_out: number;
  cost_usd: number;
  created_at: string;
}

export interface Commit {
  hash: string;
  message: string;
  project: string;
  session_id?: string;
  author?: string;
  created_at?: string;
}

export interface PendingItem {
  id: string;
  project: string;
  item: string;
  priority: string;
  created_session?: string;
  resolved_session?: string;
  created_at: string;
}

export interface Learning {
  id: string;
  project: string;
  session_id?: string;
  category?: string;
  content: string;
  tags?: string;
  created_at: string;
}

export interface Database {
  // Sessions
  getSession(id: string): Promise<Session | null>;
  getLastSession(project: string): Promise<Session | null>;
  getSessions(project: string, limit?: number): Promise<Session[]>;
  createSession(session: Omit<Session, 'created_at'>): Promise<void>;
  updateSession(id: string, updates: Partial<Session>): Promise<void>;
  
  // Commits
  getCommitsSince(project: string, since: string): Promise<Commit[]>;
  getSessionCommits(sessionId: string): Promise<Commit[]>;
  createCommit(commit: Commit): Promise<void>;
  
  // Pending
  getPendingItems(project: string): Promise<PendingItem[]>;
  createPendingItem(item: Omit<PendingItem, 'created_at'>): Promise<void>;
  resolvePendingItem(id: string, sessionId: string): Promise<void>;
  
  // Learnings
  getLearnings(project: string, category?: string): Promise<Learning[]>;
  searchLearnings(query: string): Promise<Learning[]>;
  createLearning(learning: Omit<Learning, 'created_at'>): Promise<void>;
  
  // Stats
  getProjectStats(project: string): Promise<{
    totalSessions: number;
    totalTokensIn: number;
    totalTokensOut: number;
    totalCost: number;
  }>;
  
  // Raw query for flexibility
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  run(sql: string, params?: unknown[]): Promise<void>;
}

// SQLite implementation for local development
export class SQLiteDatabase implements Database {
  private db: any;
  
  constructor(dbPath: string) {
    // Ensure directory exists
    const dir = dirname(dbPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    // Dynamic import for better-sqlite3
    const Database = require('better-sqlite3');
    this.db = new Database(dbPath);
    
    // Initialize schema
    this.initSchema();
  }
  
  private initSchema(): void {
    const schemaPath = join(__dirname, 'schema.sql');
    if (existsSync(schemaPath)) {
      const schema = readFileSync(schemaPath, 'utf-8');
      this.db.exec(schema);
    }
  }
  
  async getSession(id: string): Promise<Session | null> {
    return this.db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) || null;
  }
  
  async getLastSession(project: string): Promise<Session | null> {
    return this.db.prepare(
      'SELECT * FROM sessions WHERE project = ? ORDER BY ended_at DESC LIMIT 1'
    ).get(project) || null;
  }
  
  async getSessions(project: string, limit = 50): Promise<Session[]> {
    return this.db.prepare(
      'SELECT * FROM sessions WHERE project = ? ORDER BY ended_at DESC LIMIT ?'
    ).all(project, limit);
  }
  
  async createSession(session: Omit<Session, 'created_at'>): Promise<void> {
    this.db.prepare(`
      INSERT INTO sessions (id, project, branch, started_at, ended_at, summary, tokens_in, tokens_out, cost_usd)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      session.id,
      session.project,
      session.branch,
      session.started_at,
      session.ended_at,
      session.summary,
      session.tokens_in,
      session.tokens_out,
      session.cost_usd
    );
  }
  
  async updateSession(id: string, updates: Partial<Session>): Promise<void> {
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const sql = `UPDATE sessions SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
    const values = [...fields.map(f => (updates as any)[f]), id];
    this.db.prepare(sql).run(...values);
  }
  
  async getCommitsSince(project: string, since: string): Promise<Commit[]> {
    return this.db.prepare(
      'SELECT * FROM commits WHERE project = ? AND created_at > ? ORDER BY created_at DESC'
    ).all(project, since);
  }
  
  async getSessionCommits(sessionId: string): Promise<Commit[]> {
    return this.db.prepare(
      'SELECT * FROM commits WHERE session_id = ? ORDER BY created_at'
    ).all(sessionId);
  }
  
  async createCommit(commit: Commit): Promise<void> {
    this.db.prepare(`
      INSERT OR REPLACE INTO commits (hash, message, project, session_id, author, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(commit.hash, commit.message, commit.project, commit.session_id, commit.author, commit.created_at);
  }
  
  async getPendingItems(project: string): Promise<PendingItem[]> {
    return this.db.prepare(
      'SELECT * FROM pending WHERE project = ? AND resolved_session IS NULL ORDER BY created_at'
    ).all(project);
  }
  
  async createPendingItem(item: Omit<PendingItem, 'created_at'>): Promise<void> {
    this.db.prepare(`
      INSERT INTO pending (id, project, item, priority, created_session)
      VALUES (?, ?, ?, ?, ?)
    `).run(item.id, item.project, item.item, item.priority, item.created_session);
  }
  
  async resolvePendingItem(id: string, sessionId: string): Promise<void> {
    this.db.prepare(
      'UPDATE pending SET resolved_session = ? WHERE id = ?'
    ).run(sessionId, id);
  }
  
  async getLearnings(project: string, category?: string): Promise<Learning[]> {
    if (category) {
      return this.db.prepare(
        'SELECT * FROM learnings WHERE project = ? AND category = ? ORDER BY created_at DESC'
      ).all(project, category);
    }
    return this.db.prepare(
      'SELECT * FROM learnings WHERE project = ? ORDER BY created_at DESC'
    ).all(project);
  }
  
  async searchLearnings(query: string): Promise<Learning[]> {
    return this.db.prepare(
      'SELECT * FROM learnings WHERE content LIKE ? ORDER BY created_at DESC LIMIT 20'
    ).all(`%${query}%`);
  }
  
  async createLearning(learning: Omit<Learning, 'created_at'>): Promise<void> {
    this.db.prepare(`
      INSERT INTO learnings (id, project, session_id, category, content, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(learning.id, learning.project, learning.session_id, learning.category, learning.content, learning.tags);
  }
  
  async getProjectStats(project: string): Promise<{
    totalSessions: number;
    totalTokensIn: number;
    totalTokensOut: number;
    totalCost: number;
  }> {
    const result = this.db.prepare(`
      SELECT 
        COUNT(*) as totalSessions,
        COALESCE(SUM(tokens_in), 0) as totalTokensIn,
        COALESCE(SUM(tokens_out), 0) as totalTokensOut,
        COALESCE(SUM(cost_usd), 0) as totalCost
      FROM sessions WHERE project = ?
    `).get(project);
    return result;
  }
  
  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.db.prepare(sql).all(...params);
  }
  
  async run(sql: string, params: unknown[] = []): Promise<void> {
    this.db.prepare(sql).run(...params);
  }
}

// D1 implementation for Cloudflare
export class D1Database implements Database {
  private db: any;
  
  constructor(d1Binding: any) {
    this.db = d1Binding;
  }
  
  async getSession(id: string): Promise<Session | null> {
    const result = await this.db.prepare('SELECT * FROM sessions WHERE id = ?').bind(id).first();
    return result || null;
  }
  
  async getLastSession(project: string): Promise<Session | null> {
    const result = await this.db.prepare(
      'SELECT * FROM sessions WHERE project = ? ORDER BY ended_at DESC LIMIT 1'
    ).bind(project).first();
    return result || null;
  }
  
  async getSessions(project: string, limit = 50): Promise<Session[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM sessions WHERE project = ? ORDER BY ended_at DESC LIMIT ?'
    ).bind(project, limit).all();
    return results;
  }
  
  async createSession(session: Omit<Session, 'created_at'>): Promise<void> {
    await this.db.prepare(`
      INSERT INTO sessions (id, project, branch, started_at, ended_at, summary, tokens_in, tokens_out, cost_usd)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      session.id,
      session.project,
      session.branch,
      session.started_at,
      session.ended_at,
      session.summary,
      session.tokens_in,
      session.tokens_out,
      session.cost_usd
    ).run();
  }
  
  async updateSession(id: string, updates: Partial<Session>): Promise<void> {
    const fields = Object.keys(updates).filter(k => k !== 'id');
    const sql = `UPDATE sessions SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
    const values = [...fields.map(f => (updates as any)[f]), id];
    
    let stmt = this.db.prepare(sql);
    for (const val of values) {
      stmt = stmt.bind(val);
    }
    await stmt.run();
  }
  
  async getCommitsSince(project: string, since: string): Promise<Commit[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM commits WHERE project = ? AND created_at > ? ORDER BY created_at DESC'
    ).bind(project, since).all();
    return results;
  }
  
  async getSessionCommits(sessionId: string): Promise<Commit[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM commits WHERE session_id = ? ORDER BY created_at'
    ).bind(sessionId).all();
    return results;
  }
  
  async createCommit(commit: Commit): Promise<void> {
    await this.db.prepare(`
      INSERT OR REPLACE INTO commits (hash, message, project, session_id, author, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(commit.hash, commit.message, commit.project, commit.session_id, commit.author, commit.created_at).run();
  }
  
  async getPendingItems(project: string): Promise<PendingItem[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM pending WHERE project = ? AND resolved_session IS NULL ORDER BY created_at'
    ).bind(project).all();
    return results;
  }
  
  async createPendingItem(item: Omit<PendingItem, 'created_at'>): Promise<void> {
    await this.db.prepare(`
      INSERT INTO pending (id, project, item, priority, created_session)
      VALUES (?, ?, ?, ?, ?)
    `).bind(item.id, item.project, item.item, item.priority, item.created_session).run();
  }
  
  async resolvePendingItem(id: string, sessionId: string): Promise<void> {
    await this.db.prepare(
      'UPDATE pending SET resolved_session = ? WHERE id = ?'
    ).bind(sessionId, id).run();
  }
  
  async getLearnings(project: string, category?: string): Promise<Learning[]> {
    if (category) {
      const { results } = await this.db.prepare(
        'SELECT * FROM learnings WHERE project = ? AND category = ? ORDER BY created_at DESC'
      ).bind(project, category).all();
      return results;
    }
    const { results } = await this.db.prepare(
      'SELECT * FROM learnings WHERE project = ? ORDER BY created_at DESC'
    ).bind(project).all();
    return results;
  }
  
  async searchLearnings(query: string): Promise<Learning[]> {
    const { results } = await this.db.prepare(
      'SELECT * FROM learnings WHERE content LIKE ? ORDER BY created_at DESC LIMIT 20'
    ).bind(`%${query}%`).all();
    return results;
  }
  
  async createLearning(learning: Omit<Learning, 'created_at'>): Promise<void> {
    await this.db.prepare(`
      INSERT INTO learnings (id, project, session_id, category, content, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(learning.id, learning.project, learning.session_id, learning.category, learning.content, learning.tags).run();
  }
  
  async getProjectStats(project: string): Promise<{
    totalSessions: number;
    totalTokensIn: number;
    totalTokensOut: number;
    totalCost: number;
  }> {
    const result = await this.db.prepare(`
      SELECT 
        COUNT(*) as totalSessions,
        COALESCE(SUM(tokens_in), 0) as totalTokensIn,
        COALESCE(SUM(tokens_out), 0) as totalTokensOut,
        COALESCE(SUM(cost_usd), 0) as totalCost
      FROM sessions WHERE project = ?
    `).bind(project).first();
    return result;
  }
  
  async query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    let stmt = this.db.prepare(sql);
    for (const param of params) {
      stmt = stmt.bind(param);
    }
    const { results } = await stmt.all();
    return results;
  }
  
  async run(sql: string, params: unknown[] = []): Promise<void> {
    let stmt = this.db.prepare(sql);
    for (const param of params) {
      stmt = stmt.bind(param);
    }
    await stmt.run();
  }
}

// Factory function to get the right database
let dbInstance: Database | null = null;

export function getDatabase(options?: { d1?: any; dbPath?: string }): Database {
  if (dbInstance) return dbInstance;
  
  // Check for Cloudflare D1 binding
  if (options?.d1) {
    dbInstance = new D1Database(options.d1);
    return dbInstance;
  }
  
  // Default to SQLite
  const dbPath = options?.dbPath || './data/sessions.db';
  dbInstance = new SQLiteDatabase(dbPath);
  return dbInstance;
}

export function resetDatabase(): void {
  dbInstance = null;
}
