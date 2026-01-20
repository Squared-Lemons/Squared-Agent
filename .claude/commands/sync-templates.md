---
name: sync-templates
description: Sync active commands to template files for spawned projects
allowed-tools: Read, Write, Edit, Bash, Glob, AskUserQuestion
---

# Sync Templates - Keep Templates Up-to-Date

Detect and sync improvements from active commands to template files that spawned projects inherit.

**Arguments**: `$ARGUMENTS` - Optional flags: `--audit` (report only) or `--background` (silent)

---

## Overview

When you improve commands in `.claude/commands/`, those improvements should propagate to:
- `templates/commands/` - Implementation guides for spawned projects
- `templates/profiles/developer/` - Setup configuration

This command compares active commands vs templates and syncs changes.

---

## Sync Mapping

| Active Command | Template File |
|----------------|---------------|
| `.claude/commands/start-session.md` | `templates/commands/Start-Session-Command.md` |
| `.claude/commands/end-session.md` | `templates/commands/END-SESSION-COMMAND.md` |
| `.claude/commands/new-feature.md` | `templates/commands/New-Feature-Command.md` |
| `.claude/commands/complete-feature.md` | `templates/commands/Complete-Feature-Command.md` |
| `.claude/commands/summary.md` | `templates/commands/Summary-Command.md` |
| `.claude/commands/vibekanban.md` | `templates/commands/VibeKanban-Command.md` |
| `.claude/commands/commit.md` | `templates/commands/END-SESSION-COMMAND.md` (section 2) |
| `.claude/settings.json` (plugins) | `templates/profiles/developer/SETUP-INSTRUCTIONS.md` |

**NOT synced** (master-agent specific):
- `prepare-setup.md`, `new-idea.md`, `how-to-use.md`, `get-feedback.md`, `list-tools.md`

---

## Step 1: Parse Arguments

Check `$ARGUMENTS` for flags:

- **`--audit`**: Report only, no changes
- **`--background`**: Run silently, write report to `.project/sync-report.md`
- **No flags**: Interactive mode - show drift, ask which to sync

---

## Step 2: Get File Modification Times

For each mapped pair, get modification times:

```bash
# Active commands
stat -f "%m %N" .claude/commands/start-session.md 2>/dev/null || stat -c "%Y %n" .claude/commands/start-session.md 2>/dev/null
stat -f "%m %N" .claude/commands/end-session.md 2>/dev/null || stat -c "%Y %n" .claude/commands/end-session.md 2>/dev/null
stat -f "%m %N" .claude/commands/new-feature.md 2>/dev/null || stat -c "%Y %n" .claude/commands/new-feature.md 2>/dev/null
stat -f "%m %N" .claude/commands/complete-feature.md 2>/dev/null || stat -c "%Y %n" .claude/commands/complete-feature.md 2>/dev/null
stat -f "%m %N" .claude/commands/summary.md 2>/dev/null || stat -c "%Y %n" .claude/commands/summary.md 2>/dev/null
stat -f "%m %N" .claude/commands/commit.md 2>/dev/null || stat -c "%Y %n" .claude/commands/commit.md 2>/dev/null
stat -f "%m %N" .claude/settings.json 2>/dev/null || stat -c "%Y %n" .claude/settings.json 2>/dev/null
```

```bash
# Templates
stat -f "%m %N" templates/commands/Start-Session-Command.md 2>/dev/null || stat -c "%Y %n" templates/commands/Start-Session-Command.md 2>/dev/null
stat -f "%m %N" templates/commands/END-SESSION-COMMAND.md 2>/dev/null || stat -c "%Y %n" templates/commands/END-SESSION-COMMAND.md 2>/dev/null
stat -f "%m %N" templates/commands/New-Feature-Command.md 2>/dev/null || stat -c "%Y %n" templates/commands/New-Feature-Command.md 2>/dev/null
stat -f "%m %N" templates/commands/Complete-Feature-Command.md 2>/dev/null || stat -c "%Y %n" templates/commands/Complete-Feature-Command.md 2>/dev/null
stat -f "%m %N" templates/commands/Summary-Command.md 2>/dev/null || stat -c "%Y %n" templates/commands/Summary-Command.md 2>/dev/null
stat -f "%m %N" templates/profiles/developer/SETUP-INSTRUCTIONS.md 2>/dev/null || stat -c "%Y %n" templates/profiles/developer/SETUP-INSTRUCTIONS.md 2>/dev/null
```

---

## Step 3: Compare Content

For each pair where active is newer than template:

1. Read the active command content
2. Read the template file
3. Find the markdown code block in template that contains the command definition
4. Compare the code block content with active command
5. Mark as "PUSH needed" if different

### Status Categories

