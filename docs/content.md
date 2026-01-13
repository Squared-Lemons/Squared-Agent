# Available Content

Everything included in Squared Agent that can be packaged for new projects.

---

## Setup Profiles

Profiles in `setups/` define the base configuration for new projects.

### developer

Full developer workflow with plugins, commands, and session management.

**Location:** `setups/developer/`

**Includes:**
- Plugin configuration (feature-dev, ralph-loop, etc.)
- Permission pre-configuration for safe commands
- PostToolUse hooks for auto-formatting
- Best practices documentation

**Best for:** Most development projects.

---

## Skills (Knowledge Base)

Skills in `skills/` are reference documents for building with specific technologies.

### Next.js-App-Build-Guide

Complete guide for building Next.js applications.

**Location:** `skills/Next.js-App-Build-Guide.md`

**Covers:**
- Project structure with Turborepo
- Better Auth setup and gotchas
- Drizzle ORM patterns
- Common pitfalls and solutions
- DX checklist

**Best for:** Next.js projects with authentication and database.

---

## Command Guides

Guides in `commands/` explain how to implement slash commands.

### SESSION-END-COMMAND

Full session-end workflow with creator feedback loop.

**Location:** `commands/SESSION-END-COMMAND.md`

**Sets up:** `/session-end` command for ending sessions, updating docs, and committing.

---

### New Feature Workflow

Feature development with Feature-Dev and Ralph Loop plugins.

**Location:** `commands/New Feature Workflow.md`

**Sets up:** `/new-feature` command for guided feature development.

---

### New-Idea-Workflow

How the /new-idea command works and how to extend it.

**Location:** `commands/New-Idea-Workflow.md`

**Documents:** The workflow for creating idea-focused setup packages.

---

### Canvas-Panel-Navigation-System

React UI pattern for horizontal panel navigation.

**Location:** `commands/Canvas-Panel-Navigation-System.md`

**Provides:** Reusable pattern for building canvas-style UIs with horizontal scrolling.

---

## Tasks

One-time setup activities in `tasks/`.

### ExistingProject-Investigate

Analyze an existing codebase and generate documentation.

**Location:** `tasks/ExistingProject-Investigate.md`

**What it does:**
- Analyzes project structure
- Identifies patterns and conventions
- Generates CLAUDE.md and README.md
- Documents existing commands and workflows

**When to use:** Setting up Squared Agent workflows in an existing project.

---

## Adding New Content

### Adding a Skill

1. Create `skills/<Technology>-App-Build-Guide.md`
2. Include: Overview, Project Structure, Key Patterns, Common Gotchas, Resources
3. The skill will appear in `/new-idea` platform selection

### Adding a Command Guide

1. Create `commands/<Command-Name>.md`
2. Document the full implementation
3. The guide will appear in setup package selection

### Adding a Task

1. Create `tasks/<Task-Name>.md`
2. Document the one-time activity
3. The task will appear in `/prepare-setup` selection

### Adding a Profile

1. Create `setups/<profile-name>/SETUP-INSTRUCTIONS.md`
2. Include all configuration steps
3. The profile will appear in `/prepare-setup` selection
