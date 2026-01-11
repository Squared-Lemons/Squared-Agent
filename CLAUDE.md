# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Squared Lemons - Business Agent** is a sandbox for exploring and prototyping business ideas, agent-based concepts, and reusable patterns for business automation.

## Current State

This project is in early exploration phase. The `Commands/` directory contains implementation guides and patterns that can be applied to future projects.

## Commands

### `/session-end`
End coding session - updates docs, captures learnings, commits changes with approval.

### `/commit`
Draft a commit message, get approval, then commit changes.

## Available Patterns

### Session-End Command (`Commands/SESSION-END-COMMAND.md`)
Implementation guide for the session-end workflow pattern. **Implemented** in this repo.

### Canvas Panel Navigation System (`Commands/Canvas-Panel-Navigation-System.md`)
A React/TypeScript UI pattern for horizontal infinite-scrolling navigation (guide only, not implemented).

## Project Structure

```
Commands/           # Implementation guides and reusable patterns
.claude/            # Claude Code configuration
  commands/         # Custom slash commands
.project/sessions/  # Local session logs (gitignored, created by session-end)
```

## Recent Changes

- **2026-01-11:** Initial project setup - created README.md, configured commands, established documentation structure
