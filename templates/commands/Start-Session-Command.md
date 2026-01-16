# Start-Session Command - Implementation Guide

A Claude Code command for beginning coding sessions with branch awareness, context loading, and session setup.

---

## Overview

The `/start-session` command is the recommended entry point for any coding session. It establishes context, checks branch safety, and loads relevant information.

### What It Does

| Step | Action |
|------|--------|
| 1 | Checks current branch against protected list |
| 2 | Shows warning if on protected branch |
| 3 | Displays git status (modified files, ahead/behind) |
| 4 | Loads tool intelligence (silently) |
| 5 | Shows session note or getting started guide |

---

## Files to Create

### Main Command: `.claude/commands/start-session.md`

```markdown
---
description: Begin session with branch awareness and context loading
allowed-tools: Read, Bash
---

# Start Session - Branch-Aware Entry Point

Begin a new coding session with branch safety check, git status, and context loading.

---

## Step 1: Check Current Branch

\```bash
git branch --show-current
\```

---

## Step 2: Branch Safety Check

Compare the branch name against protected branches: `main`, `master`, `develop`, `release/*`

### If on a PROTECTED branch

Display warning prominently:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PROTECTED BRANCH WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're on [branch] — a protected branch.
Direct changes here are not allowed to keep the codebase safe.

To start safe work:
→ /new-feature "short-description"    (creates branch or worktree)
→ Or: git checkout -b feature/your-name

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

Then continue to show git status and session context below.

### If on a feature branch

Display confirmation:

\```
✓ On branch: [branch] — safe to make changes
\```

---

## Step 3: Git Status

\```bash
git status --short --branch
\```

Show:
- Modified/staged files
- Ahead/behind remote (if tracking)

---

## Step 4: Load Tool Intelligence (silently)

\```bash
ls .project/tool-intelligence.md 2>/dev/null || echo "NO_INTELLIGENCE"
\```

If file exists, read `.project/tool-intelligence.md` silently. Use this knowledge to:
- Proactively select tools throughout the session
- Skip exploration for known patterns
- Minimize tokens by avoiding redundant tool discovery

---

## Step 5: Load Session Note

\```bash
ls .project/session-note.md 2>/dev/null || echo "NO_NOTE"
\```

### If session note exists

Read `.project/session-note.md` and display:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Note from Last Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Contents of session-note.md]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

### If no session note exists

Display the project-specific getting started guide or a generic welcome message.

---

## Execution Instructions

1. Get current branch name
2. Check if on protected branch → show warning if yes
3. Show git status (modified files, ahead/behind)
4. Load tool intelligence silently if exists
5. Show session note or getting started guide
6. Keep output concise and actionable
```

---

## Protected Branch Detection

### Pattern Matching

```javascript
const protectedBranches = ['main', 'master', 'develop'];
const protectedPatterns = [/^release\/.*/];

function isProtected(branch) {
  if (protectedBranches.includes(branch)) return true;
  return protectedPatterns.some(pattern => pattern.test(branch));
}
```

### Customization

Projects can customize the protected list in their command file:

```markdown
Protected branches: main, master, develop, release/*, staging, production
```

---

## Tool Intelligence Loading

### File Format

`.project/tool-intelligence.md` tracks learned tool preferences:

```markdown
# Tool Intelligence

## Learned Shortcuts

### Toolhive MCP
| Task Pattern | Server | Tool | Notes |
|--------------|--------|------|-------|
| Search GitHub | github | search_repositories | Faster than browsing |

### Plugins
| Task Pattern | Plugin | Skill | Notes |
|--------------|--------|-------|-------|
| Build UI | frontend-design | /frontend-design | High-quality interfaces |
```

### Silent Loading

The tool intelligence is loaded silently - not displayed to the user. It's used throughout the session to make proactive tool selections.

---

## Session Note Format

### Purpose

The session note is a handoff from the previous session. It tells the next session what to work on.

### Example

```markdown
# Next Session: Add User Authentication

## Task
Implement login/logout functionality with Better Auth.

## Context
- Database schema already has users table
- UI components in packages/ui ready to use
- Need OAuth providers: Google, GitHub

## Files to start with
- apps/web/app/api/auth/[...all]/route.ts
- packages/auth/src/index.ts
```

### Created By

The `/end-session` command creates/updates this file when wrapping up.

---

## Output Examples

### On Protected Branch (main)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PROTECTED BRANCH WARNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're on main — a protected branch.
Direct changes here are not allowed to keep the codebase safe.

To start safe work:
→ /new-feature "short-description"
→ Or: git checkout -b feature/your-name

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Git Status: Clean, in sync with origin/main

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Note from Last Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Task
Add user authentication with OAuth providers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### On Feature Branch

```
✓ On branch: feature/add-auth — safe to make changes

Git Status:
 M apps/web/app/api/auth/route.ts
 M packages/auth/src/index.ts

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Note from Last Session
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Task
Continue implementing OAuth callback handlers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Setup Requirements

### Directory Structure

```
project/
├── .claude/
│   └── commands/
│       └── start-session.md
├── .project/                    # Gitignored
│   ├── session-note.md          # Handoff from last session
│   └── tool-intelligence.md     # Learned preferences
└── .gitignore
```

### Gitignore

```gitignore
# Local session data
.project/
```

---

## Key Design Decisions

### Warning vs Blocking

The command **warns** about protected branches but doesn't block. This allows:
- User to see the full context
- Informed decision to proceed or switch
- Teaching without frustration

### Silent Tool Loading

Tool intelligence is loaded silently because:
- User doesn't need to see it
- Reduces output noise
- Applied automatically throughout session

### Session Note as Handoff

The session note serves as a handoff document:
- Written by `/end-session`
- Read by `/start-session`
- Creates continuity between sessions
