# Profiles

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

Base configurations that set up Claude Code for a project. Each profile includes plugins, permissions, hooks, and setup instructions.

## Available Profiles

| Profile | Description |
|---------|-------------|
| [developer/](developer/) | Full developer workflow with plugins, session management, and best practices |

---

## developer

**Location:** `templates/profiles/developer/`

The standard developer workflow. Start here unless you have specific needs.

| Feature | What It Configures |
|---------|-------------------|
| **Plugins** | feature-dev, ralph-loop, code-simplifier, playwright, context7 |
| **Permissions** | Pre-allow build, test, lint, format, typecheck |
| **Hooks** | Auto-format after Write/Edit operations |
| **Agents** | Optional build-validator, code-reviewer, verify-app |

**Files:**
- `SETUP-INSTRUCTIONS.md` — Step-by-step setup guide with all configuration

**Best for:** Most development projects.

---

## Adding a Profile

1. Create folder: `templates/profiles/[profile-name]/`

2. Create `SETUP-INSTRUCTIONS.md` with:
   - Prerequisites and requirements
   - Plugin configuration (JSON for `.claude/settings.json`)
   - Commands to create
   - Supporting files
   - Verification steps

3. Update this README with the new profile

**Naming:** Lowercase, hyphens for compound names (`full-stack/`, `open-source/`)

**Template:**
```markdown
# [Profile Name] Setup Instructions

Brief description.

## What's Included
- Plugin: purpose
- Command: purpose

## Step 1: Configure Claude Code
[settings.json content]

## Step 2: Create Commands
[Reference command docs]

## Step 3: Supporting Files
[Files to create]

## Verification
[How to confirm setup worked]
```

---

## Profile Ideas

Consider creating profiles for:
- **minimal** — Git and basic commands only
- **team** — Multi-developer workflow with code review
- **fullstack** — Frontend + backend + database
- **open-source** — GitHub workflows, issue templates, CI/CD
