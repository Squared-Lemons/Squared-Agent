---
name: prepare-setup
description: Prepare a setup package for a new project with selected profile, commands, tasks, and knowledge
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Prepare Setup Package

Create a setup package for bootstrapping a new project.

**Arguments:** $ARGUMENTS

---

## How It Works

1. Select a profile type from `templates/profiles/`
2. Select which setup files to include from that profile
3. Select which commands to include from `templates/commands/`
4. Select which tasks to run at the end from `templates/tasks/`
5. Select which knowledge to include from `templates/knowledge/`
6. Generate a `SETUP.md` guide file
7. Copy all selected files to a temp folder

---

## Step 1: Gather Available Options

First, discover what's available:

```bash
# List profile types (folders in templates/profiles/)
ls -d templates/profiles/*/

# List command docs (markdown files in templates/commands/, excluding README)
ls templates/commands/*.md 2>/dev/null | grep -v README || echo "No commands found"

# List task docs (markdown files in templates/tasks/, excluding README)
ls templates/tasks/*.md 2>/dev/null | grep -v README || echo "No tasks found"

# List skill docs (markdown files in templates/knowledge/, excluding README)
ls templates/knowledge/*.md 2>/dev/null | grep -v README || echo "No knowledge found"
```

---

## Step 2: Parse Arguments or Ask Questions

Check if arguments were provided in `$ARGUMENTS`. Arguments can be:
- `--profile <name>` - Skip profile question
- `--setup <file1,file2>` - Skip setup files question (comma-separated, or "all")
- `--commands <file1,file2>` - Skip commands question (comma-separated, or "all" or "none")
- `--tasks <file1,file2>` - Skip tasks question (comma-separated, or "all" or "none")
- `--knowledge <file1,file2>` - Skip knowledge question (comma-separated, or "all" or "none")
- `--skills <auto|none|skill1,skill2>` - Skip skills question ("auto" based on knowledge, "none", or comma-separated)

If an argument is not provided, ask the user using AskUserQuestion.

### 2a. Profile Type Selection

If `--profile` not in arguments:
- Use AskUserQuestion with header "Profile"
- Question: "Which setup profile type do you want to use?"
- Options: List each folder in `templates/profiles/` as an option

### 2b. Setup Files Selection

After profile is selected, list files in that profile folder:
```bash
ls templates/profiles/<profile>/*.md
```

If `--setup` not in arguments AND there are multiple files:
- Use AskUserQuestion with header "Setup" and `multiSelect: true`
- Question: "Which setup files do you want to include?"
- Options: List each .md file in `templates/profiles/<profile>/`
- Include "All" as an option

If only one file exists, select it automatically.

### 2c. Commands Selection

If `--commands` not in arguments:
```bash
ls templates/commands/*.md 2>/dev/null | grep -v README
```

If command files exist:
- Use AskUserQuestion with header "Commands" and `multiSelect: true`
- Question: "Which command guides should be included?"
- Options: List each .md file in `templates/commands/` (excluding README.md)
- Include "All" and "None" as options

### 2d. Tasks Selection

If `--tasks` not in arguments:
```bash
ls templates/tasks/*.md 2>/dev/null | grep -v README
```

If task files exist:
- Use AskUserQuestion with header "Tasks" and `multiSelect: true`
- Question: "Which tasks should run after setup?"
- Options: List each .md file in `templates/tasks/` (excluding README.md)
- Include "All" and "None" as options

### 2e. Knowledge Selection

If `--knowledge` not in arguments:
```bash
ls templates/knowledge/*.md 2>/dev/null | grep -v README
```

If skill files exist:
- Use AskUserQuestion with header "Knowledge" and `multiSelect: true`
- Question: "Which knowledge (knowledge docs) should be included?"
- Options: List each .md file in `templates/knowledge/` (excluding README.md)
- Include "All" and "None" as options

### 2f. Skills Selection

