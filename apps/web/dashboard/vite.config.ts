import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { readFileSync, existsSync } from "fs";

// Read API port from config file (written by scripts/dev.ts)
function getApiPort(): string {
  const portFile = path.join(__dirname, ".api-port");
  if (existsSync(portFile)) {
    return readFileSync(portFile, "utf-8").trim();
  }
  return "3001";
}

const apiPort = getApiPort();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
});
