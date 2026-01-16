# Knowledge

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

Framework and platform guides that help Claude build correctly with specific technologies. These capture patterns, gotchas, and best practices learned from real projects.

> **Note:** For development workflows like Session Git Workflow, see [workflows/](../workflows/README.md).

## Available Knowledge

| Guide | Description |
|-------|-------------|
| [Next.js-App-Build-Guide.md](Next.js-App-Build-Guide.md) | Next.js with Better Auth, Drizzle ORM, Turborepo |

---

## Next.js-App-Build-Guide

**Location:** `templates/knowledge/Next.js-App-Build-Guide.md`

Comprehensive guide for building Next.js applications with authentication and database.

| Section | What It Covers |
|---------|---------------|
| Monorepo Setup | Turborepo with apps/ and packages/ |
| Database | Drizzle ORM patterns, schema, migrations |
| Authentication | Better Auth setup, providers, gotchas |
| Environment | Variable management across packages |
| UI Components | shadcn/ui in monorepo |
| Server Actions | Data mutation patterns |
| Route Protection | Middleware and onboarding |
| Common Pitfalls | Real issues and solutions |

**Best for:** Next.js projects needing auth, database, or monorepo structure.

---

## Adding Knowledge

1. Create file: `templates/knowledge/[Technology]-Guide.md`

2. Structure with these sections:
   - Overview — What and why
   - Architecture — How components fit together
   - Setup — Configuration requirements
   - Key Patterns — Implementation examples
   - Common Pitfalls — Issues and solutions
   - Checklist — Quick reference

3. Update this README with the new guide

**Naming:** `[Technology]-Guide.md` or `[Technology]-[Pattern]-Guide.md`

**Examples:** `React-Testing-Guide.md`, `PostgreSQL-Optimization-Guide.md`

---

## How Knowledge Gets Used

1. **During `/new-idea`** — Recommended based on platform choice
2. **During development** — Agents consult for implementation guidance
3. **For troubleshooting** — Reference for common pitfalls
