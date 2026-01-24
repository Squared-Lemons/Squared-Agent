import { createServer, type Server } from 'node:net'

/**
 * Check if a single port is available
 */
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server: Server = createServer()

    server.once('error', () => {
      resolve(false)
    })

    server.once('listening', () => {
      server.close(() => {
        resolve(true)
      })
    })

    server.listen(port, '127.0.0.1')
  })
}

/**
 * Check if a contiguous range of ports is available
 */
async function isRangeAvailable(
  basePort: number,
  count: number
): Promise<boolean> {
  const checks = Array.from({ length: count }, (_, i) =>
    isPortAvailable(basePort + i)
  )
  const results = await Promise.all(checks)
  return results.every(Boolean)
}

export interface PortScanOptions {
  /** Start of port range to scan (default: 3000) */
  startPort?: number
  /** End of port range to scan (default: 5000) */
  endPort?: number
  /** Number of contiguous ports needed (default: 10) */
  portsNeeded?: number
  /** Ports to skip (commonly used by other tools) */
  skipPorts?: number[]
}

export interface PortScanResult {
  success: true
  basePort: number
}

export interface PortScanError {
  success: false
  error: string
}

const DEFAULT_SKIP_PORTS = [
  3000, // Common dev default
  3001, // Common API default
  4000, // Remix default
  5000, // Flask/various
  5173, // Vite default
  5432, // PostgreSQL
  6379, // Redis
  8000, // Django/various
  8080, // Common HTTP alt
  8888, // Jupyter
]

/**
 * Find the first available contiguous port range
 */
export async function findAvailablePortRange(
  options: PortScanOptions = {}
): Promise<PortScanResult | PortScanError> {
  const {
    startPort = 3100,
    endPort = 5000,
    portsNeeded = 10,
    skipPorts = DEFAULT_SKIP_PORTS,
  } = options

  const skipSet = new Set(skipPorts)

  for (let basePort = startPort; basePort <= endPort - portsNeeded; basePort++) {
    // Skip if base port or any port in range is in skip list
    const rangeConflictsWithSkip = Array.from(
      { length: portsNeeded },
      (_, i) => basePort + i
    ).some((p) => skipSet.has(p))

    if (rangeConflictsWithSkip) {
      continue
    }

    const available = await isRangeAvailable(basePort, portsNeeded)
    if (available) {
      return { success: true, basePort }
    }
  }

  return {
    success: false,
    error: `No available port range of ${portsNeeded} ports between ${startPort}-${endPort}`,
  }
}
