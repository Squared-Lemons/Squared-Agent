# Developer Workflow Setup Instructions

Set up this project with the standard developer workflow.

---

## Step 1: Initialize Git

If not already a git repo:
```bash
git init
```

Ensure `.claude/` will be committed to git.

---

## Step 2: Install Plugins

Create `.claude/settings.json` with these plugins enabled:

```json
{
  "permissions": {
    "allow": [],
    "deny": []
  },
  "enabledPlugins": {
    "ralph-loop@claude-plugins-official": true,
    "feature-dev@claude-plugins-official": true,
    "code-simplifier@claude-plugins-official": true,
    "playwright@claude-plugins-official": true,
    "context7@claude-plugins-official": true
  }
}
```

---

## Step 3: Create Commands

Read the following documentation files and create commands/skills/agents as specified:

### Session-End Command
- **Documentation:** `SESSION-END-COMMAND.md`
- **Create:** `.claude/commands/session-end.md` and `.claude/commands/commit.md`
- Follow the implementation guide in the documentation

### New Feature Command
- **Documentation:** `New Feature Workflow.md`
- **Create:** `.claude/commands/new-feature.md`
- Follow the workflow and command template in the documentation

---

## Step 4: Create Supporting Files

### Directory Structure
```bash
mkdir -p .claude/commands
mkdir -p .project/sessions
```

### Gitignore
Add to `.gitignore`:
```
.project/sessions/
.claude/settings.local.json
```

### CLAUDE.md
Create or update `CLAUDE.md` in project root to document the available commands.

### LEARNINGS.md
Create `LEARNINGS.md` in project root for capturing session insights.

---

## Step 5: Commit

```bash
git add .
git commit -m "Setup developer workflow with Claude Code

- Configured plugins: ralph-loop, feature-dev, code-simplifier, playwright, context7
- Created commands: session-end, commit, new-feature
- Added project documentation

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification

After setup, these commands should be available:
- `/session-end` - End session, update docs, commit
- `/commit` - Quick commit with approval
- `/new-feature` - Build features with Feature-Dev workflow and Ralph Loop
- `/cancel-ralph` - Stop a running Ralph Loop

---

## Step 6: Project Exploration (Optional)

**Ask the user:** "Would you like me to explore the codebase and document its structure?"

If yes:
1. Copy `ExistingProject-Investigate.md` to the project root

---

## Setup Complete

Tell the user:
> "Setup is complete! Please restart Claude to load the new configuration. If you opted for project exploration, tell Claude to process the `ExistingProject-Investigate.md` file."
