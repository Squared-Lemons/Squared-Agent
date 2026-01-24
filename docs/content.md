# Available Content

Everything included in Squared Agent that can be packaged for new projects.

---

## Setup Profiles

Profiles in `templates/profiles/` define the base configuration for new projects.

### developer

Full developer workflow with plugins, commands, and session management.

**Location:** `templates/profiles/developer/`

**Includes:**
- Plugin configuration (feature-dev, ralph-loop, etc.)
- Permission pre-configuration for safe commands
- PostToolUse hooks for auto-formatting
- Best practices documentation

**Best for:** Most development projects.

---

## Knowledge (Knowledge Base)

Knowledge in `templates/knowledge/` are reference documents for building with specific technologies.

### Next.js-App-Build-Guide

Complete guide for building Next.js applications.

**Location:** `templates/knowledge/Next.js-App-Build-Guide.md`

**Covers:**
- Project structure with Turborepo
- Better Auth setup and gotchas
- Drizzle ORM patterns
- Common pitfalls and solutions
- DX checklist

**Best for:** Next.js projects with authentication and database.

---

## Command Guides

Guides in `templates/commands/` explain how to implement commands.

### END-SESSION-COMMAND

Full end-session workflow with agent feedback loop.

**Location:** `templates/commands/END-SESSION-COMMAND.md`

**Sets up:** `/end-session` command for ending sessions, updating docs, and committing.

---

### New Feature Workflow

Feature development with Feature-Dev and Ralph Loop plugins.

**Location:** `templates/commands/New Feature Workflow.md`

**Sets up:** `/new-feature` command for guided feature development.

---

### Spawn-Project-Command

How the /spawn-project command works for creating new projects.

**Location:** `templates/commands/Spawn-Project-Command.md`

**Documents:** The unified workflow for project creation via discovery or template selection.

---

### Spawn-Project-Workflow

Detailed workflow documentation for /spawn-project.

**Location:** `templates/commands/Spawn-Project-Workflow.md`

**Documents:** The full process flow with discovery conversation and template selection paths.

---

## UX Guides

UI/UX patterns in `templates/ux-guides/` for building consistent interfaces.

### Canvas-Panel-Navigation-System

React UI pattern for horizontal panel navigation.

**Location:** `templates/ux-guides/Canvas-Panel-Navigation-System.md`

**Provides:** Reusable pattern for building canvas-style UIs with horizontal scrolling.

---

## Tasks

One-time setup activities in `templates/tasks/`.

### ExistingProject-Investigate

Analyze an existing codebase and generate documentation.

**Location:** `templates/tasks/ExistingProject-Investigate.md`

**What it does:**
- Analyzes project structure
- Identifies patterns and conventions
- Generates CLAUDE.md and README.md
- Documents existing commands and workflows

**When to use:** Setting up Squared Agent workflows in an existing project.

---

## Adding New Content

### Adding Knowledge

1. Create `templates/knowledge/<category>/<technology>/<Technology>-Guide.md`
2. Include: Overview, Project Structure, Key Patterns, Common Gotchas, Resources
3. The knowledge will appear in `/spawn-project` selection

### Adding a Skill

Skills are installed via `npx add-skill` and mapped in `templates/skills/skill-mapping.json`.

1. Run `/add-skill [source]` to install the skill
2. The skill gets catalogued in `skill-mapping.json` by category
3. Spawned projects are recommended skills based on their knowledge categories

### Adding a Command Guide

1. Create `templates/commands/<Command-Name>.md`
2. Document the full implementation
3. The guide will appear in setup package selection

### Adding a Task

1. Create `templates/tasks/<Task-Name>.md`
2. Document the one-time activity
3. The task will appear in `/spawn-project` selection

### Adding a Profile

1. Create `templates/profiles/<profile-name>/SETUP-INSTRUCTIONS.md`
2. Include all configuration steps
3. The profile will appear in `/spawn-project` selection
