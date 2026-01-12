# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Squared Lemons - Business Agent** is a sandbox for exploring and prototyping business ideas, agent-based concepts, and reusable patterns for business automation.

## Current State

This project is in early exploration phase. The `Commands/` directory contains implementation guides and patterns that can be applied to future projects.

## Commands

### `/prepare-setup`
Prepare a setup package for a new project. Asks for profile, commands, and tasks to include, then creates a temp folder with all files and a SETUP.md guide.

### `/session-end`
End coding session - updates docs, captures learnings, commits changes with approval.

### `/commit`
Draft a commit message, get approval, then commit changes.

## Available Patterns

### Session-End Command (`Commands/SESSION-END-COMMAND.md`)
Implementation guide for the session-end workflow pattern. **Implemented** in this repo.

### New Feature Workflow (`Commands/New Feature Workflow.md`)
Structured workflow for building features with Feature-Dev plugin and Ralph Loop. **Implemented** in this repo.

### Canvas Panel Navigation System (`Commands/Canvas-Panel-Navigation-System.md`)
A React/TypeScript UI pattern for horizontal infinite-scrolling navigation (guide only, not implemented).

## Project Structure

```
Commands/           # Implementation guides and reusable patterns
setups/             # Setup profiles for bootstrapping new projects
  developer/        # Developer workflow profile
tasks/              # One-time setup tasks
.claude/            # Claude Code configuration
  commands/         # Custom slash commands
.project/sessions/  # Local session logs (gitignored, created by session-end)
```

## Recent Changes

- **2026-01-12:** Added `/prepare-setup` command for bootstrapping new projects with setup profiles, commands, and tasks
- **2026-01-12:** Added New Feature Workflow pattern and setups/tasks structure
- **2026-01-11:** Initial project setup - created README.md, configured commands, established documentation structure
