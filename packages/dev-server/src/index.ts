#!/usr/bin/env node

import { findAvailablePortRange } from './port-scanner.js'
import {
  findMonorepoRoot,
  loadDevPortsConfig,
  generateDefaultConfig,
  buildEnvVars,
  loadSecrets,
} from './env-builder.js'
import { displayBanner, runTurboDev } from './runner.js'

async function main(): Promise<void> {
  // Parse args - everything after our script name goes to turbo
  const args = process.argv.slice(2)

  // Find monorepo root
  const rootDir = findMonorepoRoot()

  // Load or generate config
  let config = loadDevPortsConfig(rootDir)
  if (!config) {
    config = generateDefaultConfig(rootDir)
    if (Object.keys(config).length === 0) {
      console.error('No apps found and no devPorts config in package.json or turbo.json')
      console.error('Add a devPorts config or create apps in the apps/ directory')
      process.exit(1)
    }
  }

  // Calculate how many ports we need
  // Each service gets its offset + portCount (default 2 for frontend+api)
  const portsNeeded = Object.values(config).reduce((max, c) => {
    const serviceEnd = c.offset + (c.portCount ?? 2)
    return Math.max(max, serviceEnd)
  }, 0)

  // Find available port range
  const scanResult = await findAvailablePortRange({ portsNeeded })
  if (!scanResult.success) {
    console.error(scanResult.error)
    process.exit(1)
  }

  const basePort = scanResult.basePort

  // Build environment variables
  const generatedEnv = buildEnvVars(basePort, config)

  // Load secrets from .env.local
  const secrets = loadSecrets(rootDir)

  // Display banner
  displayBanner(basePort, generatedEnv.services)

  // Run turbo dev
  const exitCode = await runTurboDev({
    cwd: rootDir,
    generatedEnv,
    secrets,
    turboArgs: args,
  })

  process.exit(exitCode)
}

main().catch((err) => {
  console.error('Failed to start dev server:', err)
  process.exit(1)
})
