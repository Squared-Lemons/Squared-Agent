#!/usr/bin/env tsx
/**
 * Coordinated dev script that:
 * 1. Finds two available random ports
 * 2. Writes API port to .env.local for Vite to read
 * 3. Starts the API server on one
 * 4. Starts Vite on the other with proxy configured
 */

import { spawn } from "child_process";
import { createServer } from "net";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

async function findAvailablePort(startFrom = 3000): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (address && typeof address === "object") {
        const port = address.port;
        server.close(() => resolve(port));
      } else {
        reject(new Error("Could not get port"));
      }
    });
    server.on("error", reject);
  });
}

async function main() {
  console.log("\n🚀 Starting Squared Agent Dashboard...\n");

  // Find available ports
  const apiPort = await findAvailablePort();
  const vitePort = await findAvailablePort();

  console.log(`  API Server:  http://localhost:${apiPort}`);
  console.log(`  Dashboard:   http://localhost:${vitePort}`);
  console.log("\n");

  // Write API port to a config file that vite.config.ts reads
  const portConfigPath = join(process.cwd(), ".api-port");
  writeFileSync(portConfigPath, String(apiPort));

  // Start API server
  const api = spawn("tsx", ["watch", "server/index.ts"], {
    env: { ...process.env, PORT: String(apiPort) },
    stdio: "inherit",
    cwd: process.cwd(),
  });

  // Give API a moment to start
  await new Promise((r) => setTimeout(r, 500));

  // Start Vite
  const vite = spawn("npx", ["vite", "--port", String(vitePort)], {
    stdio: "inherit",
    cwd: process.cwd(),
  });

  // Handle cleanup
  const cleanup = () => {
    try {
      unlinkSync(portConfigPath);
    } catch {
      // Ignore if file doesn't exist
    }
    api.kill();
    vite.kill();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  // Wait for either to exit
  api.on("exit", (code) => {
    console.log(`API exited with code ${code}`);
    vite.kill();
    process.exit(code || 0);
  });

  vite.on("exit", (code) => {
    console.log(`Vite exited with code ${code}`);
    api.kill();
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
