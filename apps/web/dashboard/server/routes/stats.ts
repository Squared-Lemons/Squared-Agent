import { Hono } from "hono";
import { readFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";
import { parseTokenUsage, calculateCost } from "../parsers/token-usage";
import { getSessionLogsForDate, getSessionLogsForMonth, SessionLogEntry } from "../parsers/session-logs";

interface Project {
  id: string;
  name: string;
  path: string;
  addedAt: string;
}

interface ProjectRegistry {
  projects: Project[];
}

const REGISTRY_FILE = join(homedir(), ".squared-agent", "dashboard-projects.json");

async function loadRegistry(): Promise<ProjectRegistry> {
  try {
    const content = await readFile(REGISTRY_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return { projects: [] };
  }
}

export const statsRouter = new Hono();

// Get sessions for a specific date or month
statsRouter.get("/sessions", async (c) => {
  const date = c.req.query("date");
  const month = c.req.query("month"); // Format: YYYY-MM

  if (!date && !month) {
    return c.json({ error: "date or month parameter required" }, 400);
  }

  const registry = await loadRegistry();
  const sessions: {
    projectId: string;
    projectName: string;
    date: string;
    type: string;
    input: number;
    output: number;
    cacheRead: number;
    cacheCreate: number;
    turns: number;
    cost: number;
  }[] = [];

  for (const project of registry.projects) {
    const projectSessions = await parseTokenUsage(project.path);

    for (const session of projectSessions) {
      // session.date is like "2026-01-23 04:00"
      const sessionDate = session.date.split(" ")[0];
      const sessionMonth = sessionDate.substring(0, 7); // YYYY-MM

      const matches = date
        ? sessionDate === date
        : month
        ? sessionMonth === month
        : false;

      if (matches) {
        sessions.push({
          projectId: project.id,
          projectName: project.name,
          date: session.date,
          type: session.type,
          input: session.input,
          output: session.output,
          cacheRead: session.cacheRead,
          cacheCreate: session.cacheCreate,
          turns: session.turns,
          cost: calculateCost({
            input: session.input,
            output: session.output,
            cacheRead: session.cacheRead,
            cacheCreate: session.cacheCreate,
          }),
        });
      }
    }
  }

  // Sort by time (date field contains time)
  sessions.sort((a, b) => a.date.localeCompare(b.date));

  return c.json({ date: date || null, month: month || null, sessions });
});

// Get session logs (rich details: changes, insights, commits)
statsRouter.get("/logs", async (c) => {
  const date = c.req.query("date");
  const month = c.req.query("month");

  if (!date && !month) {
    return c.json({ error: "date or month parameter required" }, 400);
  }

  const registry = await loadRegistry();
  const logs: {
    projectId: string;
    projectName: string;
    date: string;
    entries: SessionLogEntry[];
  }[] = [];

  for (const project of registry.projects) {
    if (date) {
      const entries = await getSessionLogsForDate(project.path, date);
      if (entries.length > 0) {
        logs.push({
          projectId: project.id,
          projectName: project.name,
          date,
          entries,
        });
      }
    } else if (month) {
      const monthLogs = await getSessionLogsForMonth(project.path, month);
      for (const log of monthLogs) {
        logs.push({
          projectId: project.id,
          projectName: project.name,
          date: log.date,
          entries: log.entries,
        });
      }
    }
  }

  // Sort by date
  logs.sort((a, b) => a.date.localeCompare(b.date));

  return c.json({ date: date || null, month: month || null, logs });
});

// Get aggregated stats across all projects
statsRouter.get("/", async (c) => {
  const registry = await loadRegistry();

  const totalTokens = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheCreate: 0,
  };

  const byProject: {
    projectId: string;
    projectName: string;
    sessions: number;
    cost: number;
  }[] = [];

  const byDayMap = new Map<string, { sessions: number; cost: number }>();

  for (const project of registry.projects) {
    const sessions = await parseTokenUsage(project.path);

    let projectCost = 0;
    const projectTokens = {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheCreate: 0,
    };

    for (const session of sessions) {
      projectTokens.input += session.input;
      projectTokens.output += session.output;
      projectTokens.cacheRead += session.cacheRead;
      projectTokens.cacheCreate += session.cacheCreate;

      // Aggregate by day (extract date part only)
      const dateOnly = session.date.split(" ")[0];
      const sessionCost = calculateCost({
        input: session.input,
        output: session.output,
        cacheRead: session.cacheRead,
        cacheCreate: session.cacheCreate,
      });

      const existing = byDayMap.get(dateOnly) || { sessions: 0, cost: 0 };
      byDayMap.set(dateOnly, {
        sessions: existing.sessions + 1,
        cost: existing.cost + sessionCost,
      });
    }

    projectCost = calculateCost(projectTokens);

    totalTokens.input += projectTokens.input;
    totalTokens.output += projectTokens.output;
    totalTokens.cacheRead += projectTokens.cacheRead;
    totalTokens.cacheCreate += projectTokens.cacheCreate;

    byProject.push({
      projectId: project.id,
      projectName: project.name,
      sessions: sessions.length,
      cost: projectCost,
    });
  }

  // Convert byDay map to sorted array
  const byDay = Array.from(byDayMap.entries())
    .map(([date, data]) => ({
      date,
      sessions: data.sessions,
      cost: data.cost,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totalCost = calculateCost(totalTokens);
  const totalSessions = byProject.reduce((sum, p) => sum + p.sessions, 0);

  // Calculate subscription vs API costs
  let subscriptionCost = 0;
  let apiCost = 0;
  let subscriptionSessions = 0;
  let apiSessions = 0;

  for (const project of registry.projects) {
    const sessions = await parseTokenUsage(project.path);
    for (const session of sessions) {
      const sessionCost = calculateCost({
        input: session.input,
        output: session.output,
        cacheRead: session.cacheRead,
        cacheCreate: session.cacheCreate,
      });

      if (session.type === "subscription") {
        subscriptionCost += sessionCost;
        subscriptionSessions++;
      } else {
        apiCost += sessionCost;
        apiSessions++;
      }
    }
  }

  return c.json({
    totalSessions,
    totalCost,
    totalTokens,
    byProject,
    byDay,
    // Subscription breakdown
    subscriptionCost, // API cost equivalent for subscription sessions
    apiCost, // Actual API charges
    subscriptionSessions,
    apiSessions,
  });
});
