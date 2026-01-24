# Dev Server with Dynamic Port Allocation

## Problem

Current setup uses symlinked `.env` files (root `.env` → apps). This causes:
- Port conflicts when multiple worktrees run simultaneously
- Agents can't independently test their versions
- Not recommended by Turborepo

## Solution

A `packages/dev-server` package that wraps `turbo dev`:
1. Scans for first available contiguous port range
2. Injects port-related env vars (`PORT`, `API_URL`, etc.)
3. Runs Turborepo with injected environment
4. No persistence - ports freed when process exits

## Architecture

```
pnpm dev
    │
    ▼
packages/dev-server
    │
    ├── 1. Scan ports 3000-5000 for N free contiguous ports
    │
    ├── 2. Assign deterministically:
    │       API      = base + 0
    │       Web      = base + 1
    │       Workers  = base + 2
    │       ...
    │
    ├── 3. Build env vars:
    │       PORT_API=3100
    │       PORT_WEB=3101
    │       API_URL=http://localhost:3100
    │       WEB_URL=http://localhost:3101
    │
    ├── 4. Load .env.local (secrets)
    │
    └── 5. Spawn: turbo run dev (with injected env)
```

## Configuration

Service mapping in root `package.json`:

```json
{
  "devPorts": {
    "api": { "offset": 0, "env": "PORT" },
    "web/dashboard": { "offset": 1, "env": "PORT" },
    "workers/queue": { "offset": 2, "env": "PORT" }
  }
}
```

Or in `turbo.json` under a custom key.

## Package Structure

```
packages/
  dev-server/
    src/
      index.ts           # CLI entry point
      port-scanner.ts    # Find available port range
      env-builder.ts     # Build env vars from config
      runner.ts          # Spawn turbo with injected env
    package.json
    tsconfig.json
```

## Generated Environment Variables

For each service, generates:
- `PORT_<SERVICE>` - The assigned port
- `<SERVICE>_URL` - Full URL for cross-service communication

Example with base port 3100:
```bash
PORT_API=3100
PORT_WEB_DASHBOARD=3101
API_URL=http://localhost:3100
DASHBOARD_URL=http://localhost:3101
```

## App Integration

Apps read env vars as normal:

```typescript
// apps/web/dashboard/src/lib/api.ts
const apiUrl = process.env.API_URL ?? 'http://localhost:3000'

// apps/api/src/index.ts
const port = process.env.PORT ?? 3000
```

Fallbacks provide sensible defaults for production or standalone dev.

## Usage

```bash
# Full stack (all apps)
pnpm dev

# Single app (still gets correct URLs)
pnpm dev --filter @squared-agent/dashboard
```

Output shows assigned ports:
```
┌─────────────────────────────────────────────┐
│ Ports assigned (base: 3100)                 │
│   api:            http://localhost:3100     │
│   web/dashboard:  http://localhost:3101     │
├─────────────────────────────────────────────┤
│ Starting turbo dev...                       │
└─────────────────────────────────────────────┘
```

## Edge Cases

| Scenario | Handling |
|----------|----------|
| No available range | Error: "No available port range of N ports between 3000-5000" |
| Port taken mid-session | Service fails, user restarts `pnpm dev` (gets new range) |
| Secrets needed | `.env.local` loaded first, ports layered on top |
| Production | Unchanged - deploy scripts set env vars directly |

## What This Replaces

- Remove symlinked `.env` files from apps
- Keep `.env.example` for documentation
- Keep `.env.local` for secrets (gitignored)

## Root Scripts

```json
{
  "scripts": {
    "dev": "turbo-dev",
    "dev:turbo": "turbo run dev"
  }
}
```

## Benefits

1. **No port conflicts** - Each worktree gets unique range
2. **Agent-friendly** - Just run `pnpm dev`, no special knowledge
3. **No stale state** - Nothing persisted, nothing to clean up
4. **Production unchanged** - Deploy process stays the same
5. **Secrets separate** - `.env.local` for sensitive values
6. **Reusable** - Package can be used across spawned projects
