import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { projectsRouter } from "./routes/projects";
import { statsRouter } from "./routes/stats";

const app = new Hono();

// Enable CORS for development
app.use("/*", cors());

// Mount routers
app.route("/api/projects", projectsRouter);
app.route("/api/stats", statsRouter);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

const port = 3001;
console.log(`Server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
