---
name: start-session
description: Begin session with branch awareness and context loading
allowed-tools: Read, Bash
---

# Start Session - Branch-Aware Entry Point

Begin a new coding session with branch safety check, git status, and context loading.

---

## Step 1: Check Current Branch

```bash
git branch --show-current
```

---

## Step 2: Branch Safety Check

Compare the branch name against protected branches: `main`, `master`, `develop`, `release/*`

### If on a PROTECTED branch

Display warning prominently:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PROTECTED BRANCH WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're on [branch] — a protected branch.
Direct changes here are not allowed to keep the codebase safe.

To start safe work:
→ /new-feature "short-description"    (creates branch or worktree)
→ Or: git checkout -b feature/your-name

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Then continue to show git status and session context below.

### If on a feature branch

Display confirmation:

```
✓ On branch: [branch] — safe to make changes
```

---

## Step 3: Git Status

```bash
git status --short --branch
```

Show:
- Modified/staged files
- Ahead/behind remote (if tracking)

---

## Step 4: Load Tool Intelligence (silently)

```bash
ls .project/tool-intelligence.md 2>/dev/null || echo "NO_INTELLIGENCE"
```

If file exists, read `.project/tool-intelligence.md` silently. Use this knowledge to:
- Proactively select tools throughout the session
- Skip exploration for known patterns
- Minimize tokens by avoiding redundant tool discovery

---

## Step 5: Load Session Note

```bash
ls .project/session-note.md 2>/dev/null || echo "NO_NOTE"
```

### If session note exists

Read `.project/session-note.md` and display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Note from Last Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Contents of session-note.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If no session note exists

Display the Getting Started guide:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 SQUARED AGENT - Getting Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome! This is your master agent for bootstrapping projects.

## Quick Commands

  /new-idea        → Design a new project through guided discovery
  /new-feature     → Create feature branch (safe to make changes)
  /prepare-setup   → Package templates for an existing project idea
  /summary         → Generate accomplishments report
  /end-session     → Wrap up session, update docs, commit

## First Steps

1. Have a project idea? Run /new-idea to design it together
2. Ready to code? Run /new-feature "description" first
3. Want to explore? Check templates/ for available content
4. Have feedback? Drop files in inbox/ideas/

## Project Structure

  templates/     → Exportable content (commands, knowledge, profiles)
  inbox/         → Your ideas and project feedback
  suggestions/   → My improvement proposals

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Execution Instructions

1. Get current branch name
2. Check if on protected branch → show warning if yes
3. Show git status (modified files, ahead/behind)
4. Load tool intelligence silently if exists
5. Show session note or Getting Started guide
6. Keep output concise and actionable
