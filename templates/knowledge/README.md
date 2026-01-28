# Knowledge

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

Framework and platform guides organized by category. Select what you need for each project.

> **Note:** For development workflows like Session Git Workflow, see [workflows/](../workflows/README.md).

## Categories

### Web Frameworks

| Platform | Guide | Description |
|----------|-------|-------------|
| **Next.js** | [web/nextjs/](web/nextjs/) | App Router patterns, overview of stack |

### Databases

| Database | Guide | Description |
|----------|-------|-------------|
| **Drizzle ORM** | [database/drizzle/](database/drizzle/) | SQLite, schema, migrations, Next.js config |

### Authentication

| Auth | Guide | Description |
|------|-------|-------------|
| **Better Auth** | [auth/better-auth/](auth/better-auth/) | OAuth, organizations, singular table names |

### Monorepo

| Tool | Guide | Description |
|------|-------|-------------|
| **Turborepo** | [monorepo/turborepo/](monorepo/turborepo/) | pnpm workspaces, turbo.json, packages |

### Patterns (framework-agnostic)

| Pattern | Guide | Description |
|---------|-------|-------------|
| Server Actions | [patterns/Server-Actions-Patterns.md](patterns/Server-Actions-Patterns.md) | CRUD, validation, error handling |
| Route Protection | [patterns/Route-Protection-Onboarding.md](patterns/Route-Protection-Onboarding.md) | Auth guards, onboarding flows |
| Developer Experience | [patterns/Developer-Experience-Checklist.md](patterns/Developer-Experience-Checklist.md) | Handoffs, seed scripts, checklists |

---

## Selection During /spawn-project

Choose from each category independently:

```
1. Web framework?     → Next.js / None
2. Database?          → Drizzle / None
3. Auth?              → Better Auth / None
4. Monorepo?          → Turborepo / None
5. Patterns?          → Server Actions, Route Protection, DX Checklist
```

---

## Common Combinations

| Project Type | Web | Database | Auth | Monorepo | Patterns |
|--------------|-----|----------|------|----------|----------|
| Full-stack SaaS | Next.js | Drizzle | Better Auth | Turborepo | All |
| Simple Next.js | Next.js | Drizzle | - | - | Server Actions |
| API backend | - | Drizzle | Better Auth | - | Server Actions |
| Monorepo setup | - | - | - | Turborepo | - |

---

## Related Skills

Knowledge guides are complemented by [Agent Skills](https://agentskills.io/home) - portable capabilities that work across Claude Code, Cursor, VS Code, and more.

**Recommended skills by category:**

| Category | Skills |
|----------|--------|
| web | frontend-design, webapp-testing, web-artifacts-builder, theme-factory |
| monorepo | turborepo |
| patterns | mcp-builder, docx, pptx, xlsx, pdf, skill-creator |

**Install recommended skills:**
```bash
npx skills add anthropics/skills
```

Skills matching selected knowledge categories are automatically included when running `/spawn-project`.

---

## Adding Knowledge

1. Create category folder if needed: `templates/knowledge/[category]/[tool]/`
2. Add guide: `[Tool]-Guide.md`
3. Update this README

**Structure:**
```
templates/knowledge/
├── [category]/
│   └── [tool]/
│       └── [Tool]-Guide.md
```

**Examples:**
- `database/prisma/Prisma-Guide.md`
- `auth/clerk/Clerk-Guide.md`
- `web/remix/Remix-Guide.md`
- `mobile/react-native/React-Native-Guide.md`
