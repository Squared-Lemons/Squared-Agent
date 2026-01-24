---
name: add-skill
description: Install a skill and catalogue it for spawned projects
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Add Skill

Install a skill from [Agent Skills](https://agentskills.io/home) and catalogue it for spawned projects.

**Arguments:** $ARGUMENTS

---

## What Are Agent Skills?

Agent Skills is an open standard (originally developed by Anthropic) for giving AI agents new capabilities. Skills are portable across Claude Code, Cursor, VS Code, Gemini CLI, and more.

**Key points:**
- Skills install to `.claude/skills/` and are auto-loaded
- Skills are different from Claude Code plugins — they're portable
- Spawned projects install skills fresh via `npx add-skill`

---

## Overview

This command:
1. Installs skills via `npx add-skill`
2. Detects newly installed skills
3. Categorizes them by knowledge category
4. Updates `templates/skills/skill-mapping.json` so spawned projects know what to install

---

## Step 1: Parse Arguments

The source argument should be in `$ARGUMENTS`. Common formats:
- `anthropics/skills` - GitHub shorthand (recommended)
- `anthropics/skills -s frontend-design` - Install specific skill
- `https://github.com/anthropics/skills` - Full URL

If no argument provided, default to `anthropics/skills`.

```bash
SOURCE="${ARGUMENTS:-anthropics/skills}"
echo "Source: $SOURCE"
```

---

## Step 2: Snapshot Existing Skills

Before installing, capture what skills already exist:

```bash
# List existing skills (if any)
if [ -d ".claude/skills" ]; then
    ls -1 .claude/skills/ 2>/dev/null | sort > /tmp/skills-before.txt
else
    touch /tmp/skills-before.txt
fi
cat /tmp/skills-before.txt
```

---

## Step 3: Install Skills

The `npx add-skill` CLI requires interactive selection, so ask the user to run it in their terminal.

**Tell the user:**
```
Please run this command in your terminal:

npx add-skill [SOURCE]

Let me know when it's done.
```

Wait for the user to confirm before proceeding to Step 4.

---

## Step 4: Detect New Skills

Compare before and after to find newly installed skills:

```bash
# List skills after installation
ls -1 .claude/skills/ 2>/dev/null | sort > /tmp/skills-after.txt

# Find new skills
comm -13 /tmp/skills-before.txt /tmp/skills-after.txt > /tmp/skills-new.txt
cat /tmp/skills-new.txt
```

If no new skills were installed, inform the user and exit:
- "No new skills were installed. The skills from this source may already be installed."

---

## Step 5: Read Each New Skill

For each skill in `/tmp/skills-new.txt`:

```bash
SKILL_NAME="[skill-name]"
cat ".claude/skills/$SKILL_NAME/SKILL.md"
```

Understand what the skill provides to determine appropriate categories.

---

## Step 6: Categorize Skills

For each new skill, use AskUserQuestion to determine categories:

**Question:** "Which categories does **[skill-name]** apply to?"

Based on the skill content, suggest relevant categories. Use `multiSelect: true`.

**Options:**
- `web` - "Web frameworks (Next.js, React, etc.)"
- `database` - "Database tools (Drizzle, Prisma, etc.)"
- `auth` - "Authentication providers"
- `monorepo` - "Build and monorepo tools"
- `patterns` - "Framework-agnostic patterns"

---

## Step 7: Update Skill Mapping

Read the current mapping:

```bash
cat templates/skills/skill-mapping.json
```

Then use Edit to add each new skill to the `"skills"` object:

```json
{
  "skills": {
    "[skill-name]": {
      "categories": ["web", "patterns"],
      "description": "[Brief description from SKILL.md]",
      "source": "anthropics/skills"
    }
  },
  ...
}
```

This tells `/spawn-project` which skills to recommend for each category.

---

## Step 8: Report Results

Summarize what was done:

```
Skills Catalogued

Installed locally:
- [skill-name] → .claude/skills/[skill-name]/

Added to skill-mapping.json:
- [skill-name] → categories: web, patterns

How spawned projects use this:
1. /spawn-project checks skill-mapping.json
2. Recommends skills matching selected knowledge categories
3. Spawned agent installs via: npx add-skill anthropics/skills -s [skill-name]

Skills are portable across Claude Code, Cursor, VS Code, Gemini CLI.
```

---

## Example Usage

### Install all skills from Anthropic
```
/add-skill
```

### Install a specific skill
```
/add-skill anthropics/skills -s frontend-design
```

### Install multiple specific skills
```
/add-skill anthropics/skills -s frontend-design -s webapp-testing
```

### Install from custom repo
```
/add-skill https://github.com/user/custom-skills
```

---

## Recommended Skills

These skills are recommended for most projects:

### Web Development
| Skill | Purpose |
|-------|---------|
| **frontend-design** | Production-grade UI without generic AI aesthetics |
| **webapp-testing** | End-to-end web application testing |
| **web-artifacts-builder** | Build interactive web components |
| **theme-factory** | Generate consistent design themes |
| **canvas-design** | Canvas-based designs and graphics |

### Documents & Office
| Skill | Purpose |
|-------|---------|
| **docx** | Word document creation and editing |
| **pptx** | PowerPoint presentation creation |
| **xlsx** | Excel spreadsheet manipulation |
| **pdf** | PDF document handling |

### Development Tools
| Skill | Purpose |
|-------|---------|
| **mcp-builder** | Create MCP servers for tool integration |
| **skill-creator** | Create new skills |

### Creative & Communication
| Skill | Purpose |
|-------|---------|
| **algorithmic-art** | Algorithmic and generative art |
| **brand-guidelines** | Brand guidelines creation |
| **internal-comms** | Internal communications |
| **doc-coauthoring** | Collaborative document editing |

---

## How It Fits Together

```
┌─────────────────────────────────────────────────────────────┐
│ MASTER AGENT (Squared Agent)                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /add-skill anthropics/skills                               │
│       │                                                     │
│       ├──→ Installs to .claude/skills/ (local use)          │
│       │                                                     │
│       └──→ Updates templates/skills/skill-mapping.json      │
│                    │                                        │
│                    ▼                                        │
│  /spawn-project                                             │
│       │                                                     │
│       └──→ Reads skill-mapping.json                         │
│            Lists recommended skills in SETUP.md             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ SPAWNED PROJECT                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  SETUP.md says:                                             │
│  "Install recommended skills:"                              │
│                                                             │
│  npx add-skill anthropics/skills -s frontend-design         │
│  npx add-skill anthropics/skills -s webapp-testing          │
│                                                             │
│       │                                                     │
│       └──→ Installs fresh to .claude/skills/                │
│            Auto-loaded by Claude Code                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Notes

- Skills install locally to `.claude/skills/` and are auto-loaded by Claude Code
- The `skill-mapping.json` tracks which skills to recommend for each category
- Spawned projects install skills fresh — they're not copied from master agent
- This ensures spawned projects always get the latest skill versions
- Skills work across any agent supporting the [Agent Skills spec](https://agentskills.io/home)
