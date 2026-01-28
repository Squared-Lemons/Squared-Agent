# Documentation Style Guide

This guide ensures consistent voice, tone, and formatting across all Squared Agent documentation.

---

## Voice & Tone

### Be Direct
- Lead with what something does, not what it is
- Use active voice
- Front-load the important information

```markdown
# Good
Skills are installed during setup via `npx skills add`.

# Avoid
The process of installing skills involves running the npx skills add command during the setup phase.
```

### Be Concise
- One idea per sentence
- Cut unnecessary words
- Use tables for structured information

```markdown
# Good
| Skill | Purpose |
|-------|---------|
| frontend-design | Production-grade UI |

# Avoid
The frontend-design skill is a skill that helps you create production-grade UI components that don't look like generic AI-generated interfaces.
```

### Be Practical
- Show, don't just tell
- Include runnable examples
- Link to related docs

```markdown
# Good
Install a skill:
\`\`\`bash
npx skills add anthropics/skills -s frontend-design
\`\`\`

# Avoid
To install a skill, you would typically use the npx command with the add-skill package.
```

---

## Terminology

Use these terms consistently:

| Use | Don't Use |
|-----|-----------|
| spawned project | child project, new project, target project |
| master agent | parent agent, main agent, Squared Agent |
| skill | agent skill (after first mention) |
| knowledge | skill docs, guides (when referring to templates/knowledge/) |
| command | slash command (after first mention) |
| install | set up, configure (for skills) |
| catalogue | catalog, register (for tracking in mapping files) |

### Feature Names
- **Agent Skills** — capitalize when referring to the platform/standard
- **skill-mapping.json** — always lowercase with extension
- **SETUP.md** — always uppercase

---

## Document Structure

### README Files

```markdown
# Title

[← Back to Parent](link) · [← Back to README](link)    # Navigation (if nested)

---

One-line description of what this is.

## Section 1
Content...

## Section 2
Content...

---

## Sources (if external references exist)
- [Link](url) — Description
```

### Command Guides

```markdown
---
name: command-name
description: One-line description
allowed-tools: Tool1, Tool2, Tool3
---

# Command Name

One-line description of what this command does.

**Arguments:** $ARGUMENTS

---

## Overview

Numbered list of what this command does:
1. First thing
2. Second thing
3. Third thing

---

## Step 1: First Step

Instructions...

\`\`\`bash
example command
\`\`\`

---

## Step N: Last Step

Instructions...

---

## Example Usage

### Scenario 1
\`\`\`
/command arg1
\`\`\`

### Scenario 2
\`\`\`
/command arg2
\`\`\`

---

## Notes

- Bullet points for important notes
- Edge cases
- Related commands
```

### Knowledge Guides

```markdown
# Topic Name

[← Back to Knowledge](link)

---

Brief description of what this guide covers.

## Quick Reference

Table or list of key information.

## Section 1

Content with code examples...

## Section 2

Content...

---

## Related

- Links to related guides
- Links to related skills
```

---

## Formatting Rules

### Headings
- Use `#` for document title (one per doc)
- Use `##` for main sections
- Use `###` for subsections
- Don't skip levels

### Code
- Use backticks for inline code: `like this`
- Use fenced blocks for multi-line code with language identifier
- Use `bash` for shell commands
- Use `markdown` for doc examples

### Tables
- Use tables for structured comparisons
- Keep tables simple (3-5 columns max)
- Align columns for readability

### Lists
- Use `-` for unordered lists
- Use `1.` for ordered lists (steps)
- Keep list items parallel in structure

### Links
- Use relative links within the repo
- Use descriptive link text, not "click here"
- Include `→` arrow for "view more" links: `**[View all →](link)**`

### Separators
- Use `---` between major sections
- Don't use separators between every subsection

---

## Common Patterns

### Flow Diagrams (ASCII)

```
┌─────────────┐     ┌─────────────┐
│   Step 1    │ ──→ │   Step 2    │
└─────────────┘     └─────────────┘
```

Or simple:

```
Step 1 ──→ Step 2 ──→ Step 3
```

### Command Tables

| Command | Description |
|---------|-------------|
| `/command1` | What it does |
| `/command2` | What it does |

### Feature Tables

| Feature | Purpose | Category |
|---------|---------|----------|
| **name** | Description | category |

### Install Commands

```bash
npx skills add anthropics/skills -s skill-name
```

---

## Documentation Map

When updating one doc, consider updating these related areas:

| If You Update | Also Check |
|---------------|------------|
| README.md | CLAUDE.md (commands, structure) |
| CLAUDE.md | README.md (if adding commands) |
| templates/*/README.md | templates/README.md, root README.md |
| .claude/commands/*.md | CLAUDE.md (command list), templates/commands/ |
| templates/skills/ | README.md (Tools section), CLAUDE.md, knowledge READMEs |
| templates/knowledge/ | README.md, templates/README.md, skill mappings |

---

## Checklist Before Committing Docs

- [ ] Terminology is consistent (see Terminology section)
- [ ] Links work and are relative
- [ ] Code examples are runnable
- [ ] Tables are properly formatted
- [ ] Navigation links present (for nested docs)
- [ ] No orphaned sections (headings without content)
- [ ] Related docs updated if needed
