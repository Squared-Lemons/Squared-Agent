---
name: vibekanban
description: Launch VibeKanban for AI agent task management
allowed-tools: Bash, AskUserQuestion
---

# VibeKanban - AI Agent Task Management

Launch VibeKanban to manage coding tasks with AI agents using isolated git worktrees.

**Arguments:** `$ARGUMENTS` - Optional port number (e.g., "8080")

---

## What is VibeKanban?

VibeKanban is a kanban board designed for developers to orchestrate autonomous AI coding agents. Key features:

- **Isolated git worktrees** - Each task runs in its own worktree preventing agent interference
- **Auto-discovery** - Finds your 3 most recently active git projects
- **GitHub integration** - Create PRs directly via `gh` CLI
- **MCP server support** - Extend agent capabilities with additional tools

---

## Step 1: Check Prerequisites

```bash
# Check if Node.js is available
node --version 2>/dev/null || echo "NODE_NOT_FOUND"
```

If Node.js is not found, inform the user:

```
Node.js is required to run VibeKanban.
Install via: brew install node (macOS) or https://nodejs.org/
```

---

## Step 2: Launch VibeKanban

### If port specified in $ARGUMENTS

```bash
PORT=$ARGUMENTS npx vibe-kanban
```

### If no port specified

```bash
npx vibe-kanban
```

---

## Step 3: Confirm Launch

Display:

```
VibeKanban launching...

The application will:
1. Auto-discover your recent git projects
2. Open in your default browser
3. Guide you through initial setup

If this project doesn't appear:
- Ensure you're in a git repository
- Click "Create project" to add it manually

To stop: Press Ctrl+C in the terminal
```

---

## Notes

- VibeKanban runs AI agents with autonomous permissions by default
- Each task uses isolated git worktrees for safety
- GitHub CLI (`gh`) required for PR creation
- First-time setup will prompt for agent preferences

---

## Quick Reference

| Action | How |
|--------|-----|
| Launch | `npx vibe-kanban` |
| Fixed port | `PORT=8080 npx vibe-kanban` |
| Add project | Click "Create project" in UI |
| Configure MCP | Settings > MCP Servers |
