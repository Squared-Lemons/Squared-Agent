export interface Project {
  id: string;
  name: string;
  path: string;
  addedAt: string;
}

export interface TokenSession {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
}

export interface SessionEntry {
  time: string;
  title?: string;
  changes: string[];
  insights: string[];
  commits: string[];
}

export interface SessionLog {
  date: string;
  sessions: SessionEntry[];
}

export interface ProjectStats {
  project: Project;
  tokenSessions: TokenSession[];
  sessionLogs: SessionLog[];
  totalCost: number;
  totalSessions: number;
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
  // Subscription tracking
  subscriptionCost?: number;
  apiCost?: number;
  subscriptionSessions?: number;
  apiSessions?: number;
  byProject: {
    projectId: string;
    projectName: string;
    sessions: number;
    cost: number;
  }[];
  byDay: {
    date: string;
    sessions: number;
    cost: number;
  }[];
}

const API_BASE = "/api";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

export async function addProject(path: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path }),
  });
  if (!res.ok) throw new Error("Failed to add project");
  return res.json();
}

export async function removeProject(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove project");
}

export async function fetchProjectStats(id: string): Promise<ProjectStats> {
  const res = await fetch(`${API_BASE}/projects/${id}/stats`);
  if (!res.ok) throw new Error("Failed to fetch project stats");
  return res.json();
}

export async function fetchAggregatedStats(): Promise<AggregatedStats> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}
