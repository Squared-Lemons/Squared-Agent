import { Hono } from "hono";
import { join } from "path";
import { access } from "fs/promises";
import { parseTokenUsage, calculateCost } from "../parsers/token-usage";
import { parseSessionLogs } from "../parsers/session-logs";

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
  }
  return PROJECT_PATH;
}

export const sessionsRouter = new Hono();

// Get all sessions (for the sessions list panel)
sessionsRouter.get("/", async (c) => {
  const date = c.req.query("date");
  const month = c.req.query("month");

  const projectPath = await getProjectPath();
  const allSessions = await parseTokenUsage(projectPath);

  // If date or month filter is provided, filter sessions
  const filteredSessions = allSessions
    .map((session) => {
      const sessionDate = session.date.split(" ")[0];
      const sessionMonth = sessionDate.substring(0, 7);

      // Apply filters if provided
      if (date && sessionDate !== date) return null;
      if (month && sessionMonth !== month) return null;

      return {
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
      };
    })
    .filter(Boolean);

  // Sort by date (most recent first)
  filteredSessions.sort((a, b) => b!.date.localeCompare(a!.date));

  return c.json({
    sessions: filteredSessions,
    date: date || null,
    month: month || null,
  });
});

// Get session detail for a specific date
sessionsRouter.get("/:date", async (c) => {
  const date = c.req.param("date");

  const projectPath = await getProjectPath();
  const allSessions = await parseTokenUsage(projectPath);
  const sessionLogs = await parseSessionLogs(projectPath);

  // Filter sessions for this date
  const daySessions = allSessions
    .filter((s) => s.date.split(" ")[0] === date)
    .map((session) => ({
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
    }));

  // Get logs for this date
  const dayLogs = sessionLogs.find((l) => l.date === date);

  return c.json({
    date,
    sessions: daySessions,
    logs: dayLogs?.entries || [],
  });
});
