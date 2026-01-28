export interface TokenSession {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
  cost: number;
}

export interface SessionEntry {
  time: string;
  title?: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

export interface SessionsResponse {
  sessions: TokenSession[];
  date: string | null;
  month: string | null;
}

export interface AggregatedStats {
  totalSessions: number;
  totalCost: number;
  totalTokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheCreate: number;
  };
  subscriptionCost?: number;
  apiCost?: number;
  subscriptionSessions?: number;
  apiSessions?: number;
  byDay: {
    date: string;
    sessions: number;
    cost: number;
  }[];
}

const API_BASE = "/api";

export async function fetchSessions(options?: {
  date?: string;
  month?: string;
}): Promise<SessionsResponse> {
  const params = new URLSearchParams();
  if (options?.date) params.set("date", options.date);
  if (options?.month) params.set("month", options.month);

  const url = params.toString()
    ? `${API_BASE}/sessions?${params}`
    : `${API_BASE}/sessions`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export async function fetchAggregatedStats(): Promise<AggregatedStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
