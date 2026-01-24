# Templates

[← Back to README](../README.md)

---

Everything in this folder gets copied to new projects via `/prepare-setup` or `/new-idea`. Each subfolder serves a specific purpose in bootstrapping Claude Code workflows.

## Quick Reference

| Folder | Purpose | Contents |
|--------|---------|----------|
| [workflows/](workflows/README.md) | Development processes | Git workflow, session management |
| [profiles/](profiles/README.md) | Base configurations | Plugins, permissions, hooks, agents |
| [knowledge/](knowledge/README.md) | Framework guides | Platform-specific patterns and gotchas |
| [skills/](skills/README.md) | Skills | Vercel agent-skills optimization rules |
| [commands/](commands/README.md) | Command guides | Implementation docs for commands |
| [ux-guides/](ux-guides/README.md) | UI patterns | Reusable interface implementations |
| [tasks/](tasks/README.md) | One-time activities | Post-setup tasks like codebase analysis |

---

## How It Works

```
/new-idea or /prepare-setup
         │
         ▼
┌─────────────────────────────┐
│  Select components from:    │
│  • workflows/               │
│  • profiles/                │
│  • knowledge/               │
│  • skills/                  │
│  • commands/                │
│  • tasks/                   │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  📦 Setup Package           │
│  Copy to new project        │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Target agent reads and     │
│  executes setup             │
└─────────────────────────────┘
```

---

## Workflows

Development processes that define how work gets done.

| Workflow | Description |
|----------|-------------|
| Session-Git-Workflow | Branch protection, session management, git discipline |

**[View all workflows →](workflows/README.md)**

---

## Profiles

Base configurations that set up Claude Code for a project.

| Profile | Description |
|---------|-------------|
| developer | Full workflow with plugins, session management, best practices |

**[View all profiles →](profiles/README.md)**

---

## Knowledge

Framework and platform guides with patterns and gotchas.

| Guide | Description |
|-------|-------------|
| Next.js-App-Build-Guide | Next.js + Better Auth + Drizzle + Turborepo |

> For development workflows, see [workflows/](workflows/README.md).

**[View all knowledge →](knowledge/README.md)**

---

## Skills

[Agent Skills](https://agentskills.io/home) - an open standard for portable agent capabilities (originally developed by Anthropic).

| Component | Description |
|-----------|-------------|
| skill-mapping.json | Maps skills to knowledge categories + recommended skills |
| [skill-name]/SKILL.md | Individual skill definitions |

Recommended skills (frontend-design, webapp-testing, turborepo, mcp-builder, docx, pptx, xlsx, pdf) are listed in spawned project SETUP.md based on selected knowledge categories.

**[View all skills →](skills/README.md)**

---

## Commands

Implementation guides for commands.

| Guide | Creates | Purpose |
|-------|---------|---------|
| END-SESSION-COMMAND | `/end-session`, `/commit` | End session, update docs, commit |
| Start-Session-Command | `/start-session` | Begin with branch awareness |
| New-Feature-Command | `/new-feature` | Create feature branch or worktree |
| Complete-Feature-Command | `/complete-feature` | Merge or create PR |
| Summary-Command | `/summary` | Generate accomplishments report |
| New Feature Workflow | `/feature` | Multi-phase feature development |
| New-Idea-Workflow | — | Documents `/new-idea` process |

**[View all commands →](commands/README.md)**

---

## UX Guides

Reusable UI/UX patterns with implementation details.

| Guide | Description |
|-------|-------------|
| Canvas-Panel-Navigation-System | Horizontal panel navigation with infinite scroll |

**[View all UX guides →](ux-guides/README.md)**

---

## Tasks

One-time setup activities that run after base configuration.

| Task | Description |
|------|-------------|
| ExistingProject-Investigate | Analyze codebase and generate documentation |

**[View all tasks →](tasks/README.md)**

---

## Adding Templates

Each folder has its own README with instructions for adding new content:

| To Add | Go To |
|--------|-------|
| Workflow | [workflows/README.md](workflows/README.md) |
| Profile | [profiles/README.md](profiles/README.md) |
| Knowledge | [knowledge/README.md](knowledge/README.md) |
| Skill | [skills/README.md](skills/README.md) (use `/add-skill` command) |
| Command | [commands/README.md](commands/README.md) |
| UX Guide | [ux-guides/README.md](ux-guides/README.md) |
| Task | [tasks/README.md](tasks/README.md) |
