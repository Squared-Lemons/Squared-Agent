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

## Step 5: Check for Updates

Check if there's an updates folder with pending updates from the master agent:

```bash
ls inbox/updates/*.md 2>/dev/null | head -1 || echo "NO_UPDATES"
```

### If no updates folder or no updates

Continue to the next step.

### If updates found

Display the update(s):

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Updates Available from Squared Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[N] update(s) found in inbox/updates/

[For each update file, show: filename and brief summary from the ## What's New section]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask using AskUserQuestion:
- **Apply now** - Review and apply the updates
- **Skip** - Continue without applying (can apply later)

### If user chooses to apply

For each update file:

1. Read the full update file
2. Display the "What's New" section
3. Follow the "To Apply" instructions:
   - Copy new commands to `.claude/commands/`
   - Copy knowledge files to `docs/knowledge/`
   - Install recommended skills if any
   - Update CLAUDE.md with new command documentation
4. After applying, move the update file to `inbox/updates/applied/`:

```bash
mkdir -p inbox/updates/applied
mv inbox/updates/[filename].md inbox/updates/applied/
```

5. Confirm: "Update applied. [summary of what was added]"

---

## Step 6: Load Session Note

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
 GYM MANAGEMENT SYSTEM - Getting Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Welcome! This is the Gym Management System v1 prototype.

## Quick Commands

  /new-feature     → Create feature branch (safe to make changes)
  /complete-feature → Merge or create PR when done
  /commit          → Draft commit message with approval
  /end-session     → Wrap up session, update docs, commit
  /summary         → Generate accomplishments report

## V1 Scope

  ✓ Onboarding (org + first gym)
  ✓ Gym management (CRUD)
  ✓ Member management (CRUD + QR codes)
  ✓ Multi-tenancy

## Tech Stack

  Next.js 15 + Better Auth + SQLite/Drizzle + shadcn/ui

## First Steps

1. Run /new-feature "description" to start safe development
2. Check README.md for full project specification
3. Check CLAUDE.md for project-specific patterns

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Execution Instructions

1. Get current branch name
2. Check if on protected branch → show warning if yes
3. Show git status (modified files, ahead/behind)
4. Load tool intelligence silently if exists
5. Check for updates in `inbox/updates/` → offer to apply if found
6. Show session note or Getting Started guide
7. Keep output concise and actionable
