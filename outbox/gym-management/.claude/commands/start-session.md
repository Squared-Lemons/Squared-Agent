---
name: start-session
description: Begin session with branch awareness and context loading
allowed-tools: Read, Bash, Write, AskUserQuestion
---

# Start Session - Branch-Aware Entry Point

Begin a new coding session with setup detection, branch safety check, git status, and context loading.

---

## Step 0: Check Setup Status

First, check if this is a freshly spawned project by looking for SETUP.md in the root:

```bash
ls SETUP.md 2>/dev/null || echo "NO_SETUP_FILE"
```

### If SETUP.md exists (Spawned Project)

This project has setup documents. Ask using AskUserQuestion:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Setup Documents Found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found SETUP.md in project root.
```

Options:
- **Run Setup** — Execute the guided setup from SETUP.md
- **Skip** — Continue without setup (will ask again next session)
- **Archive** — Move setup docs to knowledge/setup/ without running (cleanup)

#### If user chooses "Run Setup"

1. Read SETUP.md and follow its instructions
2. Run prerequisites check, install dependencies, etc.
3. After setup completes, archive setup documents to `knowledge/`:

```bash
mkdir -p knowledge/setup
mv SETUP.md knowledge/setup/
mv PROJECT-BRIEF.md knowledge/setup/ 2>/dev/null
mv TECHNICAL-DECISIONS.md knowledge/setup/ 2>/dev/null
```

4. Display: "Setup complete. Documents archived to knowledge/setup/"

#### If user chooses "Archive"

Archive without running setup (for cleanup when setup was done manually):

```bash
mkdir -p knowledge/setup
mv SETUP.md knowledge/setup/
mv PROJECT-BRIEF.md knowledge/setup/ 2>/dev/null
mv TECHNICAL-DECISIONS.md knowledge/setup/ 2>/dev/null
```

Display: "Setup documents archived to knowledge/setup/"

Continue to Step 1.

### If no SETUP.md, check config file

```bash
cat .project/config.json 2>/dev/null || echo "NO_CONFIG"
```

### If NO_CONFIG and .project/ directory exists (Migration)

This is an existing user who was here before config tracking. Create the config file:

```bash
ls -d .project 2>/dev/null || echo "NO_PROJECT_DIR"
```

If `.project/` exists but no config:

```json
{
  "setup_complete": true,
  "setup_date": "[TODAY]",
  "setup_version": "1.0",
  "migrated": true,
  "preferences": {
    "show_outbox_on_start": true
  }
}
```

Write this to `.project/config.json` and display:

```
Config file created for existing workspace.
```

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

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Welcome to Squared Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is your master agent — your home base for:
• Your business practices and technical patterns
• Spawning client projects
• Delivering intelligent systems

Let's make sure everything is configured.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Setup Step 1/4: Check Prerequisites

```bash
node --version 2>/dev/null || echo "NO_NODE"
pnpm --version 2>/dev/null || echo "NO_PNPM"
git --version 2>/dev/null || echo "NO_GIT"
```

Display:
```
Step 1/4: Checking prerequisites...

✓ Node.js [version] detected
✓ pnpm [version] detected
✓ Git repository initialized
```

If any missing, warn but continue:
```
⚠ [tool] not found - some features may not work
```

### Setup Step 2/4: Install Dependencies

```bash
ls node_modules 2>/dev/null || echo "NO_MODULES"
```

If `NO_MODULES`:
```
Step 2/4: Installing dependencies...

Running: pnpm install
```

Run `pnpm install` and show:
```
✓ Dependencies installed
```

If `node_modules` exists:
```
Step 2/4: Dependencies already installed ✓
```

### Setup Step 3/4: Verify Claude Code Plugins

```bash
cat .claude/settings.json 2>/dev/null | grep -c '"' || echo "0"
```

Display:
```
Step 3/4: Verifying Claude Code plugins...

✓ Plugins configured in .claude/settings.json
```

### Setup Step 4/4: Create Local Workspace

```bash
mkdir -p .project/sessions
```

Create `.project/config.json`:

```json
{
  "setup_complete": true,
  "setup_date": "[TODAY]",
  "setup_version": "1.0",
  "preferences": {
    "show_outbox_on_start": true
  }
}
```

Create `.project/tool-intelligence.md` if it doesn't exist:

```markdown
# Tool Intelligence

Learned tool preferences for this workspace. Updated by /end-session.

## Learned Shortcuts

(Empty - will populate as you work)
```

Display:
```
Step 4/4: Creating local workspace...

✓ .project/config.json created
✓ .project/sessions/ directory created
✓ .project/tool-intelligence.md initialized
```

### Optional: Local HTTPS Environment

Ask using AskUserQuestion:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Optional: Local HTTPS Environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Would you like to set up trusted local HTTPS with friendly domains?
This enables https://myproject.local instead of http://localhost:3000
```

Options:
- **Set up now** — Run `/local-env init` to configure mkcert and proxy
- **Skip for now** — Can run `/local-env init` later

### Setup Complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Setup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're ready to start. Here's what you can do:

• /spawn-project — Create a client project
• /discuss — Explore a vague idea
• /how-to-use — See the full guide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 1: Check Current Branch

```bash
git branch --show-current
```

---

