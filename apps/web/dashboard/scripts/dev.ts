#!/usr/bin/env tsx
/**
 * Coordinated dev script that:
 * 1. Uses injected ports from dev-server, or finds available ports
 * 2. Writes API port to .api-port for Vite to read
 * 3. Starts the API server
 * 4. Starts Vite with proxy configured
 */

import { spawn, type ChildProcess } from "child_process";
import { createServer } from "net";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

/**
 * Check if a specific port is available
 */
async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

/**
 * Find any available port (OS assigns)
 */
async function findAvailablePort(): Promise<number> {
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

/**
 * Wait for a port to become available (with timeout)
 */
async function waitForPort(port: number, timeoutMs = 5000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isPortAvailable(port)) {
      return true;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return false;
}

async function main() {
  console.log("\n🚀 Starting Squared Agent Dashboard...\n");

  let vitePort: number;
  let apiPort: number;

  if (process.env.PORT_WEB_DASHBOARD) {
    // Using dev-server injected ports
    vitePort = parseInt(process.env.PORT_WEB_DASHBOARD, 10);
    apiPort = vitePort + 1;

    // Verify ports are actually available (dev-server may have scanned earlier)
    const viteAvailable = await waitForPort(vitePort, 2000);
    const apiAvailable = await waitForPort(apiPort, 2000);

    if (!viteAvailable || !apiAvailable) {
      console.log("  Injected ports not available, finding alternatives...");
      vitePort = await findAvailablePort();
      apiPort = await findAvailablePort();
    }
  } else {
    // Fallback: find random available ports
    vitePort = await findAvailablePort();
    apiPort = await findAvailablePort();
  }

  console.log(`  API Server:  http://localhost:${apiPort}`);
  console.log(`  Dashboard:   http://localhost:${vitePort}`);
  console.log("\n");

  // Write API port to a config file that vite.config.ts reads
  const portConfigPath = join(process.cwd(), ".api-port");
  writeFileSync(portConfigPath, String(apiPort));

  let api: ChildProcess;
  let vite: ChildProcess;

  // Start API server with restart handling
  const startApi = () => {
    api = spawn("tsx", ["watch", "server/index.ts"], {
      env: { ...process.env, PORT: String(apiPort) },
      stdio: "inherit",
      cwd: process.cwd(),
    });

    api.on("exit", (code, signal) => {
      // If killed by signal (e.g., SIGTERM), don't restart
      if (signal) return;

      // If exited with error, wait a bit and restart (hot-reload port conflict)
      if (code !== 0) {
        console.log("API server crashed, restarting in 1s...");
        setTimeout(startApi, 1000);
      }
    });
  };

  startApi();

  // Give API a moment to start
  await new Promise((r) => setTimeout(r, 500));

  // Start Vite
  vite = spawn("npx", ["vite", "--port", String(vitePort)], {
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
    api?.kill();
    vite?.kill();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  vite.on("exit", (code) => {
    console.log(`Vite exited with code ${code}`);
    api?.kill();
    process.exit(code || 0);
  });
}

main().catch((err) => {
  console.error("Failed to start:", err);
  process.exit(1);
});
