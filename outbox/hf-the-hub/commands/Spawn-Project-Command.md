# Spawn Project Command - Implementation Guide

A Claude Code command for creating new projects via discovery conversation or template selection.

---

## Overview

The `/spawn-project` command provides two paths to create new projects:

1. **Discuss & Design** — Discovery conversation leading to a comprehensive project package
2. **Use Template** — Select from existing knowledge and commands to create a setup package

### What It Does

| Step | Action |
|------|--------|
| 0 | Detects environment (MASTER or SPAWNED mode) |
| 1 | Checks for previous `/discuss` sessions |
| 2 | Routes to discovery or template flow |
| 3A | Discovery flow: conversation → project package |
| 3B | Template flow: selection → setup package |
| 4 | Hands off to target agent |

### Pass-Through Mode

In most spawned projects, `/spawn-project` runs in **pass-through mode**:
- No `templates/` folder required
- Copies parent's `.claude/commands/` to child
- Copies parent's `knowledge/` or `docs/knowledge/` to child
- Child inherits parent's installed skills
- Enables recursive spawning chains

```
Master Agent → Spawned Project A → Specialized Project A1
                                 → Specialized Project A2
             → Spawned Project B → Specialized Project B1
```

---

## Files to Create

### Main Command: `.claude/commands/spawn-project.md`

```markdown
---
name: spawn-project
description: Create a new project via discovery conversation or template selection
allowed-tools: Read, Glob, Bash, Write, Task, AskUserQuestion
---

# Spawn Project

Create a new project through discovery conversation or template selection.

**Arguments:** $ARGUMENTS

---

## Step 0: Detect Environment

Check if this is a master agent or spawned project:

\```bash
ls templates/profiles/ 2>/dev/null && echo "MASTER" || echo "SPAWNED"
\```

### If SPAWNED (pass-through mode)
- Copy own `.claude/commands/` to child
- Copy own `knowledge/` or `docs/knowledge/` to child
- Skip template/skill selection (child inherits what parent has)

Store the result for use in later steps.

---

## Step 1: Check for Previous Discussions

Check if any previous `/discuss` sessions exist:

\```bash
ls outbox/discussions/*.md 2>/dev/null | head -10
\```

If discussions exist, offer to continue from one or start fresh.

---

## Step 2: Choose Flow

Use AskUserQuestion to choose the path:

1. **Discuss & Design** (Recommended) — Discovery conversation
2. **Use Template** — Component selection

---

## Step 3A: Discovery Flow

Have a natural back-and-forth to understand:

### The Idea
- What does it do?
- Who uses it?
- What makes it valuable?

### Core vs Nice-to-have
- What MUST version 1 do?
- What can wait for later?

### Scale & Context
- Personal project, startup, or enterprise?
- How many users expected?

### Platform Discussion
Based on requirements, discuss platform options with tradeoffs.

### Requirements Deep-Dive
- Authentication needs
- Data storage requirements
- UI/UX preferences
- External integrations

### Generate Package

\```bash
PROJECT_SLUG="[project-slug]"
OUTPUT_DIR="outbox/$PROJECT_SLUG"
mkdir -p "$OUTPUT_DIR/.claude/commands" "$OUTPUT_DIR/knowledge" "$OUTPUT_DIR/provided-files"
\```

Generate documentation files:
- **README.md** — Comprehensive project specification
- **PROJECT-BRIEF.md** — Full context from discovery
- **TECHNICAL-DECISIONS.md** — Stack choices with rationale
- **SETUP.md** — Instructions for target agent

Copy files (pass-through):
\```bash
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
\```

---

## Step 3B: Template Flow

### Select Components

1. **Profile** — Base configuration
2. **Commands** — Workflow guides
3. **Knowledge** — Platform guidance
4. **Tasks** — One-time setup activities

### Generate SETUP.md

Create a guide with:
- What's included
- Order to execute files
- Commands to create
- Skills to install
- Verification checklist

---

## Step 4: Handoff

Report what was created:

\```
Project package created at: outbox/[project-slug]/

Contents:
├── README.md              # Project specification
├── .claude/
│   ├── commands/          # All commands inherited from parent
│   └── skills/            # Skills inherited (if any)
├── PROJECT-BRIEF.md       # Full project context
├── TECHNICAL-DECISIONS.md # Technical choices
├── SETUP.md               # Instructions for target agent
├── knowledge/             # Knowledge inherited from parent
└── provided-files/        # Your original files (if any)

This project inherits your commands, knowledge, and skills.
It can also spawn its own children via /spawn-project.

To build this project:
1. Copy the folder to your projects directory
2. Open with Claude Code: cd [project-slug] && claude .
3. Tell Claude: "Read SETUP.md and build this project"
\```

Open the folder:
\```bash
open "outbox/$PROJECT_SLUG"
\```

---

## Key Principles

- **Two paths** — Discovery for ideas, templates for components
- **Conversational** — Discovery flow is a discussion, not a questionnaire
- **Guide, don't dictate** — Present options and tradeoffs
- **Capture rationale** — Document WHY decisions were made
- **Comprehensive output** — Target agent should have full context
- **Pass-through inheritance** — Child gets everything parent has
```

---

## Specialization Workflow

Pass-through mode enables specialization chains:

```
1. Master Agent spawns "Web Agency Template"
   - Inherits all master commands + knowledge
   - User adds agency-specific knowledge

2. "Web Agency Template" spawns "Client Project A"
   - Inherits agency commands + knowledge + additions
   - User adds project-specific requirements

3. "Client Project A" spawns "Client A Microsite"
   - Inherits everything from parent chain
   - Focused on specific deliverable
```

### Before Spawning

To specialize before spawning a child:

1. **Add knowledge** — Create files in `knowledge/` or `docs/knowledge/`
2. **Modify commands** — Edit `.claude/commands/` files
3. **Install skills** — Use `npx add-skill` to add capabilities
4. **Run `/spawn-project`** — Child inherits all modifications

---

## Integration with /discuss

The `/discuss` command creates exploration documents saved to `outbox/discussions/`.

When `/spawn-project` runs, it checks for discussions and offers to continue from them:
- Pre-fills decisions already made
- Skips topics already covered
- Focuses on remaining open questions

---

## Output Structure

### Discovery Flow Output

| File | Purpose |
|------|---------|
| `README.md` | Project specification (comprehensive guide) |
| `PROJECT-BRIEF.md` | Full context from discovery conversation |
| `TECHNICAL-DECISIONS.md` | Stack choices with rationale |
| `SETUP.md` | Instructions for target agent |
| `.claude/commands/` | All parent commands (pass-through) |
| `.claude/skills/` | Inherited skills (if any) |
| `knowledge/` | All parent knowledge (pass-through) |
| `provided-files/` | User's original files (if any) |

### Template Flow Output

| File | Purpose |
|------|---------|
| `SETUP.md` | Instructions for target agent |
| Setup files | Profile configuration |
| `commands/` | Selected command guides |
| `knowledge/` | Selected knowledge docs |
| Task files | One-time setup tasks |

---

## Customization Points

### Knowledge Location

The command checks both locations:
- `knowledge/` (flat structure)
- `docs/knowledge/` (docs-based structure)

### Command Filtering

To exclude specific commands from inheritance, remove them before running `/spawn-project` or add logic to filter by name.

### Skill Recommendations

In pass-through mode, skills are inherited directly. The parent should install needed skills before spawning.

---

## Recursive Capability

Every spawned project with `/spawn-project` can spawn its own children. The chain continues as long as needed:

```
Master → Template → Project → Microsite → ...
```

Each level can add specialization before spawning the next.