## Step 2: Branch Safety Check

Compare the branch name against protected branches: `main`, `master`, `develop`, `release/*`

### If on a PROTECTED branch

You're about to start something new. This is a good time to check for feedback/updates.

**Continue to Step 3** (git status), then **Step 4** (check inbox for feedback).

After processing feedback, display the warning:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  PROTECTED BRANCH — Ready to Start
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're on [branch] — a protected branch.
Direct changes here are not allowed to keep the codebase safe.

To start safe work:
→ /new-feature "short-description"    (creates branch or worktree)
→ Or: git checkout -b feature/your-name

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### If on a feature branch

You're in the middle of work. Check for a handover document first, then get straight to it.

**Continue to Step 2b** (check for handover), then **skip to Step 7** (session note).

---

## Step 2b: Check for Handover (Feature Branches Only)

Check if there's a handover document for this branch:

```bash
BRANCH=$(git branch --show-current)
ls outbox/handovers/${BRANCH}-*.md 2>/dev/null | head -1 || echo "NO_HANDOVER"
```

### If handover found

Read and display the handover:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Handover Document Found
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Contents of the handover document]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask using AskUserQuestion:
- **Got it, delete handover** - Remove the handover file (context received)
- **Keep handover** - Leave it for reference

If user chooses to delete:

```bash
rm outbox/handovers/${BRANCH}-*.md
```

### If no handover

Display confirmation and continue:

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

## Step 4: Check Inbox for Feedback (Master Agent Only)

First, detect if this is the master agent by checking for templates folder:

```bash
ls -d templates/profiles 2>/dev/null || echo "NOT_MASTER"
```

If NOT_MASTER, skip to Step 5.

### Check config preferences

Read `.project/config.json` and check if `preferences.show_outbox_on_start` is true. If false, skip inbox checking.

### Check for feedback files

```bash
ls inbox/feedback/*.md 2>/dev/null | grep -v README || echo "NO_FEEDBACK"
```

### Check for discussion files

```bash
ls outbox/discussions/*.md 2>/dev/null || echo "NO_DISCUSSIONS"
```

### If feedback or discussions found

Display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 Pending Items
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[If feedback files found:]
Feedback to process (inbox/feedback/):
  • [filename] ([project name if detectable])
  • ...

[If discussion files found:]
Discussions:
  • [filename] ([age in days] days old)
  • ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Ask using AskUserQuestion:
- **Process feedback now** — Review feedback inline and implement or note
- **Skip** — Continue session, will show again next time
- **Don't show again** — Update config preference to `show_outbox_on_start: false`

### If user chooses "Process feedback now"

For each feedback file:

1. Read the feedback content
2. Display summary of items
3. For each item, either:
   - Implement the improvement immediately, OR
   - Create a note in `suggestions/` for later
4. After processing, archive the feedback:

```bash
mkdir -p knowledge/archive
mv inbox/feedback/feedback-*.md knowledge/archive/
```

Then confirm: "Feedback processed and archived to knowledge/archive/"

### If user chooses "Don't show again"

Update `.project/config.json` to set `preferences.show_outbox_on_start: false`

---

## Step 5: Load Tool Intelligence (silently)

```bash
ls .project/tool-intelligence.md 2>/dev/null || echo "NO_INTELLIGENCE"
```

If file exists, read `.project/tool-intelligence.md` silently. Use this knowledge to:
- Proactively select tools throughout the session
- Skip exploration for known patterns
- Minimize tokens by avoiding redundant tool discovery

---

## Step 5.5: Background Template Sync Audit (silently)

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

## Step 6: Check for Updates (spawned projects only)

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

## Step 7: Load Session Note

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

  /spawn-project   → Create new project (discovery or template flow)
  /new-feature     → Create feature branch (safe to make changes)
  /discuss         → Exploratory conversation for vague ideas
  /summary         → Generate accomplishments report
  /end-session     → Wrap up session, update docs, commit

## First Steps

1. Have a project idea? Run /spawn-project to design it together
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

1. Check for `SETUP.md` in root (spawned project detection)
   - If found: offer Run Setup | Skip | Archive
2. Check `.project/config.json` for setup status
   - If missing and no `.project/`: run guided setup
   - If missing but `.project/` exists: create config (migration)
   - If exists with `setup_complete: false`: run guided setup
   - If exists with `setup_complete: true`: continue
3. Get current branch name
4. Check if on protected branch:
   - **Protected branch** → continue to steps 5-9 (about to start something new)
   - **Feature branch** → check for handover (step 4b), then skip to step 11
4b. Check for handover document in `outbox/handovers/[branch]-*.md` (feature branches only)
   - If found: display handover, offer to delete after reading
5. Show git status (modified files, ahead/behind)
6. Check `inbox/feedback/` for feedback (master agent only) → offer to process or skip
7. Load tool intelligence silently if exists
8. Run background template sync audit if sync-templates command exists (silently)
9. Check for updates in `inbox/updates/` → offer to apply if found (spawned projects only)
10. Show protected branch warning (if on protected branch) or feature branch confirmation
11. Show session note or Getting Started guide
12. Keep output concise and actionable

**Note:** Protected branches trigger feedback/update checks — you're about to start something new. Feature branches check for handovers first, then go straight to the session note.