[Agent Skills](https://agentskills.io/home) are portable capabilities that work across Claude Code, Cursor, VS Code, and more.

If `--skills` not in arguments:
```bash
# Check skill-mapping.json for recommended skills
cat templates/skills/skill-mapping.json 2>/dev/null
```

- Use AskUserQuestion with header "Skills" and `multiSelect: false`
- Question: "Which skills should be included?"
- Options:
  - "Recommended (based on knowledge)" - Include recommended skills matching selected knowledge categories
  - "None" - Don't include any skills
  - [List installed skills from `templates/skills/*/` if any exist]

**Recommended mode logic:**
1. Read `templates/skills/skill-mapping.json`
2. For each selected knowledge category (web, database, auth, monorepo, patterns)
3. Include skills from the `recommended.[category]` array
4. Example: If "Next.js" knowledge selected (category: web), include frontend-design, webapp-testing, etc.

**Recommended skills by category:**
- **web**: frontend-design, webapp-testing, web-artifacts-builder, theme-factory
- **patterns**: mcp-builder, docx, pptx, xlsx, pdf, skill-creator

---

## Step 3: Create Output Folder

Create a timestamped temp folder with subdirectories:

```bash
OUTPUT_DIR="/tmp/project-setup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR/commands" "$OUTPUT_DIR/knowledge"
```

---

## Step 4: Copy Selected Files

### 4a. Copy Setup Files (to root)

For each selected setup file from the profile:
```bash
cp "templates/profiles/<profile>/<filename>.md" "$OUTPUT_DIR/"
```

### 4b. Copy Selected Commands (to commands/ subfolder)

For each selected command doc:
```bash
cp "templates/commands/<filename>.md" "$OUTPUT_DIR/commands/"
```

If no commands selected, remove the empty commands folder:
```bash
rmdir "$OUTPUT_DIR/commands" 2>/dev/null || true
```

### 4c. Copy Selected Task Docs (to root)

For each selected task doc:
```bash
cp "templates/tasks/<filename>.md" "$OUTPUT_DIR/"
```

### 4d. Copy Selected Knowledge (to knowledge/ subfolder)

For each selected skill doc:
```bash
cp "templates/knowledge/<filename>.md" "$OUTPUT_DIR/knowledge/"
```

If no knowledge selected, remove the empty knowledge folder:
```bash
rmdir "$OUTPUT_DIR/knowledge" 2>/dev/null || true
```

---

## Step 5: Generate SETUP.md

Create `SETUP.md` in the output folder that guides the agent through setup.

The file should:
1. List what's included in this setup package
2. Tell the agent to read each setup file in order
3. Explain commands are implementation guides to set up
4. List each task doc to execute at the end
5. Explain knowledge are reference documentation
6. Provide a final verification checklist

### Template for SETUP.md:

```markdown
# Project Setup Package

This package contains everything needed to set up a new project with the **[profile]** workflow.

---

## What's Included

### Setup Files (root)
[List each selected setup file with brief description]

### Commands (commands/ folder)
[List each selected command, or "None" if none selected]

> Commands are implementation guides - use them to create slash commands in `.claude/commands/`

### Tasks (root)
[List each selected task, or "None" if none selected]

### Knowledge (knowledge/ folder)
[List each selected skill, or "None" if none selected]

> Knowledge are knowledge base documents - reference guides that inform how to build things. Consult them during development, not during setup.

### Skills (to install)
[List each recommended skill based on knowledge categories, or "None" if none selected]

> Skills are from [agentskills.io](https://agentskills.io/home) - portable capabilities that work across Claude Code, Cursor, VS Code, and more.

---

## Setup Instructions

Follow these steps in order:

### Step 1: Execute Setup Files

Read and execute each setup file:

[For each setup file, add:]
#### [Filename]
- Read: `[filename].md`
- Execute all instructions in the file

### Step 2: Set Up Commands

[If commands were selected:]
The `commands/` folder contains implementation guides for slash commands:
[List each command file]

For each command guide:
1. Read the guide
2. Create the corresponding command in `.claude/commands/`
3. Follow any additional setup instructions in the guide

[Or if no commands: "No additional commands included."]

### Step 3: Execute Tasks

[For each task, add:]
#### [Filename]
- Read: `[filename].md`
- Execute the task as described

[Or if no tasks: "No additional tasks selected."]

### Step 4: Knowledge Reference

[If knowledge were selected:]
The `knowledge/` folder contains reference documentation:
[List each skill file]

These are not setup instructions - they are knowledge docs for the agent to consult during feature development.

[Or if no knowledge: "No knowledge documentation included."]

### Step 5: Install Skills

[If skills were recommended:]
Install the recommended skills:

```bash
[For each skill, add:]
npx add-skill anthropics/skills -s [skill-name]
```

Skills provide specialized capabilities and are automatically loaded once installed.

[Or if no skills: "No skills recommended."]

---

## Final Organization

After setup completes, the setup instructions will organize documentation:

**Moved to `docs/`:**
- SETUP.md, SETUP-INSTRUCTIONS.md, LEARNINGS.md
- commands/ → docs/commands/
- knowledge/ → docs/knowledge/

**Kept at root:**
- CLAUDE.md (required by Claude Code)
- README.md (user-facing)

---

## Verification

After completing all steps, verify:
- [ ] Git repository initialized
- [ ] `.claude/settings.json` exists with plugins configured
- [ ] All setup instructions have been executed
- [ ] All commands have been created in `.claude/commands/`
- [ ] All tasks have been completed
- [ ] Recommended skills installed via `npx add-skill` (if any)
- [ ] `CLAUDE.md` exists and documents available commands
- [ ] Documentation organized into `docs/`
- [ ] Initial commit made

---

## How to Use This Package

Copy this folder to your new project, then tell Claude Code:

```
Read all files in this folder, starting with SETUP.md, and execute the setup.
```
```

---

## Step 6: Report Output

Tell the user:

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

Open the folder:
```bash
open "$OUTPUT_DIR"
```

---

## Example Usage

### Interactive (ask all questions)
```
/prepare-setup
```

### With profile specified
```
/prepare-setup --profile developer
```

### Fully specified (no questions)
```
/prepare-setup --profile developer --setup all --commands all --tasks none --knowledge all
```

### Include specific items
```
/prepare-setup --profile developer --commands END-SESSION-COMMAND --knowledge Next.js-App-Build-Guide
```
