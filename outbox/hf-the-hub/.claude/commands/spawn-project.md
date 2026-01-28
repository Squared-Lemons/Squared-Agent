---
name: spawn-project
description: Create a new project via discovery conversation or template selection
allowed-tools: Read, Glob, Bash, Write, Task, AskUserQuestion
---

# Spawn Project

Create a new project through discovery conversation or template selection.

**Arguments:** $ARGUMENTS

---

## Overview

This command provides two paths to create new projects:

1. **Discuss & Design** — Have a discovery conversation about your idea, then generate a comprehensive project package
2. **Use Template** — Select from existing profiles, knowledge, and commands to create a setup package

Both paths output to `outbox/[project-slug]/` and can be picked up by a target agent.

---

## Step 0: Detect Environment

Check if this is the master agent (has templates/) or a spawned project (pass-through mode):

```bash
ls templates/profiles/ 2>/dev/null && echo "MASTER" || echo "SPAWNED"
```

### If MASTER (has templates/)
- Full template selection available (profiles, knowledge categories, skills)
- Read from `templates/commands/`, `templates/knowledge/`, `templates/skills/`
- Recommend skills based on `templates/skills/skill-mapping.json`

### If SPAWNED (pass-through mode)
- Copy own `.claude/commands/` to child
- Copy own `knowledge/` or `docs/knowledge/` to child
- Skip profile/skill selection (child inherits what parent has)
- No skill-mapping.json needed

Store the result in a variable `SPAWN_MODE` (either "MASTER" or "SPAWNED") for use in later steps.

---

## Step 1: Check for Previous Discussions

Check if any previous `/discuss` sessions exist:

```bash
ls outbox/discussions/*.md 2>/dev/null | head -10
```

### If discussions exist

List them with a brief summary:

```
Found previous discussions:

1. simple-habit-tracker-2026-01-24.md
   Summary: Simple habit tracker focused on streaks, mobile-first

2. team-dashboard-2026-01-20.md
   Summary: Internal dashboard for engineering metrics

Continue from a discussion, or choose how to proceed?
```

### If user selects a discussion

1. Read the discussion document
2. Parse the structure:
   - **Key Decisions Made** → Pre-filled choices, skip asking
   - **Explored Topics (yes)** → Skip or quickly confirm
   - **Explored Topics (partially)** → Ask follow-up questions
   - **Explored Topics (no)** → Explore fully
   - **Open Questions** → Address during discovery

3. Display what's decided vs what needs work, then proceed to discovery flow (Step 3A)

---

## Step 2: Choose Flow

If no discussion selected, use AskUserQuestion to choose the path:

```
How would you like to create this project?

1. **Discuss & Design** (Recommended)
   Have a discovery conversation about your idea, then generate a project package

2. **Use Template**
   Select from existing profiles and knowledge to create a setup package
```

- If user chose "Discuss & Design" → Go to **Step 3A: Discovery Flow**
- If user chose "Use Template" → Go to **Step 3B: Template Flow**

---

## Step 3A: Discovery Flow

### Invoke Brainstorming Skill

Invoke the `superpowers:brainstorming` skill to establish a systematic exploration framework.

### Start the Conversation

If `$ARGUMENTS` contains a path, read those files first and summarize.

Begin by asking about their idea:

"Tell me about what you want to build. What's the idea?"

Follow up based on their response:
- "Who is this for?"
- "What problem does it solve?"
- "What's the most important thing it needs to do?"

### Discovery Conversation

Have a natural back-and-forth to understand:

**The Idea**
- What does it do?
- Who uses it?
- What makes it valuable?

**Core vs Nice-to-have**
- What MUST version 1 do?
- What can wait for later?

**Scale & Context**
- Personal project, startup, or enterprise?
- How many users expected?
- Any timeline pressures?

**Platform Discussion**
Based on requirements, discuss platform options with tradeoffs.

### Requirements Deep-Dive

Explore specifics naturally:
- Authentication needs
- Data storage requirements
- UI/UX preferences
- External integrations

### Recommend Setup

#### If MASTER Mode

Check available knowledge:
```bash
ls templates/knowledge/*.md 2>/dev/null | grep -v README
```

Check available commands:
```bash
ls templates/commands/*.md 2>/dev/null | grep -v README
```

Check recommended skills:
```bash
cat templates/skills/skill-mapping.json 2>/dev/null
```

Recommend relevant knowledge, commands, and skills based on the project.

#### If SPAWNED Mode

Check what this project has:
```bash
ls .claude/commands/*.md 2>/dev/null | head -20
ls knowledge/*.md 2>/dev/null || ls docs/knowledge/*.md 2>/dev/null
ls .claude/skills/ 2>/dev/null
```

