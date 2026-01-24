# Start-Session Command - Implementation Guide

A Claude Code command for beginning coding sessions with setup detection, branch awareness, context loading, and session setup.

---

## Overview

The `/start-session` command is the recommended entry point for any coding session. It establishes context, checks branch safety, detects first-run setups, and loads relevant information.

### What It Does

| Step | Action |
|------|--------|
| 0 | Detects `SETUP.md` (spawned project) or fresh clone, runs setup if needed |
| 1 | Checks current branch against protected list |
| 2 | If protected: checks for updates (about to start new work) |
| 3 | If feature: skips to session note (already working) |
| 4 | Displays git status, loads tool intelligence |
| 5 | Shows protected branch warning or feature branch confirmation |
| 6 | Shows session note or getting started guide |

---

## Files to Create

### Main Command: `.claude/commands/start-session.md`

```markdown
---
name: start-session
description: Begin session with branch awareness and context loading
allowed-tools: Read, Bash, Write, AskUserQuestion
---

# Start Session - Branch-Aware Entry Point

Begin a new coding session with setup detection, branch safety check, git status, and context loading.

---

## Step 0: Check Setup Status

First, check if this is a freshly spawned project by looking for SETUP.md:

\```bash
ls SETUP.md 2>/dev/null || echo "NO_SETUP_FILE"
\```

### If SETUP.md exists (Spawned Project)

This project has setup documents. Ask using AskUserQuestion:
- **Run Setup** — Execute the guided setup from SETUP.md
- **Skip** — Continue without setup (will ask again next session)
- **Archive** — Move setup docs to knowledge/setup/ without running (cleanup)

If user chooses "Run Setup":
1. Read and follow SETUP.md instructions
2. After completion, archive setup documents

If user chooses "Archive":
1. Archive without running (for cleanup when setup was done manually)

\```bash
mkdir -p knowledge/setup
mv SETUP.md knowledge/setup/
mv PROJECT-BRIEF.md knowledge/setup/ 2>/dev/null
mv TECHNICAL-DECISIONS.md knowledge/setup/ 2>/dev/null
\```

The absence of SETUP.md indicates setup is complete.

### If no SETUP.md, check config file

\```bash
cat .project/config.json 2>/dev/null || echo "NO_CONFIG"
\```

### If NO_CONFIG and .project/ directory exists (Migration)

This is an existing user who was here before config tracking. Create the config file:

\```bash
ls -d .project 2>/dev/null || echo "NO_PROJECT_DIR"
\```

If `.project/` exists but no config:

\```json
{
  "setup_complete": true,
  "setup_date": "[TODAY]",
  "setup_version": "1.0",
  "migrated": true,
  "preferences": {
    "show_outbox_on_start": true
  }
}
\```

Write this to `.project/config.json` and display:

\```
Config file created for existing workspace.
\```

Continue to Step 1.

### If NO_CONFIG and no .project/ directory (Fresh Clone)

Run the **Guided Setup Flow** (see below), then continue to Step 1.

### If config exists and setup_complete is true

Continue to Step 1.

### If config exists and setup_complete is false

Run the **Guided Setup Flow**, then continue to Step 1.

---

## Guided Setup Flow

Display the welcome and run through setup:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to [Project Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's make sure everything is configured for your first session.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

### Setup Step 1/3: Check Prerequisites

\```bash
node --version 2>/dev/null || echo "NO_NODE"
pnpm --version 2>/dev/null || echo "NO_PNPM"
git --version 2>/dev/null || echo "NO_GIT"
\```

Display:
\```
Step 1/3: Checking prerequisites...

✓ Node.js [version] detected
✓ pnpm [version] detected
✓ Git repository initialized
\```

If any missing, warn but continue:
\```
⚠ [tool] not found - some features may not work
\```

### Setup Step 2/3: Install Dependencies

\```bash
ls node_modules 2>/dev/null || echo "NO_MODULES"
\```

If `NO_MODULES`:
\```
Step 2/3: Installing dependencies...

Running: pnpm install
\```

Run `pnpm install` and show:
\```
✓ Dependencies installed
\```

If `node_modules` exists:
\```
Step 2/3: Dependencies already installed ✓
\```

### Setup Step 3/3: Create Local Workspace

\```bash
mkdir -p .project/sessions
\```

Create `.project/config.json`:

\```json
{
  "setup_complete": true,
  "setup_date": "[TODAY]",
  "setup_version": "1.0",
  "preferences": {
    "show_outbox_on_start": true
  }
}
\```

Create `.project/tool-intelligence.md` if it doesn't exist:

\```markdown
# Tool Intelligence

Learned tool preferences for this workspace. Updated by /end-session.

## Learned Shortcuts

(Empty - will populate as you work)
\```

Display:
\```
Step 3/3: Creating local workspace...

✓ .project/config.json created
✓ .project/sessions/ directory created
✓ .project/tool-intelligence.md initialized
\```

### Setup Complete

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're ready to start. Run /new-feature "description" to begin work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Step 1: Check Current Branch

\```bash
git branch --show-current
\```

---

## Step 2: Branch Safety Check

Compare the branch name against protected branches: `main`, `master`, `develop`, `release/*`

### If on a PROTECTED branch

You're about to start something new. This is a good time to check for updates.

**Continue to Step 3** (git status), then **Step 5** (check for updates).

After checking updates, display the warning:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PROTECTED BRANCH — Ready to Start
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're on [branch] — a protected branch.
Direct changes here are not allowed to keep the codebase safe.

To start safe work:
→ /new-feature "short-description"    (creates branch or worktree)
→ Or: git checkout -b feature/your-name

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

### If on a feature branch

You're in the middle of work. Check for a handover document first, then get straight to it.

**Continue to Step 2b** (check for handover), then **skip to Step 6** (session note).

---

## Step 2b: Check for Handover (Feature Branches Only)

Check if there's a handover document for this branch:

\```bash
BRANCH=$(git branch --show-current)
ls outbox/handovers/${BRANCH}-*.md 2>/dev/null | head -1 || echo "NO_HANDOVER"
\```

### If handover found

Read and display the handover:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Handover Document Found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Contents of the handover document]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

Ask using AskUserQuestion:
- **Got it, delete handover** - Remove the handover file (context received)
- **Keep handover** - Leave it for reference

### If no handover

Display confirmation and continue:

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

## Step 5: Check for Updates (spawned projects only)

Check if there's an updates folder with pending updates from the parent agent:

\```bash
ls inbox/updates/*.md 2>/dev/null | head -1 || echo "NO_UPDATES"
\```

### If no updates folder or no updates

Continue to the next step.

### If updates found

Display the update(s):

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Updates Available from Parent Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[N] update(s) found in inbox/updates/

[For each update file, show: filename and brief summary from the ## What's New section]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

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

\```bash
mkdir -p inbox/updates/applied
mv inbox/updates/[filename].md inbox/updates/applied/
\```

5. Confirm: "Update applied. [summary of what was added]"

---

## Step 6: Load Session Note

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

Display a brief getting started message appropriate to the project.

---

## Execution Instructions

1. Check for `SETUP.md` in root (spawned project detection)
   - If found: offer Run Setup | Skip | Archive
2. Check `.project/config.json` for setup status
   - If missing and no `.project/`: run guided setup
   - If missing but `.project/` exists: create config (migration)
   - If exists with `setup_complete: false`: run guided setup
   - If exists with `setup_complete: true`: continue
3. Get current branch name
4. Check if on protected branch:
   - **Protected branch** → continue to steps 5-7 (about to start something new)
   - **Feature branch** → check for handover (step 4b), then skip to step 9
4b. Check for handover document in `outbox/handovers/[branch]-*.md` (feature branches only)
   - If found: display handover, offer to delete after reading
5. Show git status (modified files, ahead/behind)
6. Load tool intelligence silently if exists
7. Check for updates in `inbox/updates/` → offer to apply if found
8. Show protected branch warning (if on protected branch) or feature branch confirmation
9. Show session note or getting started guide
10. Keep output concise and actionable

**Note:** Protected branches trigger update checks — you're about to start something new. Feature branches check for handovers first, then go straight to the session note.
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

## Setup Detection Logic

### Config File Structure

`.project/config.json` tracks setup state:

```json
{
  "setup_complete": true,
  "setup_date": "2026-01-24",
  "setup_version": "1.0",
  "migrated": false,
  "preferences": {
    "show_outbox_on_start": true
  }
}
```

| Field | Purpose |
|-------|---------|
| `setup_complete` | Whether guided setup has run |
| `setup_date` | When setup was completed |
| `setup_version` | Enables future migration if setup steps change |
| `migrated` | True if config was created for existing workspace |
| `preferences.show_outbox_on_start` | Whether to check outbox each session |

### Detection Flow

```
.project/config.json exists?
├─ Yes → setup_complete: true?
│        ├─ Yes → Continue normally
│        └─ No → Run guided setup
└─ No → .project/ directory exists?
         ├─ Yes → Create config (migration), continue
         └─ No → Run guided setup (fresh clone)
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

### Fresh Clone (First Run)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to My Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Let's make sure everything is configured for your first session.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1/3: Checking prerequisites...

✓ Node.js v20.10.0 detected
✓ pnpm 9.15.0 detected
✓ Git repository initialized

Step 2/3: Installing dependencies...

Running: pnpm install
✓ Dependencies installed

Step 3/3: Creating local workspace...

✓ .project/config.json created
✓ .project/sessions/ directory created
✓ .project/tool-intelligence.md initialized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're ready to start. Run /new-feature "description" to begin work.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
```

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
│   ├── config.json              # Setup state and preferences
│   ├── session-note.md          # Handoff from last session
│   ├── sessions/                # Session logs
│   └── tool-intelligence.md     # Learned preferences
├── inbox/
│   └── updates/                 # Updates from parent agent
│       └── applied/             # Applied updates (archived)
└── .gitignore
```

### Gitignore

```gitignore
# Local session data
.project/
```

---

## Key Design Decisions

### First-Run Detection

Fresh clones are detected by absence of `.project/config.json`:
- Enables guided setup without manual intervention
- Migration path for existing users who had `.project/` before config tracking
- Config version field enables future setup step changes

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
