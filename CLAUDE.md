# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Squared Agent** is a master agent for bootstrapping new projects with Claude Code. It contains reusable setup profiles, development patterns, and a knowledge base that improves through feedback from spawned projects.

## Purpose

- **Bootstrap new projects** via `/prepare-setup` command
- **Capture development patterns** in `commands/` as implementation guides
- **Build knowledge base** in `skills/` for reference during development
- **Improve continuously** through feedback from projects created with this system

## Commands

### `/prepare-setup`
Prepare a setup package for a new project. Asks for profile, commands, tasks, and skills to include, then creates a temp folder with all files and a SETUP.md guide.

### `/session-end`
End coding session - updates docs, captures learnings, generates SETUP.md handoff document, auto-generates creator feedback for user to copy back to master agent, and commits changes with approval.

### `/commit`
Draft a commit message, get approval, then commit changes.

## Available Content

### Command Guides (`commands/`)
- **SESSION-END-COMMAND.md** - Session-end workflow with creator feedback loop
- **New Feature Workflow.md** - Feature development with Feature-Dev and Ralph Loop
- **Canvas-Panel-Navigation-System.md** - React UI pattern for horizontal navigation

### Skills (`skills/`)
- **Next.js-App-Build-Guide.md** - Next.js + Better Auth + Drizzle + Turborepo patterns

### Setup Profiles (`setups/`)
- **developer/** - Full developer workflow with plugins, commands, and session management

### Tasks (`tasks/`)
- **ExistingProject-Investigate.md** - Analyze existing codebase and generate documentation

## Project Structure

```
commands/           # Implementation guides for slash commands
skills/             # Knowledge base (tech stacks, patterns)
setups/             # Setup profiles for bootstrapping projects
  developer/        # Developer workflow profile
tasks/              # One-time setup tasks
.claude/            # Claude Code configuration
  commands/         # Active slash commands
.project/sessions/  # Local session logs (gitignored)
CONTRIBUTING.md     # How to extend this project
```

## Recent Changes

- **2026-01-12:** Standardized project structure - lowercase folder names (commands/, tasks/), fixed typo in ExistingProject-Investigate.md, added CONTRIBUTING.md, enhanced all READMEs with "How to Extend" sections
- **2026-01-12:** Integrated creator feedback - enhanced Next.js skill with Better Auth gotchas, handoff template, DX checklist; added SETUP.md auto-generation and auto-generated creator feedback to session-end; added Plugins section to README
- **2026-01-12:** Updated README and CLAUDE.md to reflect new purpose as master agent for project bootstrapping
- **2026-01-12:** Auto-organize docs into `docs/` on setup completion; copy-paste friendly creator feedback display
- **2026-01-12:** Enhanced `/prepare-setup` with commands and skills selection; added creator feedback loop to `/session-end`
- **2026-01-12:** Added `skills/` knowledge base with Next.js App Build Guide
- **2026-01-12:** Added `/prepare-setup` command for bootstrapping new projects with setup profiles, commands, and tasks
- **2026-01-12:** Added New Feature Workflow pattern and setups/tasks structure
- **2026-01-11:** Initial project setup - created README.md, configured commands, established documentation structure