Tell the user what the child will inherit.

### Offer Task Management

Ask: "Would you like to use VibeKanban for task management? It helps orchestrate AI agents with isolated worktrees for each task."

### Generate Package

When the user confirms:

```bash
PROJECT_SLUG="[project-slug]"
OUTPUT_DIR="outbox/$PROJECT_SLUG"
mkdir -p "$OUTPUT_DIR/.claude/commands" "$OUTPUT_DIR/knowledge" "$OUTPUT_DIR/commands" "$OUTPUT_DIR/provided-files"
```

**Generate these files:**

1. **README.md** — Comprehensive project specification
2. **PROJECT-BRIEF.md** — Full context from discovery
3. **TECHNICAL-DECISIONS.md** — Stack choices with rationale
4. **SETUP.md** — Instructions for target agent

**Copy files based on mode:**

#### If MASTER Mode
```bash
# Copy knowledge
cp "templates/knowledge/[Platform]-App-Build-Guide.md" "$OUTPUT_DIR/knowledge/"

# Copy command guides
cp "templates/commands/[Selected].md" "$OUTPUT_DIR/commands/"

# Copy Claude Code commands
cp ".claude/commands/start-session.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/new-feature.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/complete-feature.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/clean-branches.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/end-session.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/commit.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/summary.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/local-env.md" "$OUTPUT_DIR/.claude/commands/"

# Spawning capability
cp ".claude/commands/spawn-project.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/discuss.md" "$OUTPUT_DIR/.claude/commands/"

# Optional: VibeKanban (if selected)
cp ".claude/commands/vibekanban.md" "$OUTPUT_DIR/.claude/commands/"
```

#### If SPAWNED Mode (pass-through)
```bash
# Copy ALL commands from this project
cp .claude/commands/*.md "$OUTPUT_DIR/.claude/commands/"

# Copy knowledge
if [ -d "knowledge" ]; then
  cp -r knowledge/* "$OUTPUT_DIR/knowledge/" 2>/dev/null || true
elif [ -d "docs/knowledge" ]; then
  cp -r docs/knowledge/* "$OUTPUT_DIR/knowledge/" 2>/dev/null || true
fi

# Copy skills if present
if [ -d ".claude/skills" ]; then
  mkdir -p "$OUTPUT_DIR/.claude/skills"
  cp -r .claude/skills/* "$OUTPUT_DIR/.claude/skills/"
fi
```

**Cleanup:**
```bash
rmdir "$OUTPUT_DIR/provided-files" 2>/dev/null || true
rmdir "$OUTPUT_DIR/commands" 2>/dev/null || true
rmdir "$OUTPUT_DIR/knowledge" 2>/dev/null || true
```

**Open in Finder:**
```bash
open "outbox/$PROJECT_SLUG"
```

**Report what was created** with contents listing and next steps.

→ Skip to **Step 4: Handoff**

---

## Step 3B: Template Flow

### Gather Available Options

```bash
# List profile types
ls -d templates/profiles/*/

# List command docs
ls templates/commands/*.md 2>/dev/null | grep -v README || echo "No commands found"

# List task docs
ls templates/tasks/*.md 2>/dev/null | grep -v README || echo "No tasks found"

# List knowledge categories
echo "=== Knowledge Categories ==="
for category in web database auth monorepo patterns local-env; do
  if [ -d "templates/knowledge/$category" ]; then
    echo "[$category]:"
    find "templates/knowledge/$category" -name "*.md" -not -name "README.md" 2>/dev/null
  fi
done
```

### Profile Selection

Use AskUserQuestion:
- Header: "Profile"
- Question: "Which setup profile type do you want to use?"
- Options: List each folder in `templates/profiles/`

### Setup Files Selection

After profile selected:
```bash
ls templates/profiles/<profile>/*.md
```

If multiple files, use AskUserQuestion with multiSelect to choose which to include.

### Commands Selection

Use AskUserQuestion with multiSelect:
- Header: "Commands"
- Question: "Which command guides should be included?"
- Options: List each .md file in `templates/commands/` (excluding README)
- Include "All" and "None" as options

### Tasks Selection

Use AskUserQuestion with multiSelect:
- Header: "Tasks"
- Question: "Which tasks should run after setup?"
- Options: List each .md file in `templates/tasks/`
- Include "All" and "None" as options

### Knowledge Selection (Per Category)

For each category with content (web, database, auth, monorepo, patterns, local-env):
- Use AskUserQuestion
- Header: Category name (e.g., "Web Framework")
- Question: "Which [category] knowledge should be included?"
- Include "None" as an option