| Status | Meaning |
|--------|---------|
| ✅ UP-TO-DATE | Content matches |
| ⚠️ PUSH | Active is newer, sync to template |
| 🔄 PULL | Template is newer (unusual, investigate) |
| ❌ MISSING | One side doesn't exist |

---

## Step 4: Build Drift Report

Create a report of findings:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Template Sync Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Summary
- [N] templates need updating
- [N] settings changes detected

## Commands

| Status | Active Command | Template |
|--------|----------------|----------|
| [status] | [active file] | [template file] |
...

## Settings

| Setting | Status | Notes |
|---------|--------|-------|
| enabledPlugins | [status] | [details] |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 5: Handle Mode

### If `--audit`

Display the report and stop. Do not make changes.

### If `--background`

Write report to `.project/sync-report.md`:

```markdown
# Template Sync Report
Generated: [timestamp]

## Summary
- [N] templates need updating
- [N] settings changes detected

## Commands

| Status | Active Command | Template |
|--------|----------------|----------|
| [status] | [active file] | [template file] |

## Settings

| Setting | Status | Notes |
|---------|--------|-------|
| enabledPlugins | [status] | [details] |

## Actions
Run `/sync-templates` to update templates interactively.
```

Then silently exit. The report will be picked up by `/end-session` or `/complete-feature`.

### If Interactive (no flags)

If everything is up-to-date:
```
✅ All templates are up-to-date. Nothing to sync.
```

If drift detected, show report and ask:

```
Would you like to sync these templates?

1. **Sync all** - Update all out-of-sync templates
2. **Select individually** - Choose which to sync
3. **Skip** - Don't sync now
```

---

## Step 6: Perform Sync

For each template to sync:

### Command Templates

Templates have prose documentation with an embedded code block containing the command.

**Pattern to find:**
- Look for ` ```markdown ` code block that contains `---` frontmatter with `name:` or `description:`
- This is the command definition block

**Sync process:**
1. Read the template file
2. Find the main markdown code block containing the command
3. Replace the content between ` ```markdown ` and ` ``` ` with the active command content
4. Preserve all prose before and after the code block
5. Write the updated template

**Example:**

The template has structure like:
```
# Command Name - Implementation Guide

Prose description here...

## Files to Create

### Main Command: `.claude/commands/example.md`

` ```markdown
---
name: example
description: Does something
---

[COMMAND CONTENT - THIS GETS REPLACED]
` ```

More prose documentation...
```

### commit.md Special Case

The `commit.md` command syncs to a section within `END-SESSION-COMMAND.md`:

1. Find the `### 2. Helper Command: `.claude/commands/commit.md`` section
2. Replace the code block under that heading
3. Keep all other sections intact

### Settings Sync

For `.claude/settings.json` → `SETUP-INSTRUCTIONS.md`:

1. Read `enabledPlugins` from settings.json
2. Find the JSON code block in SETUP-INSTRUCTIONS.md under "Configure Claude Code"
3. Update the `enabledPlugins` section to match
4. Keep all other settings (permissions, hooks) intact

---

## Step 7: Confirm Results

After syncing, display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Templates Synced
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Updated:
- templates/commands/Start-Session-Command.md
- templates/commands/END-SESSION-COMMAND.md
- templates/profiles/developer/SETUP-INSTRUCTIONS.md

These changes are staged and ready to commit.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Code Block Detection

### Finding the Command Code Block

Templates follow this pattern:

```markdown
### Main Command: `.claude/commands/[name].md`

` ```markdown
---
name: [name]
description: [description]
---

[rest of command content]
` ```
```

To find it:
1. Search for ` ```markdown ` followed by lines starting with `---`
2. Verify the frontmatter contains `name:` or `description:`
3. Find the closing ` ``` `
4. This delimits the command content to replace

### Preserving Template Structure

When replacing:
1. Keep everything before the opening ` ```markdown `
2. Replace content between fences with active command
3. Keep everything after the closing ` ``` `

This preserves:
- Overview sections
- Setup requirements
- Usage examples
- Customization points
- Other documentation

---

## Cleanup

If `.project/sync-report.md` exists and sync was performed, delete it:

```bash
rm -f .project/sync-report.md
```

---

## Execution Instructions

1. Parse `$ARGUMENTS` for `--audit` or `--background` flags
2. Get modification times for all mapped files
3. Compare content of active commands vs template code blocks
4. Build drift report
5. Handle based on mode:
   - `--audit`: Show report, exit
   - `--background`: Write to `.project/sync-report.md`, exit
   - Interactive: Show report, ask user, perform sync
6. For each sync:
   - Read template, find command code block
   - Replace code block with active command content
   - Write updated template
7. Confirm results
8. Clean up sync report file if it exists

---

## Starting Now

Check `$ARGUMENTS` and begin the sync process.
