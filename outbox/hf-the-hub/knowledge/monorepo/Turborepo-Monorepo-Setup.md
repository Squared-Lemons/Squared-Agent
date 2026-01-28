# Turborepo Quick Start

Get a pnpm + Turborepo monorepo running in 5 minutes.

> **For depth**: The **Turborepo skill** auto-activates when you work on monorepo tasks. It covers anti-patterns (15+ common mistakes), caching strategies, CI/CD optimization, and environment variable handling.
>
> Install: `npx skills add https://github.com/vercel/turborepo --skill turborepo`

---

## Structure

```
project/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router
│       ├── components/         # App-specific components
│       ├── lib/                # Utilities, actions
│       └── package.json
├── packages/
│   ├── database/               # Database schema & client
│   ├── auth/                   # Authentication configuration
│   ├── ui/                     # Shared UI components (shadcn)
│   └── config/                 # Shared configs (typescript, tailwind)
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

---

## Root package.json

```json
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@9.15.0"
}
```

---

## pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

---

## Package Naming Convention

Use a consistent namespace for internal packages:

```json
// packages/database/package.json
{ "name": "@app/database" }

// apps/web/package.json - referencing internal packages
{
  "dependencies": {
    "@app/database": "workspace:*",
    "@app/auth": "workspace:*",
    "@app/ui": "workspace:*"
  }
}
```

---

## Environment Variables

**Recommended**: Keep `.env` files per-package, not at root.

```
apps/web/.env.local          # Web app env vars
packages/database/.env       # Database connection
```

Declare which env vars Turborepo should watch for cache invalidation in `turbo.json`:

```json
{
  "globalEnv": ["DATABASE_URL", "AUTH_SECRET"],
  "tasks": {
    "build": {
      "env": ["NEXT_PUBLIC_*"]
    }
  }
}
```

> **Why per-package?** Root `.env` with symlinks is a common anti-pattern. It creates sync issues and makes it unclear which package needs which variables. The Turborepo skill covers this in depth.

---

## Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Package not found | Missing workspace dep | Add `@app/package: workspace:*` to package.json |
| Types not resolving | Missing build step | Run `turbo run build` or add tsup to package |
| Dev server slow | Cache issues | Run `turbo run clean` |

---

*See also: [Drizzle ORM Guide](../../database/drizzle/Drizzle-ORM-Guide.md), [Better Auth Guide](../../auth/better-auth/Better-Auth-Guide.md)*
