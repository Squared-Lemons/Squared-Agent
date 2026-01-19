# Next.js App Build Guide

A comprehensive stack for building Next.js applications with authentication, database, and monorepo structure.

---

## Stack Overview

| Layer | Technology | Guide |
|-------|------------|-------|
| **Monorepo** | Turborepo + pnpm | [Turborepo Monorepo Setup](../../monorepo/turborepo/Turborepo-Monorepo-Setup.md) |
| **Database** | Drizzle ORM + SQLite | [Drizzle ORM Guide](../../database/drizzle/Drizzle-ORM-Guide.md) |
| **Auth** | Better Auth | [Better Auth Guide](../../auth/better-auth/Better-Auth-Guide.md) |
| **Server Logic** | Next.js Server Actions | [Server Actions Patterns](../../patterns/Server-Actions-Patterns.md) |
| **Route Protection** | Client-side guards | [Route Protection & Onboarding](../../patterns/Route-Protection-Onboarding.md) |
| **DX** | Handoffs, seed scripts | [Developer Experience Checklist](../../patterns/Developer-Experience-Checklist.md) |

---

## Quick Start

### 1. Set Up Monorepo

Follow [Turborepo Monorepo Setup](../../monorepo/turborepo/Turborepo-Monorepo-Setup.md) to create:

```
project/
├── apps/web/           # Next.js app
├── packages/database/  # Drizzle schema
├── packages/auth/      # Better Auth config
├── packages/ui/        # Shared components
└── turbo.json
```

### 2. Configure Database

Follow [Drizzle ORM Guide](../../database/drizzle/Drizzle-ORM-Guide.md) for:
- Schema definition
- Migration setup
- Singleton pattern for dev
- Next.js configuration

### 3. Add Authentication

Follow [Better Auth Guide](../../auth/better-auth/Better-Auth-Guide.md) for:
- **Critical**: Singular table names (`user`, not `users`)
- Auth schema setup
- OAuth configuration
- Client/server setup

### 4. Build Features

Use [Server Actions Patterns](../../patterns/Server-Actions-Patterns.md) for:
- CRUD operations
- Auth checks
- Zod validation
- Error handling

### 5. Protect Routes

Use [Route Protection & Onboarding](../../patterns/Route-Protection-Onboarding.md) for:
- OnboardingCheck component
- Multi-step onboarding
- Layout protection

### 6. Prepare for Handoff

Use [Developer Experience Checklist](../../patterns/Developer-Experience-Checklist.md) for:
- SETUP.md template
- .env.example
- Seed scripts
- Feature status tracking

---

## Common Pitfalls Quick Reference

| Issue | Solution |
|-------|----------|
| Better Auth "model not found" | Use singular table names: `user`, `session`, `account` |
| OAuth button does nothing | Add `baseURL` to betterAuth() config |
| Env vars undefined in Next.js | Symlink `.env` to `apps/web/.env` |
| Database path wrong | Use `../../packages/...` relative to apps/web |
| better-sqlite3 errors | Add `serverExternalPackages` to next.config.js |

---

## When to Use Each Guide

| Scenario | Guides to Include |
|----------|-------------------|
| Full-stack app with auth | All guides |
| API-only backend | Drizzle, Server Actions |
| Static site with DB | Drizzle only |
| Auth without organizations | Better Auth (skip org sections) |
| Existing project, add auth | Better Auth, Route Protection |

---

*Based on lessons learned from real projects. Each guide can be used independently.*
