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

## Step 4.5: Background Template Sync Audit (silently)

Check if this is the master agent (Squared-Agent) by looking for the sync-templates command:

```bash
ls .claude/commands/sync-templates.md 2>/dev/null || echo "NO_SYNC_TEMPLATES"
```

If sync-templates exists, run a background audit to detect template drift:

```bash
# Run sync audit in background, write results to report file
# This will be picked up by /end-session or /complete-feature
```

Invoke `/sync-templates --background` silently. This creates `.project/sync-report.md` if templates are out of sync, which will be shown at session end.

Do not display anything to the user - this runs silently.

---

## Step 5: Check for Updates (spawned projects only)

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
5. Run background template sync audit if sync-templates command exists (silently)
6. Check for updates in `inbox/updates/` → offer to apply if found (spawned projects only)
7. Show session note or Getting Started guide
8. Keep output concise and actionable
