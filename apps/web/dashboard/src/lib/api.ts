/**
 * API client that works in both local dev and Cloudflare deployment
 */

/// <reference types="vite/client" />

// In production (Cloudflare Pages), use the D1-backed API
// In local dev, use the Hono server
const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api';

export interface Session {
  id?: string;
  date: string;
  type: 'subscription' | 'api';
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
  summary?: string;
  project?: string;
  branch?: string;
}

export interface SessionLog {
  time: string;
  title?: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

export interface DaySession {
  date: string;
  sessions: Session[];
  logs: SessionLog[];
}

export interface Learning {
  id: string;
  project: string;
  category: string;
  content: string;
  created_at: string;
}

export interface Stats {
  total_sessions: number;
  total_tokens_in: number;
  total_tokens_out: number;
  total_cost: number;
}

// Calculate projected API cost from token counts
// Pricing: Input: $15/1M, Output: $75/1M, Cache Read: $1.50/1M, Cache Create: $18.75/1M
function calculateProjectedCost(input: number, output: number, cacheRead = 0, cacheCreate = 0): number {
  return (input * 15 + output * 75 + cacheRead * 1.5 + cacheCreate * 18.75) / 1_000_000;
}

// Transform D1 session format to dashboard format
function transformSession(s: any): Session {
  // Convert ISO date to "YYYY-MM-DD HH:MM" format expected by dashboard
  let dateStr = s.ended_at || s.started_at || s.date || '';
  if (dateStr.includes('T')) {
    // ISO format: 2026-01-31T07:45:00Z -> 2026-01-31 07:45
    const d = new Date(dateStr);
    const date = d.toISOString().split('T')[0];
    const time = d.toTimeString().split(' ')[0].substring(0, 5);
    dateStr = `${date} ${time}`;
  }
  
  const input = s.tokens_in || s.input || 0;
  const output = s.tokens_out || s.output || 0;
  const cacheRead = s.cache_read || s.cacheRead || 0;
  const cacheCreate = s.cache_create || s.cacheCreate || 0;
  
  // Calculate projected cost from tokens (for subscription sessions)
  const projectedCost = calculateProjectedCost(input, output, cacheRead, cacheCreate);
  
  return {
    id: s.id,
    date: dateStr,
    type: 'subscription',
    input,
    output,
    cacheRead,
    cacheCreate,
    turns: s.turns || 0,
    cost: projectedCost, // Use projected cost for all sessions
    summary: s.summary,
    project: s.project,
    branch: s.branch,
  };
}

export async function fetchSessions(params?: { date?: string; month?: string }): Promise<Session[]> {
  const url = new URL(`${API_BASE}/sessions`, window.location.origin);
  if (params?.date) url.searchParams.set('date', params.date);
  if (params?.month) url.searchParams.set('month', params.month);
  
  const res = await fetch(url.toString());
  const data = await res.json();
  
  return (data.sessions || []).map(transformSession);
}

export async function fetchSessionDetail(date: string): Promise<DaySession> {
  const res = await fetch(`${API_BASE}/sessions/${date}`);
  const data = await res.json();
  
  return {
    date,
    sessions: (data.sessions || []).map(transformSession),
    logs: data.logs || [],
  };
}

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_BASE}/stats`);
  const data = await res.json();
  
  return data.stats || {
    total_sessions: 0,
    total_tokens_in: 0,
    total_tokens_out: 0,
    total_cost: 0,
  };
}

export async function fetchLearnings(params?: { project?: string; category?: string; q?: string }): Promise<Learning[]> {
  const url = new URL(`${API_BASE}/learnings`, window.location.origin);
  if (params?.project) url.searchParams.set('project', params.project);
  if (params?.category) url.searchParams.set('category', params.category);
  if (params?.q) url.searchParams.set('q', params.q);
  
  const res = await fetch(url.toString());
  const data = await res.json();
  
  return data.learnings || [];
}

// Aggregated stats for the stats panel
export interface AggregatedStats {
  overview: {
    totalSessions: number;
    totalTokensIn: number;
    totalTokensOut: number;
    totalCost: number;
    activeDays: number;
  };
  recent: Session[];
  byDate: { date: string; sessions: number; tokens: number; cost: number }[];
}

export async function fetchAggregatedStats(): Promise<AggregatedStats> {
  const [statsRes, sessionsRes] = await Promise.all([
    fetch(`${API_BASE}/stats`),
    fetch(`${API_BASE}/sessions?limit=100`)
  ]);
  
  const statsData = await statsRes.json();
  const sessionsData = await sessionsRes.json();
  
  const sessions = (sessionsData.sessions || []).map(transformSession);
  const stats = statsData.stats || {};
  
  // Group by date for chart
  const byDateMap = new Map<string, { sessions: number; tokens: number; cost: number }>();
  for (const s of sessions) {
    const date = s.date.split('T')[0].split(' ')[0];
    const existing = byDateMap.get(date) || { sessions: 0, tokens: 0, cost: 0 };
    byDateMap.set(date, {
      sessions: existing.sessions + 1,
      tokens: existing.tokens + s.input + s.output,
      cost: existing.cost + s.cost,
    });
  }
  
  const byDate = Array.from(byDateMap.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  // Count unique dates
  const activeDays = new Set(sessions.map((s: Session) => s.date.split('T')[0].split(' ')[0])).size;
  
  return {
    overview: {
      totalSessions: stats.total_sessions || sessions.length,
      totalTokensIn: stats.total_tokens_in || 0,
      totalTokensOut: stats.total_tokens_out || 0,
      totalCost: stats.total_cost || 0,
      activeDays,
    },
    recent: sessions.slice(0, 10),
    byDate,
  };
}
