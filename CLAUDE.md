# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Squared Agent** is a master agent for bootstrapping new projects with Claude Code. It contains reusable setup profiles, development patterns, and a knowledge base that improves through feedback from spawned projects.

## Purpose

- **Bootstrap new projects** via `/prepare-setup` and `/new-idea` commands
- **Capture development patterns** in `templates/commands/` as implementation guides
- **Build knowledge base** in `templates/skills/` for reference during development
- **Improve continuously** through feedback in `inbox/` → proposals in `suggestions/`

## Commands

### `/prepare-setup`
Prepare a setup package for a new project. Asks for profile, commands, tasks, and skills to include, then creates a temp folder with all files and a SETUP.md guide.

### `/session-end`
End coding session - updates docs, captures learnings, generates SETUP.md handoff document, auto-generates creator feedback for user to copy back to master agent, and commits changes with approval.

### `/commit`
Draft a commit message, get approval, then commit changes.

### `/summary`
Generate an accomplishments summary for a time period. Analyzes git commits and session logs, categorizes by type (features, fixes, refactors, etc.), and produces a copy-paste ready report.

### `/new-idea`
Consultative discovery conversation to design a new project. Discuss requirements, platform, and technical decisions together, then generate a comprehensive package (PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md, SETUP.md) for the target agent to build v1.

## Available Content

### Templates (`templates/`)

Content that gets copied to new projects:

#### Command Guides (`templates/commands/`)
- **SESSION-END-COMMAND.md** - Session-end workflow with creator feedback loop
- **Summary-Command.md** - Accomplishments summary from git history and session logs
- **New Feature Workflow.md** - Feature development with Feature-Dev and Ralph Loop
- **New-Idea-Workflow.md** - Consultative discovery process for new projects
- **Canvas-Panel-Navigation-System.md** - React UI pattern for horizontal navigation

#### Skills (`templates/skills/`)
- **Next.js-App-Build-Guide.md** - Next.js + Better Auth + Drizzle + Turborepo patterns

#### Setup Profiles (`templates/profiles/`)
- **developer/** - Full developer workflow with plugins, commands, and session management

#### Tasks (`templates/tasks/`)
- **ExistingProject-Investigate.md** - Analyze existing codebase and generate documentation

### Inbox (`inbox/`)

Raw input for improvements:
- **ideas/** - Your ideas to discuss
- **from-projects/** - Feedback from spawned projects

### Suggestions (`suggestions/`)

My proposals for improvements, organized by category:
- **skills/** - Proposed new skill guides
- **commands/** - Proposed command improvements
- **workflow/** - Proposed workflow changes
- **other/** - Miscellaneous improvements

## Development Workflow

When making changes to this project:

1. **Make changes** - Edit files as needed
2. **Verify** - Run any relevant checks (this is a docs-heavy project, so mainly review for consistency)
3. **Test generated output** - If changing setup templates, test with `/prepare-setup`
4. **Update docs** - Keep CLAUDE.md and README.md in sync with changes
5. **Commit** - Use `/commit` or `/session-end` to commit with proper message

### Key Principles

- **Give Claude verification** - Always provide a way to verify work (tests, typecheck, lint)
- **Start in Plan Mode** - For complex tasks, use Plan Mode first (shift+tab twice)
- **Update CLAUDE.md** - When Claude does something wrong, add a rule to prevent it

## Project Structure

```
templates/          # Content copied to new projects
  commands/         # Command implementation guides
  skills/           # Tech stack guides (Next.js, etc.)
  profiles/         # Setup profiles (developer/, etc.)
  tasks/            # One-time setup tasks
inbox/              # Ideas and feedback for improvements
  from-projects/    # Feedback from spawned projects
  ideas/            # Your ideas to discuss
suggestions/        # My proposals (categorized)
  skills/           # Proposed new skills
  commands/         # Proposed command improvements
  workflow/         # Proposed workflow changes
  other/            # Miscellaneous improvements
docs/               # Internal documentation
.claude/            # Claude Code configuration
  commands/         # Active slash commands
.project/sessions/  # Local session logs (gitignored)
CLAUDE.md           # My instructions
LEARNINGS.md        # Session insights → feeds suggestions/
```

## Recent Changes

- **2026-01-16:** Reorganized folder structure - `templates/` for exportable content, `inbox/` for ideas and feedback, `suggestions/` for agent proposals; renamed `setups/` to `templates/profiles/`
- **2026-01-13:** Added `/summary` command - generates accomplishments summary from git commits and session logs; categorizes by type (features, fixes, refactors, etc.); copy-paste ready output
- **2026-01-13:** Enhanced `/new-idea` to be a consultative discovery conversation - discuss requirements, platform, technical decisions together; generates PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md with full context; supports user-provided files
- **2026-01-13:** Restructured README with minimal approach - Quick Start, workflow diagram, links to docs/; moved details to docs/commands.md, docs/plugins.md, docs/content.md, docs/feedback.md
- **2026-01-13:** Added `/new-idea` command - creates setup package for new app ideas with platform selection, idea description baked into SETUP.md, and command guides; target agent enters plan mode when setup runs
- **2026-01-13:** Added Boris Cherny's Claude Code best practices - PostToolUse hooks for auto-formatting, pre-configured permissions for safe commands, .claude/agents/ pattern, Development Workflow section, Plan Mode and verification emphasis
- **2026-01-12:** Standardized project structure - lowercase folder names (commands/, tasks/), fixed typo in ExistingProject-Investigate.md, added CONTRIBUTING.md, enhanced all READMEs with "How to Extend" sections
- **2026-01-12:** Integrated creator feedback - enhanced Next.js skill with Better Auth gotchas, handoff template, DX checklist; added SETUP.md auto-generation and auto-generated creator feedback to session-end; added Plugins section to README
- **2026-01-12:** Updated README and CLAUDE.md to reflect new purpose as master agent for project bootstrapping
- **2026-01-12:** Auto-organize docs into `docs/` on setup completion; copy-paste friendly creator feedback display
- **2026-01-12:** Enhanced `/prepare-setup` with commands and skills selection; added creator feedback loop to `/session-end`
- **2026-01-12:** Added `skills/` knowledge base with Next.js App Build Guide
- **2026-01-12:** Added `/prepare-setup` command for bootstrapping new projects with setup profiles, commands, and tasks
- **2026-01-12:** Added New Feature Workflow pattern and setups/tasks structure
- **2026-01-11:** Initial project setup - created README.md, configured commands, established documentation structure
