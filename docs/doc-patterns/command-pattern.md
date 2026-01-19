# Command Pattern

Template and guidelines for slash command documentation.

---

## Command Guide Template

```markdown
---
name: command-name
description: One-line description (shown in /help)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, AskUserQuestion
---

# Command Name

One sentence explaining what this command does and when to use it.

**Arguments:** $ARGUMENTS

---

## What This Command Does

Brief explanation (2-3 sentences) of the command's purpose. Include:
- What problem it solves
- When to use it
- Key outcomes

---

## Overview

Numbered list of steps:
1. First action
2. Second action
3. Third action
4. Final action

---

## Step 1: Step Name

Explanation of this step.

\`\`\`bash
# Example command
command --flag value
\`\`\`

Expected output or what to look for.

---

## Step 2: Step Name

Continue pattern...

---

## Step N: Report Results

Summarize what was done:

\`\`\`
Command Complete

Results:
- Item 1
- Item 2

Next steps:
- What to do next
- Related commands
\`\`\`

---

## Example Usage

### Basic Usage
\`\`\`
/command-name
\`\`\`

### With Arguments
\`\`\`
/command-name --flag value
\`\`\`

### Common Scenario
\`\`\`
/command-name specific-use-case
\`\`\`

---

## Notes

- Important consideration 1
- Important consideration 2
- Edge cases to be aware of
- Related commands: \`/related-command\`
```

---

## Allowed Tools Reference

Common tool combinations:

| Command Type | Typical Tools |
|--------------|---------------|
| Read-only/Research | Bash, Read, Glob, Grep |
| File modification | Bash, Read, Write, Edit, Glob, Grep |
| Interactive | Above + AskUserQuestion |
| Full access | All tools |

---

## Step Writing Guidelines

### DO
- Start with action verb ("Run", "Check", "Create")
- Include example commands in code blocks
- Explain expected outcomes
- Handle error cases

### DON'T
- Use vague instructions ("do the thing")
- Skip error handling
- Assume context from previous steps without reference

---

## Checklist

- [ ] Frontmatter complete (name, description, allowed-tools)
- [ ] $ARGUMENTS placeholder included
- [ ] Overview section with numbered steps
- [ ] Each step has clear instructions and examples
- [ ] Example usage section with multiple scenarios
- [ ] Notes section for edge cases
- [ ] Consistent formatting throughout
