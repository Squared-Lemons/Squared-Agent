---
description: Generate feedback to send back to the parent agent
---

# Agent Feedback

Analyze the current session and generate structured feedback for the parent agent.

---

## Step 1: Analyze Session

Review the session context to identify:

### Knowledge Gaps
- Missing documentation that would have helped
- Outdated information in knowledge guides
- Unclear or incomplete instructions

### Setup Issues
- Problems with project initialization
- Missing files or configurations
- Template improvements needed

### New Patterns
- Useful code patterns developed during the session
- Reusable helpers or utilities
- Architectural decisions worth documenting

### Technical Gotchas
- Framework quirks encountered
- Undocumented behavior discovered
- Error messages and their solutions

---

## Step 2: Check for Existing Feedback

Check if feedback file already exists for today:

```bash
ls outbox/feedback/feedback-$(date +%Y-%m-%d).md 2>/dev/null
```

If file exists, use AskUserQuestion:
- **Append** - Add new findings to existing file
- **Replace** - Overwrite with new feedback
- **Skip** - Cancel and show existing file

---

## Step 3: Generate Feedback

Create structured feedback using this format:

```markdown
# Agent Feedback - [Project Name] - YYYY-MM-DD

## Knowledge Gaps

- **[Topic]** - [Description of what was missing or incorrect.
  Include specific file paths or guide names if relevant.]

## Setup Issues

- **[Issue]** - [What was wrong and what should change.]

## New Patterns

- **[Pattern name]** - [Brief description of the pattern and why it's useful.
  Include code example if helpful.]

## Technical Gotchas

- **[Framework/Tool]** - [The gotcha encountered, how it manifests,
  and the solution or workaround.]
```

---

## Step 4: Write Output

Ensure outbox/feedback directory exists:

```bash
mkdir -p outbox/feedback
```

Write the feedback file:
- Location: `outbox/feedback/feedback-YYYY-MM-DD.md`
- Use today's date in filename

If appending, add a section divider:

```markdown
---

## Additional Feedback - [Time]

[New findings...]
```

---

## Step 5: Display Instructions

After writing, tell the user:

> Feedback saved to `outbox/feedback/feedback-YYYY-MM-DD.md`
>
> To send to parent agent:
> 1. Copy file to parent agent's `inbox/feedback/`
> 2. Run `/start-session` in parent agent (will detect and offer to process)
>
> The parent agent will review and implement improvements.

---

## Edge Cases

- **No learnings to report**: Ask if user wants to capture anything specific
- **Project has no parent agent**: Still useful for personal documentation
- **Multiple sessions same day**: Append mode preserves earlier findings

---

## Starting Now

Analyze this session for knowledge gaps, patterns, and gotchas to share with the parent agent.
