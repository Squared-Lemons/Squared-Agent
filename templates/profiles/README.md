# Setups

Reusable setup profiles for bootstrapping projects with Claude Code workflows.

## Available Setups

| Setup | Description |
|-------|-------------|
| [`developer/`](developer/) | Developer workflow with Feature-Dev agents, Ralph Loop, and session management |

## How to Use

Run `/prepare-setup` and select a profile, or give the setup instructions to Claude Code directly:

```
Read setups/developer/SETUP-INSTRUCTIONS.md and execute all steps.
```

The agent will:
1. Initialize git if needed
2. Install plugins
3. Read the `commands/` documentation and create the commands
4. Set up supporting files
5. Commit

## How to Extend

### Adding a New Setup Profile

1. **Create a profile folder**
   ```
   setups/[profile-name]/
   ```
   Examples: `minimal/`, `team/`, `fullstack/`

2. **Create required files:**
   ```
   setups/[profile-name]/
   ├── SETUP-INSTRUCTIONS.md    # Step-by-step bootstrap guide
   └── README.md                # Profile description (optional)
   ```

3. **Structure SETUP-INSTRUCTIONS.md:**
   - Prerequisites check
   - Git initialization
   - Plugin installation
   - Command creation (reference commands/ documentation)
   - Supporting files setup
   - Final commit

4. **Update this README** - Add entry to the Available Setups table

5. **Update CLAUDE.md** - Add to Available Content section

6. **Update /prepare-setup** - Ensure it lists the new profile

### Naming Convention

- Use lowercase folder names
- Use descriptive single-word names when possible
- For compound names, use hyphens: `full-stack/`, `open-source/`

### Template Structure

```markdown
# [Profile Name] Setup

Brief description of what this profile provides.

## What's Included

- Plugin 1: purpose
- Plugin 2: purpose
- Command 1: purpose
- ...

## Prerequisites

- Required tools
- Required accounts/access

## Steps

### Step 1: Initialize Git
[Instructions]

### Step 2: Install Plugins
[Plugin list and installation commands]

### Step 3: Create Commands
[Reference to commands/ documentation]

### Step 4: Supporting Files
[Files to create]

### Step 5: Commit
[Commit instructions]

## Verification

How to verify the setup worked correctly.
```

### Profile Ideas

Consider creating profiles for:
- **minimal** - Just git and basic commands
- **team** - Multi-developer workflow with code review
- **fullstack** - Frontend + backend with database setup
- **open-source** - GitHub workflows, issue templates, CI/CD
