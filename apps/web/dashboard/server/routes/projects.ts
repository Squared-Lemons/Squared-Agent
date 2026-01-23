import { Hono } from "hono";
import { readFile, writeFile, mkdir, access } from "fs/promises";
import { join, basename } from "path";
import { homedir } from "os";
import { v4 as uuidv4 } from "uuid";
import { parseTokenUsage, calculateCost } from "../parsers/token-usage";
import { parseSessionLogs } from "../parsers/sessions";

interface Project {
  id: string;
  name: string;
  path: string;
  addedAt: string;
}

interface ProjectRegistry {
  projects: Project[];
}

const REGISTRY_DIR = join(homedir(), ".squared-agent");
const REGISTRY_FILE = join(REGISTRY_DIR, "dashboard-projects.json");

async function ensureRegistryExists(): Promise<void> {
  try {
    await mkdir(REGISTRY_DIR, { recursive: true });
    await access(REGISTRY_FILE);
  } catch {
    await writeFile(REGISTRY_FILE, JSON.stringify({ projects: [] }, null, 2));
  }
}

async function loadRegistry(): Promise<ProjectRegistry> {
  await ensureRegistryExists();
  const content = await readFile(REGISTRY_FILE, "utf-8");
  return JSON.parse(content);
}

async function saveRegistry(registry: ProjectRegistry): Promise<void> {
  await ensureRegistryExists();
  await writeFile(REGISTRY_FILE, JSON.stringify(registry, null, 2));
}

export const projectsRouter = new Hono();

// List all projects
projectsRouter.get("/", async (c) => {
  const registry = await loadRegistry();
  return c.json(registry.projects);
});

// Add a project
projectsRouter.post("/", async (c) => {
  const body = await c.req.json<{ path: string }>();
  const projectPath = body.path;

  // Validate path has .project folder
  try {
    await access(join(projectPath, ".project"));
  } catch {
    return c.json({ error: "No .project folder found at this path" }, 400);
  }

  const registry = await loadRegistry();

  // Check if already added
  if (registry.projects.some((p) => p.path === projectPath)) {
    return c.json({ error: "Project already added" }, 400);
  }

  const project: Project = {
    id: uuidv4(),
    name: basename(projectPath),
    path: projectPath,
    addedAt: new Date().toISOString(),
  };

  registry.projects.push(project);
  await saveRegistry(registry);

  return c.json(project, 201);
});

// Remove a project
projectsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const registry = await loadRegistry();

  const index = registry.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return c.json({ error: "Project not found" }, 404);
  }

  registry.projects.splice(index, 1);
  await saveRegistry(registry);

  return c.json({ success: true });
});

// Get project stats
projectsRouter.get("/:id/stats", async (c) => {
  const id = c.req.param("id");
  const registry = await loadRegistry();

  const project = registry.projects.find((p) => p.id === id);
  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  const tokenSessions = await parseTokenUsage(project.path);
  const sessionLogs = await parseSessionLogs(project.path);

  // Calculate totals
  const totalTokens = tokenSessions.reduce(
    (acc, s) => ({
      input: acc.input + s.input,
      output: acc.output + s.output,
      cacheRead: acc.cacheRead + s.cacheRead,
      cacheCreate: acc.cacheCreate + s.cacheCreate,
    }),
    { input: 0, output: 0, cacheRead: 0, cacheCreate: 0 }
  );

  const totalCost = calculateCost(totalTokens);
  const totalSessions = tokenSessions.length;

  return c.json({
    project,
    tokenSessions,
    sessionLogs,
    totalCost,
    totalSessions,
  });
});

// Get token usage for a project
projectsRouter.get("/:id/tokens", async (c) => {
  const id = c.req.param("id");
  const registry = await loadRegistry();

  const project = registry.projects.find((p) => p.id === id);
  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  const sessions = await parseTokenUsage(project.path);
  return c.json(sessions);
});

// Get session logs for a project
projectsRouter.get("/:id/sessions", async (c) => {
  const id = c.req.param("id");
  const registry = await loadRegistry();

  const project = registry.projects.find((p) => p.id === id);
  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  const logs = await parseSessionLogs(project.path);
  return c.json(logs);
});
