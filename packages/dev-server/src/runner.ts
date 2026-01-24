import { spawn } from 'node:child_process'
import type { GeneratedEnv } from './env-builder.js'

export interface RunnerOptions {
  /** Working directory (monorepo root) */
  cwd: string
  /** Generated environment variables */
  generatedEnv: GeneratedEnv
  /** Secrets from .env.local */
  secrets: Record<string, string>
  /** Additional args to pass to turbo (e.g., --filter) */
  turboArgs: string[]
}

/**
 * Display the port assignment banner
 */
export function displayBanner(
  basePort: number,
  services: GeneratedEnv['services']
): void {
  const maxNameLen = Math.max(...services.map((s) => s.name.length))

  console.log('')
  console.log('┌─────────────────────────────────────────────────┐')
  console.log(`│ Ports assigned (base: ${basePort})${' '.repeat(24 - String(basePort).length)}│`)
  console.log('├─────────────────────────────────────────────────┤')

  for (const service of services) {
    const padding = ' '.repeat(maxNameLen - service.name.length)
    const urlPadding = ' '.repeat(30 - service.url.length)
    console.log(`│   ${service.name}:${padding}  ${service.url}${urlPadding}│`)
  }

  console.log('├─────────────────────────────────────────────────┤')
  console.log('│ Starting turbo dev...                           │')
  console.log('└─────────────────────────────────────────────────┘')
  console.log('')
}

/**
 * Display environment variables being injected (debug)
 */
export function displayEnvVars(env: Record<string, string>): void {
  const portVars = Object.entries(env).filter(([k]) => k.startsWith('PORT_') || k.endsWith('_URL'))
  if (portVars.length > 0) {
    console.log('Injected env vars:')
    for (const [key, value] of portVars) {
      console.log(`  ${key}=${value}`)
    }
    console.log('')
  }
}

/**
 * Run turbo dev with injected environment
 */
export function runTurboDev(options: RunnerOptions): Promise<number> {
  const { cwd, generatedEnv, secrets, turboArgs } = options

  // Merge environment: process.env < secrets < generated
  const env: Record<string, string> = {
    ...process.env as Record<string, string>,
    ...secrets,
    ...generatedEnv.env,
  }

  // Build turbo command
  const args = ['run', 'dev', ...turboArgs]

  return new Promise((resolve) => {
    const child = spawn('turbo', args, {
      cwd,
      env,
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      resolve(code ?? 0)
    })

    // Forward signals to child process
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP']
    for (const signal of signals) {
      process.on(signal, () => {
        child.kill(signal)
      })
    }
  })
}
