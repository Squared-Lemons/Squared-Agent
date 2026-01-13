---
name: new-idea
description: Create a setup package for a new app idea with platform guidance
allowed-tools: Read, Glob, Bash, AskUserQuestion, Write
---

# New Idea

Create a setup package for a new app project. Asks for platform, idea description, and commands to include, then creates a folder with all files and instructions for the target project.

**Arguments:** $ARGUMENTS

---

## Step 1: Discover Available Options

First, scan for available platforms and commands:

```bash
# List platform skills
ls skills/*.md 2>/dev/null | grep -v README || echo "No platforms found"

# List command docs
ls commands/*.md 2>/dev/null | grep -v README || echo "No commands found"
```

Parse platform filenames to extract names:
- `Next.js-App-Build-Guide.md` → "Next.js"
- `Flutter-App-Build-Guide.md` → "Flutter"

---

## Step 2: Platform Selection

Use AskUserQuestion to ask which platform to use:

- Header: "Platform"
- Question: "Which platform/stack do you want to build with?"
- Options:
  - List each platform found in skills/ (extracted from filename)
  - Add "Create new platform guidance" as final option
- multiSelect: false

---

## Step 3: Handle Platform Selection

### 3a. If existing platform selected

Note the skill file path to copy to the setup package.

### 3b. If "Create new platform guidance" selected

Ask for the platform name:
- Use AskUserQuestion with header "New Platform"
- Question: "What platform or tech stack? (e.g., 'Flutter', 'SvelteKit', 'Rails')"
- User will select "Other" and type their platform name

Create a skeleton skill file in Squared-Agent's `skills/` folder (persistent):

```bash
# Create skills/<Platform>-App-Build-Guide.md
```

Use the Write tool with this template:

```markdown
# <Platform> App Build Guide

## Overview

Brief description of the platform and when to use it.

## Project Structure

\`\`\`
project-root/
├── src/
│   └── ...
├── package.json (or equivalent)
└── ...
\`\`\`

## Getting Started

\`\`\`bash
# Commands to create a new project
\`\`\`

## Key Patterns

### Pattern 1: [Name]

Description and code example.

### Pattern 2: [Name]

Description and code example.

## Common Gotchas

- Gotcha 1: Description and solution
- Gotcha 2: Description and solution

## Resources

- [Official Docs](url)
- [Tutorials](url)
```

Tell the user: "Created skeleton guide at skills/<Platform>-App-Build-Guide.md (persistent in Squared-Agent). Fill in details as you learn."

---

## Step 4: Gather Idea Description

Ask the user to describe their app idea:

- Use AskUserQuestion with header "Idea"
- Question: "Describe your app idea (what it does, key features, target users)"
- The user will select "Other" and type their idea description

---

## Step 5: Commands Selection

Use AskUserQuestion to ask which commands to include:

- Header: "Commands"
- Question: "Which command guides should be included?"
- Options: List each .md file in `commands/` (excluding README.md) + "All" + "None"
- multiSelect: true

---

## Step 6: Create Output Folder

Create a timestamped temp folder:

```bash
OUTPUT_DIR="/tmp/new-idea-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR/skills" "$OUTPUT_DIR/commands"
```

---

## Step 7: Copy Files

### 7a. Copy Platform Skill

```bash
cp "skills/<Platform>-App-Build-Guide.md" "$OUTPUT_DIR/skills/"
```

### 7b. Copy Selected Commands

For each selected command:
```bash
cp "commands/<filename>.md" "$OUTPUT_DIR/commands/"
```

If no commands selected, remove empty folder:
```bash
rmdir "$OUTPUT_DIR/commands" 2>/dev/null || true
```

---

## Step 8: Generate SETUP.md

Create `SETUP.md` in the output folder using the Write tool.

Use this template (replace placeholders with actual values):

```markdown
# New Project Setup: [Short idea summary - first 5-10 words]

## Your Idea

[Full idea description from user]

## Platform

**[Platform name]** - see `skills/[Platform]-App-Build-Guide.md`

## Included Resources

- **skills/**: Platform guidance and patterns
- **commands/**: Implementation guides for slash commands [or "None included" if empty]

---

## Setup Instructions

Follow these steps in order:

### Step 1: Initialize Project

```bash
git init
```

### Step 2: Read Platform Guide

Read `skills/[Platform]-App-Build-Guide.md` to understand:
- Project structure conventions
- Key patterns for this platform
- Common gotchas to avoid

### Step 3: Enter Plan Mode

Enter plan mode (shift+tab twice or type "let's plan") to design your implementation.

**Consider:**
- Project folder structure
- Key features to build first
- Data models needed
- UI/UX approach
- Authentication requirements (if any)

The plan should break down your idea into implementable features.

### Step 4: Set Up Commands

[If commands included:]
For each file in `commands/`:
1. Read the guide
2. Create the corresponding command in `.claude/commands/`
3. Follow any setup instructions in the guide

[Or if no commands: "No additional commands included. You can add them later."]

### Step 5: Create CLAUDE.md

Create a `CLAUDE.md` file documenting:
- Project overview
- Available commands
- Development workflow
- Key patterns used

### Step 6: Begin Implementation

After planning, start building features. Use `/new-feature` if you set up that command.

---

## Verification

After setup, verify:
- [ ] Git repository initialized
- [ ] Read platform skill guide
- [ ] Created implementation plan
- [ ] Set up slash commands (if any)
- [ ] CLAUDE.md exists and documents the project
- [ ] Ready to start building

---

## How to Use This Package

1. Copy this folder's contents to your new project
2. Tell Claude Code: "Read SETUP.md and help me set up this project"
3. Follow the setup instructions together
```

---

## Step 9: Report Output

Tell the user:

```
Setup package created at: [OUTPUT_DIR]

Idea: [short summary]
Platform: [platform name]

Contents:
- SETUP.md (start here)
- skills/[Platform]-App-Build-Guide.md
- commands/ [list files, or "empty" if none]

To use: Copy this folder to your new project and tell Claude Code:
"Read SETUP.md and help me set up this project"
```

Open the folder:
```bash
open "$OUTPUT_DIR"
```

---

## Example Usage

```
/new-idea
```

Interactive flow:
1. "Which platform?" → User selects "Next.js"
2. "Describe your idea" → User types "A habit tracker with streaks and reminders"
3. "Which commands?" → User selects "SESSION-END-COMMAND, New Feature Workflow"
4. Creates setup package in /tmp with idea baked into SETUP.md
5. Opens folder for user to copy to new project
