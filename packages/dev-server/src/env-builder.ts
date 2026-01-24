import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { config as loadDotenv } from 'dotenv'

export interface ServiceConfig {
  /** Port offset from base (0, 1, 2, etc.) */
  offset: number
  /** Environment variable name for the port (default: PORT) */
  env?: string
  /** Number of ports this service needs (default: 2 for frontend+api) */
  portCount?: number
}

export interface DevPortsConfig {
  [servicePath: string]: ServiceConfig
}

export interface GeneratedEnv {
  /** All environment variables to inject */
  env: Record<string, string>
  /** Human-readable service info for display */
  services: Array<{
    name: string
    port: number
    url: string
  }>
}

/**
 * Find the monorepo root by looking for pnpm-workspace.yaml
 */
export function findMonorepoRoot(startDir: string = process.cwd()): string {
  let dir = startDir
  while (dir !== dirname(dir)) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) {
      return dir
    }
    if (existsSync(resolve(dir, 'turbo.json'))) {
      return dir
    }
    dir = dirname(dir)
  }
  return startDir
}

/**
 * Load devPorts configuration from package.json or turbo.json
 */
export function loadDevPortsConfig(rootDir: string): DevPortsConfig | null {
  // Try package.json first
  const pkgPath = resolve(rootDir, 'package.json')
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      if (pkg.devPorts) {
        return pkg.devPorts
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Try turbo.json
  const turboPath = resolve(rootDir, 'turbo.json')
  if (existsSync(turboPath)) {
    try {
      const turbo = JSON.parse(readFileSync(turboPath, 'utf-8'))
      if (turbo.devPorts) {
        return turbo.devPorts
      }
    } catch {
      // Ignore parse errors
    }
  }

  return null
}

/**
 * Generate default config by scanning apps/ directory
 */
export function generateDefaultConfig(rootDir: string): DevPortsConfig {
  const config: DevPortsConfig = {}
  let offset = 0

  // Scan apps/ directory
  const appsDir = resolve(rootDir, 'apps')
  if (existsSync(appsDir)) {
    function scanDir(dir: string, prefix: string = '') {
      try {
        const entries = readdirSync(dir)
        for (const entry of entries) {
          const fullPath = resolve(dir, entry)
          const stat = statSync(fullPath)

          if (stat.isDirectory()) {
            const pkgPath = resolve(fullPath, 'package.json')
            if (existsSync(pkgPath)) {
              // This is an app
              const servicePath = prefix ? `${prefix}/${entry}` : entry
              config[servicePath] = { offset: offset++, env: 'PORT' }
            } else {
              // Recurse into subdirectory
              scanDir(fullPath, prefix ? `${prefix}/${entry}` : entry)
            }
          }
        }
      } catch {
        // Ignore errors
      }
    }

    scanDir(appsDir)
  }

  return config
}

/**
 * Convert service path to env var name
 * e.g., "web/dashboard" -> "WEB_DASHBOARD"
 */
function servicePathToEnvName(path: string): string {
  return path.toUpperCase().replace(/[/-]/g, '_')
}

/**
 * Build environment variables for all services
 */
export function buildEnvVars(
  basePort: number,
  config: DevPortsConfig
): GeneratedEnv {
  const env: Record<string, string> = {}
  const services: GeneratedEnv['services'] = []

  for (const [servicePath, serviceConfig] of Object.entries(config)) {
    const port = basePort + serviceConfig.offset
    const envName = servicePathToEnvName(servicePath)
    const url = `http://localhost:${port}`

    // PORT_<SERVICE> variable
    env[`PORT_${envName}`] = String(port)

    // <SERVICE>_URL variable
    env[`${envName}_URL`] = url

    // If this is an API service, also set API_URL for convenience
    if (servicePath.includes('api')) {
      env['API_URL'] = url
    }

    services.push({
      name: servicePath,
      port,
      url,
    })
  }

  return { env, services }
}

/**
 * Load .env.local secrets and merge with generated env
 */
export function loadSecrets(rootDir: string): Record<string, string> {
  const secrets: Record<string, string> = {}

  // Load .env.local from root
  const envLocalPath = resolve(rootDir, '.env.local')
  if (existsSync(envLocalPath)) {
    const result = loadDotenv({ path: envLocalPath })
    if (result.parsed) {
      Object.assign(secrets, result.parsed)
    }
  }

  return secrets
}
