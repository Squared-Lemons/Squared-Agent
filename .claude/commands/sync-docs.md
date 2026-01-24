---
name: sync-docs
description: Synchronize documentation across related files for consistency
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Sync Docs

Synchronize documentation across related files for voice, terminology, and pattern consistency.

**Arguments:** $ARGUMENTS

---

## What This Command Does

When you update one document, related documents often need updates too. This command:
- Checks documentation against style guide patterns
- Identifies inconsistencies in voice, terminology, and formatting
- Propagates changes across related files
- Ensures cross-references stay valid

---

## Overview

1. Parse arguments (scope or specific file)
2. Load style guide and patterns
3. Audit documents against patterns
4. Report inconsistencies
5. Apply fixes (with approval)
6. Verify cross-references

---

## Step 1: Parse Arguments

Check `$ARGUMENTS` for:
- `--audit` — Report only, don't fix
- `--scope [area]` — Limit to area (readme, commands, knowledge, skills)
- `[file-path]` — Sync specific file and its related docs

```bash
# Examples
# /sync-docs --audit                    # Full audit, no changes
# /sync-docs --scope commands           # Sync all command docs
# /sync-docs templates/skills/README.md # Sync skills docs
```

If no arguments, default to full sync with approval for each change.

---

## Step 2: Load Style Guide

Read the style guide for reference:

```bash
cat docs/style-guide.md
```

Key elements to check:
- **Terminology** — Use correct terms (spawned project, master agent, skill, knowledge, command, install, catalogue)
- **Voice** — Direct, concise, practical
- **Formatting** — Proper heading levels, code blocks, tables

---

## Step 3: Load Relevant Patterns

Based on scope or file type, read the appropriate pattern:

```bash
# For README files
cat docs/doc-patterns/readme-pattern.md

# For command guides
cat docs/doc-patterns/command-pattern.md

# For knowledge guides
cat docs/doc-patterns/knowledge-pattern.md
```

---

## Step 4: Identify Documents to Check

Based on scope:

| Scope | Files to Check |
|-------|----------------|
| `readme` | README.md, templates/README.md, templates/*/README.md |
| `commands` | .claude/commands/*.md, templates/commands/*.md |
| `knowledge` | templates/knowledge/**/*.md |
| `skills` | templates/skills/README.md, .claude/commands/add-skill.md |
| (none) | All of the above |

```bash
# List files for scope
case "$SCOPE" in
  readme)
    find . -name "README.md" -not -path "./.git/*"
    ;;
  commands)
    ls .claude/commands/*.md templates/commands/*.md
    ;;
  knowledge)
    find templates/knowledge -name "*.md"
    ;;
  skills)
    echo "templates/skills/README.md"
    echo ".claude/commands/add-skill.md"
    ;;
  *)
    # All docs
    find . -name "*.md" -not -path "./.git/*" -not -path "./node_modules/*"
    ;;
esac
```

---

## Step 5: Audit Each Document

For each document, check:

### Terminology Consistency
```bash
# Check for incorrect terms
grep -n "child project\|new project\|target project" "$FILE"  # Should be "spawned project"
grep -n "parent agent\|main agent" "$FILE"                     # Should be "master agent"
grep -n "agent skill\|Agent skill" "$FILE"                     # Should be "skill" (after first mention)
grep -n "slash command" "$FILE"                                 # Should be "command" (after first mention)
grep -n "set up\|configure" "$FILE"                            # Consider "install" for skills
```

### Structure Compliance
- Check heading hierarchy (no skipped levels)
- Check for required sections per pattern
- Check navigation links (nested READMEs)

### Formatting
- Code blocks have language identifiers
- Tables are properly formatted
- Lists use consistent markers

---

## Step 6: Report Findings

For `--audit` mode, report and exit:

```
Documentation Audit Report

README Files:
✓ README.md - OK
✗ templates/skills/README.md - 2 issues
  - Line 15: Uses "child project" (should be "spawned project")
  - Missing: Navigation links

Command Guides:
✓ .claude/commands/add-skill.md - OK
✓ .claude/commands/spawn-project.md - OK

Knowledge Guides:
✗ templates/knowledge/web/nextjs/README.md - 1 issue
  - Missing: Related Skills section

Summary: 2 files need attention
```

---

## Step 7: Apply Fixes

For each issue, use AskUserQuestion:

**Question:** "Fix terminology in templates/skills/README.md?"

**Options:**
- "Yes, fix all" — Apply all fixes in this file
- "Show changes first" — Display proposed edits
- "Skip this file" — Move to next file
- "Stop" — Exit sync

Then use Edit tool to apply changes:

```bash
# Example: Fix terminology
sed -i '' 's/child project/spawned project/g' "$FILE"
```

---

## Step 8: Update Cross-References

Check that links between documents are valid:

```bash
# Find all markdown links
grep -oE '\[.*\]\([^)]+\)' "$FILE"

# Verify each link target exists
for link in $(grep -oE '\([^)]+\.md\)' "$FILE" | tr -d '()'); do
  if [ ! -f "$link" ]; then
    echo "Broken link: $link"
  fi
done
```

---

## Step 9: Check Documentation Map

Per style guide, when updating one doc, check related areas:

| If You Updated | Also Check |
|----------------|------------|
| README.md | CLAUDE.md (commands, structure) |
| CLAUDE.md | README.md (if adding commands) |
| templates/*/README.md | templates/README.md, root README.md |
| .claude/commands/*.md | CLAUDE.md (command list), templates/commands/ |
| templates/skills/ | README.md (Tools section), CLAUDE.md, knowledge READMEs |
| templates/knowledge/ | README.md, templates/README.md, skill mappings |

Prompt user about related files that may need updates.

---

## Step 10: Report Results

```
Documentation Sync Complete

Fixed:
- templates/skills/README.md: 2 terminology fixes
- templates/knowledge/web/nextjs/README.md: Added Related Skills section

Verified:
- 15 cross-references valid
- 12 files match patterns

Skipped:
- README.md (user skipped)

Run `/sync-docs --audit` to verify all changes.
```

---

## Example Usage

### Full Audit (Report Only)
```
/sync-docs --audit
```

### Sync All Command Docs
```
/sync-docs --scope commands
```

### Sync Specific File and Related
```
/sync-docs templates/skills/README.md
```

### Full Sync with Approval
```
/sync-docs
```

---

## Notes

- Style guide lives at `docs/style-guide.md`
- Patterns live at `docs/doc-patterns/`
- Always run `--audit` first to see what will change
- This command reads patterns but doesn't modify them
- Use `/sync-templates` for command code synchronization (different purpose)
- Related: `/sync-templates` syncs command implementations, `/sync-docs` syncs documentation style
