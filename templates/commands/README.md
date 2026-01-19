# Commands

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

Implementation guides for Claude Code commands. These are documentation files that agents read to generate actual executable commands in `.claude/commands/`.

## How It Works

```
templates/commands/               .claude/commands/
┌─────────────────────────┐      ┌─────────────────────────┐
│ END-SESSION-COMMAND.md  │  ──► │ end-session.md          │
│ (documentation)         │      │ (executable command)    │
└─────────────────────────┘      └─────────────────────────┘
```

## Available Commands

| Guide | Creates | Purpose |
|-------|---------|---------|
| [END-SESSION-COMMAND.md](END-SESSION-COMMAND.md) | `/end-session`, `/commit` | End session, update docs, commit |
| [Start-Session-Command.md](Start-Session-Command.md) | `/start-session` | Begin session with branch awareness |
| [New-Feature-Command.md](New-Feature-Command.md) | `/new-feature` | Create feature branch or worktree |
| [Complete-Feature-Command.md](Complete-Feature-Command.md) | `/complete-feature` | Merge or create PR |
| [Summary-Command.md](Summary-Command.md) | `/summary` | Generate accomplishments report |
| [New Feature Workflow.md](New%20Feature%20Workflow.md) | `/feature` | Multi-phase feature development |
| [New-Idea-Workflow.md](New-Idea-Workflow.md) | — | Documents the `/new-idea` process |

---

## END-SESSION-COMMAND

**Location:** `templates/commands/END-SESSION-COMMAND.md`

The complete end-session workflow with documentation updates and creator feedback.

| Step | What Happens |
|------|--------------|
| 1 | Reviews git diff and commits |
| 2 | Updates README.md and CLAUDE.md |
| 3 | Captures lessons in LEARNINGS.md |
| 4 | Saves session log (gitignored) |
| 5 | Extracts token usage for cost tracking |
| 6 | Creates session note for next time |
| 7 | Generates SETUP.md handoff |
| 8 | Generates creator feedback |
| 9 | Commits with user approval |

**Creates:** `.claude/commands/end-session.md`, `.claude/commands/commit.md`

---

## Start-Session-Command

**Location:** `templates/commands/Start-Session-Command.md`

Session entry point with branch awareness and context loading.

| Feature | What It Does |
|---------|--------------|
| Branch Check | Warns if on protected branch |
| Git Status | Shows modified files, ahead/behind |
| Tool Intelligence | Loads learned preferences |
| Session Note | Shows task from last session |

**Creates:** `.claude/commands/start-session.md`

---

## New-Feature-Command

**Location:** `templates/commands/New-Feature-Command.md`

Safe feature branch creation with worktree support.

| Feature | What It Does |
|---------|--------------|
| Branch Naming | Converts description to slug |
| Uncommitted Changes | Offers stash/commit/bring options |
| Worktree Mode | Parallel development option |

**Creates:** `.claude/commands/new-feature.md`

---

## Complete-Feature-Command

**Location:** `templates/commands/Complete-Feature-Command.md`

Feature branch completion with merge or PR options.

| Path | What Happens |
|------|--------------|
| Merge | Checkout main, merge --no-ff, delete branch |
| PR | Push with -u, create PR via gh |

**Creates:** `.claude/commands/complete-feature.md`

---

## Summary-Command

**Location:** `templates/commands/Summary-Command.md`

Accomplishments report from git history and session logs.

| Feature | What It Does |
|---------|--------------|
| Time Range | Today, week, month, or custom |
| Categories | Features, fixes, refactors, docs, tests |
| Format | Copy-paste ready output |

**Creates:** `.claude/commands/summary.md`

---

## New Feature Workflow

**Location:** `templates/commands/New Feature Workflow.md`

Feature development using Feature-Dev and Ralph Loop plugins.

| Phase | What Happens |
|-------|--------------|
| Explore | code-explorer analyzes codebase |
| Architect | code-architect designs solution |
| Implement | Ralph Loop iterates until done |
| Review | code-reviewer checks quality |

**Best for:** Complex features needing architecture planning.

---

## New-Idea-Workflow

**Location:** `templates/commands/New-Idea-Workflow.md`

Documents the consultative discovery process behind `/new-idea`.

| Phase | What Happens |
|-------|--------------|
| Discovery | Understand idea, users, problems |
| Scope | Define v1 vs future |
| Technical | Platform and stack decisions |
| Output | PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md, SETUP.md |

**Best for:** Understanding or extending `/new-idea`.

---

## Adding a Command

1. Create file: `templates/commands/[Command-Name]-Command.md`

2. Structure with these sections:
   - Overview — What the command does
   - What It Does — Step-by-step breakdown
   - Files to Create — The actual `.claude/commands/*.md` content
   - Troubleshooting — Common issues

3. Update this README with the new command

**Naming:** `[Command-Name]-Command.md` or `[Workflow-Name]-Workflow.md`