### Skills Selection

```bash
cat templates/skills/skill-mapping.json 2>/dev/null
```

Use AskUserQuestion:
- Header: "Skills"
- Question: "Which skills should be included?"
- Options:
  - "Recommended (based on knowledge)" - Include skills matching selected categories
  - "None" - Don't include any skills
  - [List installed skills if any]

### Create Output Folder

```bash
OUTPUT_DIR="/tmp/project-setup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR/commands" "$OUTPUT_DIR/knowledge"
```

### Copy Selected Files

**Setup files (to root):**
```bash
cp "templates/profiles/<profile>/<filename>.md" "$OUTPUT_DIR/"
```

**Commands (to commands/):**
```bash
cp "templates/commands/<filename>.md" "$OUTPUT_DIR/commands/"
```

**Tasks (to root):**
```bash
cp "templates/tasks/<filename>.md" "$OUTPUT_DIR/"
```

**Knowledge (preserve category structure):**
```bash
mkdir -p "$OUTPUT_DIR/knowledge/[category]"
cp "templates/knowledge/[category]/[subfolder]/[filename].md" "$OUTPUT_DIR/knowledge/[category]/"
```

### Generate SETUP.md

Create a SETUP.md that guides the agent through:
1. What's included in the package
2. Order to read and execute files
3. Commands to create from guides
4. Tasks to execute
5. Knowledge as reference
6. Skills to install
7. Verification checklist

### Cleanup Empty Folders

```bash
rmdir "$OUTPUT_DIR/commands" 2>/dev/null || true
rmdir "$OUTPUT_DIR/knowledge" 2>/dev/null || true
```

### Open Output

```bash
open "$OUTPUT_DIR"
```

→ Continue to **Step 4: Handoff**

---

## Step 4: Handoff

### Discovery Flow Output

```
Project package created at: outbox/[project-slug]/

Contents:
├── README.md              # Project specification (comprehensive guide)
├── .claude/
│   └── commands/          # Commands (/start-session, /new-feature, /spawn-project, etc.)
├── PROJECT-BRIEF.md       # Full project context
├── TECHNICAL-DECISIONS.md # Technical choices
├── SETUP.md               # Instructions for target agent
├── knowledge/             # Platform guidance
├── commands/              # Workflow documentation
└── provided-files/        # Your original files (if any)

Skills to install: [list recommended skills]

This project can spawn its own children via /spawn-project (pass-through mode).

To build this project:
1. Copy the folder to your projects directory
2. Open with Claude Code: cd [project-slug] && claude .
3. Tell Claude: "Read SETUP.md and build this project"

The commands (/start-session, /new-feature, /commit, etc.)
will be available immediately. Skills are installed during setup.
```

### Template Flow Output

```
Setup package created at: [OUTPUT_DIR]

Contents:
- SETUP.md (start here)
- [list of setup files]
- commands/ [list of command files, or "empty" if none]
- [list of task files]
- knowledge/ [list of knowledge files, or "empty" if none]

Skills to install: [list recommended skills, or "none"]

To use: Copy this folder to your new project and tell Claude Code:
"Read all files in this folder, starting with SETUP.md, and execute the setup."
```

---

## Key Principles

- **Conversational discovery** — The discovery flow is a discussion, not a questionnaire
- **Template power** — The template flow gives experienced users quick access to components
- **Guide, don't dictate** — Present options and tradeoffs
- **Capture rationale** — Document WHY decisions were made
- **Comprehensive output** — Target agent should have full context
- **Pass-through inheritance** — Child gets everything parent has
- **Recursive spawning** — Every spawned project can spawn its own children

---

## Example Conversations

### Discovery Flow

```
User: /spawn-project

Claude: How would you like to create this project?
        1. Discuss & Design (Recommended)
        2. Use Template

User: [selects Discuss & Design]

Claude: Tell me about what you want to build. What's the idea?

User: A habit tracker app

Claude: Nice! Who is this for - yourself, or launching as a product?

User: I want to launch it as a product

Claude: What's the core thing that makes your habit tracker different?

User: Streaks and social accountability - share with friends

Claude: [continues discovery conversation...]
        [generates package with full context]
```

### Template Flow

```
User: /spawn-project

Claude: How would you like to create this project?
        1. Discuss & Design (Recommended)
        2. Use Template

User: [selects Use Template]

Claude: Which setup profile type do you want to use?
        1. developer

User: [selects developer]

Claude: Which command guides should be included?
        [multiselect options...]

[continues through selections, generates package]
```
