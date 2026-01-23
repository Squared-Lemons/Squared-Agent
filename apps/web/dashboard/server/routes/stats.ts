import { Hono } from "hono";
import { readFile } from "fs/promises";
import { join } from "path";
import { homedir } from "os";
import { parseTokenUsage, calculateCost } from "../parsers/token-usage";

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

  return c.json({
    totalSessions,
    totalCost,
    totalTokens,
    byProject,
    byDay,
  });
});
