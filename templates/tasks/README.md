# Tasks

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

One-time setup activities that run after base configuration. Unlike commands (which run repeatedly), tasks execute once during project setup.

## Available Tasks

| Task | Description |
|------|-------------|
| [ExistingProject-Investigate.md](ExistingProject-Investigate.md) | Analyze codebase and generate documentation |

---

## ExistingProject-Investigate

**Location:** `templates/tasks/ExistingProject-Investigate.md`

Analyze an existing codebase and generate comprehensive documentation.

| Phase | What Happens |
|-------|--------------|
| Discovery | Map structure, identify stack, find configs |
| Database | Document schema, relationships, migrations |
| Codebase | Trace entry points, map architecture |
| Dependencies | Review packages, infrastructure |
| Output | Generate `@docs/` folder |

**Creates:**
| File | Contents |
|------|----------|
| `@docs/OVERVIEW.md` | Quick reference — stack, commands, structure |
| `@docs/ARCHITECTURE.md` | System design and patterns |
| `@docs/DATABASE.md` | Schema documentation |
| `@docs/COMPONENTS.md` | Module breakdown |
| `@docs/CONVENTIONS.md` | Code patterns |
| `@docs/SETUP.md` | Local dev setup |

**Best for:** Onboarding to an existing codebase. Run once, then use the generated docs.

---

## Adding a Task

1. Create file: `templates/tasks/[Action]-[Target].md`

2. Structure with these sections:
   - Overview — What and why
   - Prerequisites — Requirements before running
   - Phases — Step-by-step execution
   - Outputs — What gets created
   - Verification — How to confirm success

3. Update this README with the new task

**Naming:** `[Action]-[Target].md`
- Action: What's being done (Investigate, Migrate, Audit)
- Target: What it's applied to (Project, Database, Dependencies)

**Examples:** `Database-Migration.md`, `Security-Audit.md`, `Dependency-Update.md`

---

## How Tasks Get Used

1. Run `/prepare-setup`
2. Select a profile
3. Choose tasks to include
4. Setup package includes task instructions
5. Tasks execute after base setup completes

---

## Task Ideas

Consider creating tasks for:
- **Database-Migration** — Set up or migrate schema
- **Security-Audit** — Review for vulnerabilities
- **Dependency-Update** — Update and audit packages
- **Performance-Analysis** — Profile and find bottlenecks
- **Testing-Setup** — Configure test framework
