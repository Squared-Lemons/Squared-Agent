import { Hono } from "hono";
import { join } from "path";
import { access } from "fs/promises";
import { parseTokenUsage, calculateCost } from "../parsers/token-usage";
import { getSessionLogsForDate, getSessionLogsForMonth, SessionLogEntry } from "../parsers/session-logs";

// Find the project root by looking for .project folder
async function findProjectRoot(): Promise<string> {
  // Check environment variable first
  if (process.env.PROJECT_PATH) {
    return process.env.PROJECT_PATH;
  }

  // Walk up from CWD looking for .project folder
  let current = process.cwd();
  const root = "/";

  while (current !== root) {
    try {
      await access(join(current, ".project"));
      return current;
    } catch {
      current = join(current, "..");
    }
  }

  // Fallback to CWD
  return process.cwd();
}

let PROJECT_PATH: string | null = null;

async function getProjectPath(): Promise<string> {
  if (!PROJECT_PATH) {
    PROJECT_PATH = await findProjectRoot();
    console.log(`Using project path: ${PROJECT_PATH}`);
  }
  return PROJECT_PATH;
}

export const statsRouter = new Hono();

// Get sessions for a specific date or month
statsRouter.get("/sessions", async (c) => {
  const date = c.req.query("date");
  const month = c.req.query("month"); // Format: YYYY-MM

  if (!date && !month) {
    return c.json({ error: "date or month parameter required" }, 400);
  }

  const projectPath = await getProjectPath();
  const allSessions = await parseTokenUsage(projectPath);
  const sessions: {
    date: string;
    type: string;
    input: number;
    output: number;
    cacheRead: number;
    cacheCreate: number;
    turns: number;
    cost: number;
  }[] = [];

  for (const session of allSessions) {
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

  const projectPath = await getProjectPath();
  const logs: {
    date: string;
    entries: SessionLogEntry[];
  }[] = [];

  if (date) {
    const entries = await getSessionLogsForDate(projectPath, date);
    if (entries.length > 0) {
      logs.push({ date, entries });
    }
  } else if (month) {
    const monthLogs = await getSessionLogsForMonth(projectPath, month);
    for (const log of monthLogs) {
      logs.push({
        date: log.date,
        entries: log.entries,
      });
    }
  }

  // Sort by date
  logs.sort((a, b) => a.date.localeCompare(b.date));

  return c.json({ date: date || null, month: month || null, logs });
});

// Get aggregated stats for the project
statsRouter.get("/", async (c) => {
  const projectPath = await getProjectPath();
  const sessions = await parseTokenUsage(projectPath);

  const totalTokens = {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheCreate: 0,
  };

  const byDayMap = new Map<string, { sessions: number; cost: number }>();

  let subscriptionCost = 0;
  let apiCost = 0;
  let subscriptionSessions = 0;
  let apiSessions = 0;

  for (const session of sessions) {
    totalTokens.input += session.input;
    totalTokens.output += session.output;
    totalTokens.cacheRead += session.cacheRead;
    totalTokens.cacheCreate += session.cacheCreate;

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

    // Track subscription vs API costs
    if (session.type === "subscription") {
      subscriptionCost += sessionCost;
      subscriptionSessions++;
    } else {
      apiCost += sessionCost;
      apiSessions++;
    }
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
  const totalSessions = sessions.length;

  return c.json({
    totalSessions,
    totalCost,
    totalTokens,
    byDay,
    // Subscription breakdown
    subscriptionCost,
    apiCost,
    subscriptionSessions,
    apiSessions,
  });
});
