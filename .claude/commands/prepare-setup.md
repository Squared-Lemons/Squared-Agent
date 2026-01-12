---
name: prepare-setup
description: Prepare a setup package for a new project with selected profile and tasks
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Prepare Setup Package

Create a setup package for bootstrapping a new project.

**Arguments:** $ARGUMENTS

---

## How It Works

1. Select a profile type from `setups/`
2. Select which setup files to include from that profile
3. Select which tasks to run at the end from `tasks/`
4. Generate a `SETUP.md` guide file
5. Copy all selected files to a temp folder

---

## Step 1: Gather Available Options

First, discover what's available:

```bash
# List profile types (folders in setups/)
ls -d setups/*/

# List task docs (markdown files in tasks/, excluding README)
ls tasks/*.md 2>/dev/null | grep -v README || echo "No tasks found"
```

---

## Step 2: Parse Arguments or Ask Questions

Check if arguments were provided in `$ARGUMENTS`. Arguments can be:
- `--profile <name>` - Skip profile question
- `--setup <file1,file2>` - Skip setup files question (comma-separated, or "all")
- `--tasks <file1,file2>` - Skip tasks question (comma-separated, or "all" or "none")

If an argument is not provided, ask the user using AskUserQuestion.

### 2a. Profile Type Selection

If `--profile` not in arguments:
- Use AskUserQuestion with header "Profile"
- Question: "Which setup profile type do you want to use?"
- Options: List each folder in `setups/` as an option

### 2b. Setup Files Selection

After profile is selected, list files in that profile folder:
```bash
ls setups/<profile>/*.md
```

If `--setup` not in arguments AND there are multiple files:
- Use AskUserQuestion with header "Setup" and `multiSelect: true`
- Question: "Which setup files do you want to include?"
- Options: List each .md file in `setups/<profile>/`
- Include "All" as an option

If only one file exists, select it automatically.

### 2c. Tasks Selection

If `--tasks` not in arguments:
```bash
ls tasks/*.md 2>/dev/null | grep -v README
```

If task files exist:
- Use AskUserQuestion with header "Tasks" and `multiSelect: true`
- Question: "Which tasks should run after setup?"
- Options: List each .md file in `tasks/` (excluding README.md)
- Include "All" and "None" as options

---

## Step 3: Create Output Folder

Create a timestamped temp folder:

```bash
OUTPUT_DIR="/tmp/project-setup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR"
```

---

## Step 4: Copy Selected Files

### 4a. Copy Setup Files

For each selected setup file from the profile:
```bash
cp "setups/<profile>/<filename>.md" "$OUTPUT_DIR/"
```

### 4b. Copy Selected Task Docs

For each selected task doc:
```bash
cp "tasks/<filename>.md" "$OUTPUT_DIR/"
```

---

## Step 5: Generate SETUP.md

Create `SETUP.md` in the output folder that guides the agent through setup.

The file should:
1. List what's included in this setup package
2. Tell the agent to read each setup file in order
3. List each task doc to execute at the end
4. Provide a final verification checklist

### Template for SETUP.md:

```markdown
# Project Setup Package

This package contains everything needed to set up a new project with the **[profile]** workflow.

---

## What's Included

### Setup Files
[List each selected setup file with brief description]

### Tasks
[List each selected task, or "None" if none selected]

---

## Setup Instructions

Follow these steps in order:

### Step 1: Execute Setup Files

Read and execute each setup file:

[For each setup file, add:]
#### [Filename]
- Read: `[filename].md`
- Execute all instructions in the file

### Step 2: Execute Tasks

[For each task, add:]
#### [Filename]
- Read: `[filename].md`
- Execute the task as described

[Or if no tasks: "No additional tasks selected."]

---

## Verification

After completing all steps, verify:
- [ ] Git repository initialized
- [ ] `.claude/settings.json` exists with plugins configured
- [ ] All setup instructions have been executed
- [ ] All tasks have been completed
- [ ] `CLAUDE.md` exists and documents available commands
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
- [list of task files]

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
/prepare-setup --profile developer --setup all --tasks none
```
