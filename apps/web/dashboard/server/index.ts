import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { statsRouter } from "./routes/stats";
import { sessionsRouter } from "./routes/sessions";
import { settingsRouter } from "./routes/settings";

const app = new Hono();

// Enable CORS for development
app.use("/*", cors());

// Mount routers
app.route("/api/stats", statsRouter);
app.route("/api/sessions", sessionsRouter);
app.route("/api/settings", settingsRouter);

// Health check
app.get("/api/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT || "3001", 10);
console.log(`API server running on http://localhost:${port}`);
console.log(`Reading data from: ${process.cwd()}/.project/`);

serve({
  fetch: app.fetch,
  port,
});
