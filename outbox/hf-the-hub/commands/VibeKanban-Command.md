# VibeKanban Command - Implementation Guide

A Claude Code command for launching VibeKanban, a kanban board designed for AI agent task management with isolated git worktrees.

---

## Overview

The `/vibekanban` command launches VibeKanban, a task management tool that orchestrates AI coding agents. Each task runs in an isolated git worktree, preventing agent interference during parallel work.

### What It Does

| Step | Action |
|------|--------|
| 1 | Checks Node.js prerequisite |
| 2 | Launches VibeKanban via npx |
| 3 | Opens in default browser |
| 4 | Auto-discovers recent git projects |

### Key Features

- **Isolated Worktrees**: Each task gets its own git worktree
- **Auto-Discovery**: Finds your 3 most recently active git projects
- **GitHub Integration**: Create PRs via `gh` CLI
- **MCP Server Support**: Extend agent capabilities

---

## Files to Create

### Main Command: `.claude/commands/vibekanban.md`

```markdown
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

\```bash
# Check if Node.js is available
node --version 2>/dev/null || echo "NODE_NOT_FOUND"
\```

If Node.js is not found, inform the user:

\```
Node.js is required to run VibeKanban.
Install via: brew install node (macOS) or https://nodejs.org/
\```

---

## Step 2: Launch VibeKanban

### If port specified in $ARGUMENTS

\```bash
PORT=$ARGUMENTS npx vibe-kanban
\```

### If no port specified

\```bash
npx vibe-kanban
\```

---

## Step 3: Confirm Launch

Display:

\```
VibeKanban launching...

The application will:
1. Auto-discover your recent git projects
2. Open in your default browser
3. Guide you through initial setup

If this project doesn't appear:
- Ensure you're in a git repository
- Click "Create project" to add it manually

To stop: Press Ctrl+C in the terminal
\```

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
```

---

## Prerequisites

### Node.js

VibeKanban requires Node.js (Latest LTS recommended).

**macOS:**
```bash
brew install node
```

**Or download from:** https://nodejs.org/

### GitHub CLI (Optional)

For PR creation integration:

```bash
brew install gh
gh auth login
```

---

## How VibeKanban Works

### Task Isolation

Each task in VibeKanban runs in its own git worktree:

```
project/
├── .git/                    # Main repository
├── src/                     # Main working directory
└── ../worktrees/
    ├── task-123/            # Isolated worktree for task 123
    └── task-456/            # Isolated worktree for task 456
```

This prevents agents working on different tasks from interfering with each other.

### Project Discovery

VibeKanban automatically discovers your 3 most recently active git projects based on:
- Recent commit activity
- File modification timestamps

If your project doesn't appear:
1. Ensure it's a git repository (`git init` if needed)
2. Make a commit or modify files
3. Click "Create project" to add manually

### Agent Permissions

VibeKanban runs AI agents with `--dangerously-skip-permissions` flag by default, allowing autonomous operation without constant approval prompts. The worktree isolation provides safety boundaries.

---

## MCP Server Configuration

Extend agent capabilities through Settings > MCP Servers:

```json
{
  "mcpServers": {
    "agent-browser": {
      "description": "Browser automation skill (headless by default)"
    }
  }
}
```

Popular MCP servers:
- **Playwright** - Browser automation
- **Sentry** - Error tracking
- **Notion** - Documentation integration

---

## Usage Examples

### Basic Launch

```bash
/vibekanban
```

Opens VibeKanban on an auto-assigned port.

### Specific Port

```bash
/vibekanban 8080
```

Opens VibeKanban on port 8080.

---

## Integration with Workflow

### Typical Flow

1. **Start session**: `/start-session`
2. **Launch VibeKanban**: `/vibekanban`
3. **Create tasks** in the kanban board
4. **Work on tasks** - each in its own worktree
5. **Complete features**: `/complete-feature` for each task
6. **End session**: `/end-session`

### Using with Feature Branches

VibeKanban's worktree-per-task model works well with the feature branch workflow:
- Each task becomes a feature branch
- Worktrees provide isolation during development
- PRs can be created directly from VibeKanban

---

## Troubleshooting

### Project Not Appearing

1. Ensure you're in a git repository
2. Make at least one commit
3. Click "Create project" to add manually

### Port Already in Use

Specify a different port:
```bash
PORT=3001 npx vibe-kanban
```

### Node.js Not Found

Install Node.js:
```bash
brew install node  # macOS
# Or download from https://nodejs.org/
```

---

## Resources

- **Documentation**: https://www.vibekanban.com/docs
- **GitHub**: https://github.com/BloopAI/vibe-kanban
