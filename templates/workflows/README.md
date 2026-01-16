# Workflows

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

Development workflows that define how work gets done. These are the processes and patterns that spawned projects inherit.

## Available Workflows

| Workflow | Description |
|----------|-------------|
| [Session-Git-Workflow.md](Session-Git-Workflow.md) | Branch protection, session management, and git discipline |

---

## Session-Git-Workflow

**Location:** `templates/workflows/Session-Git-Workflow.md`

The disciplined git workflow that keeps codebases safe. This is the core workflow that Squared Agent itself uses and passes to every spawned project.

| Component | What It Does |
|-----------|--------------|
| Branch Protection | Blocks changes on main/master/develop/release/* |
| Session Commands | `/start-session`, `/commit`, `/end-session` |
| Feature Commands | `/new-feature`, `/complete-feature` |
| Worktree Support | Parallel development without stashing |

**Commands created:**
- `.claude/commands/start-session.md`
- `.claude/commands/new-feature.md`
- `.claude/commands/complete-feature.md`
- `.claude/commands/end-session.md`
- `.claude/commands/commit.md`

**Best for:** Every project. Git discipline should be universal.

---

## Adding a Workflow

1. Create file: `templates/workflows/[Workflow-Name].md`

2. Structure with these sections:
   - Overview — What the workflow is
   - Diagram — Visual flow (Mermaid preferred)
   - Commands — What commands it uses/creates
   - Example — Walkthrough of the workflow
   - Key Principles — Core concepts

3. Update this README with the new workflow

**Naming:** Title-Case with hyphens (`Session-Git-Workflow.md`)

---

## How Workflows Get Used

1. **By Squared Agent** — This agent follows the Session Git Workflow
2. **By spawned projects** — Workflows are included in setup packages
3. **As reference** — Documentation for how things should work
