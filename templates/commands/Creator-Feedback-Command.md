# Creator Feedback Command - Implementation Guide

A Claude Code command for generating structured feedback to send back to the master agent.

---

## Overview

The `/creator-feedback` command analyzes the current session to identify knowledge gaps, technical gotchas, and new patterns worth sharing with the master agent.

### What It Does

| Step | Action |
|------|--------|
| 1 | Analyzes session context for learnings |
| 2 | Categorizes findings (knowledge gaps, setup issues, patterns, gotchas) |
| 3 | Checks for existing feedback file |
| 4 | Asks: append / replace / skip if file exists |
| 5 | Writes structured feedback to `outbox/creator-feedback-YYYY-MM-DD.md` |

### Use Cases

- End of session feedback capture
- Documenting gotchas as they're discovered
- Sharing new patterns with master agent
- Continuous improvement loop between projects

---

## Files to Create

### 1. Main Command: `.claude/commands/creator-feedback.md`

```markdown
---
description: Generate feedback to send back to the master agent
---

# Creator Feedback

Analyze the current session and generate structured feedback for the master agent.

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
ls outbox/creator-feedback-$(date +%Y-%m-%d).md 2>/dev/null
```

If file exists, use AskUserQuestion:
- **Append** - Add new findings to existing file
- **Replace** - Overwrite with new feedback
- **Skip** - Cancel and show existing file

---

## Step 3: Generate Feedback

Create structured feedback using this format:

```markdown
# Creator Feedback - [Project Name] - YYYY-MM-DD

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

Ensure outbox directory exists:

```bash
mkdir -p outbox
```

Write the feedback file:
- Location: `outbox/creator-feedback-YYYY-MM-DD.md`
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

> Feedback saved to `outbox/creator-feedback-YYYY-MM-DD.md`
>
> To send to master agent:
> 1. Copy file to master agent's `inbox/from-projects/`
> 2. Run `/get-feedback` in master agent
>
> The master agent will review and implement improvements.

---

## Edge Cases

- **No learnings to report**: Ask if user wants to capture anything specific
- **Project has no master agent**: Still useful for personal documentation
- **Multiple sessions same day**: Append mode preserves earlier findings

---

## Starting Now

Analyze this session for knowledge gaps, patterns, and gotchas to share with the master agent.
```

---

## Setup Requirements

### 1. Outbox Directory

Create the outbox directory for feedback files:

```bash
mkdir -p outbox
```

Add to `.gitignore` if you don't want feedback committed:
```
# Feedback files (optional - may want to track these)
# outbox/
```

### 2. Project Name

The command uses the project name from:
1. `package.json` name field
2. Git repository name
3. Current directory name as fallback

---

## Feedback Format Details

### Knowledge Gaps

Document missing or incorrect information:

```markdown
## Knowledge Gaps

- **Better Auth navigation** - Using `router.push()` + `router.refresh()`
  after auth actions causes a "regenerating" freeze. The pattern should be
  `window.location.href` for full page navigation after auth state changes.
  Add to Better Auth Guide.
```

### Setup Issues

Document problems during project setup:

```markdown
## Setup Issues

- **Missing .env.example** - Had to create this manually. Should be included
  in the template with placeholder values for required env vars.
```

### New Patterns

Document reusable code patterns:

```markdown
## New Patterns

- **Session helper with org context** - Created `getSessionWithOrg()` helper
  that returns user + organization in one call. Good pattern for multi-tenant
  apps that could be templated.

  ```typescript
  export async function getSessionWithOrg() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return { user: null, organization: null };
    const organization = await auth.api.getFullOrganization({ headers: await headers() });
    return { user: session.user, organization };
  }
  ```
```

### Technical Gotchas

Document framework quirks and solutions:

```markdown
## Technical Gotchas

- **Next.js 16 Suspense boundary** - Components using `useSearchParams()`
  must be wrapped in a Suspense boundary. Error message is clear but easy
  to miss during development.
```

---

## Bidirectional Flow

This command is part of the bidirectional communication pattern:

```
SPAWNED PROJECT                       MASTER AGENT
───────────────                       ────────────

/creator-feedback
  └─ Generates feedback
  └─ Writes to outbox/
                    ─────────────────▶
                    User copies file
                                      inbox/from-projects/
                                        └─ /get-feedback
                                        └─ Implements improvements
                                        └─ /end-session exports update
                    ◀─────────────────
                    User copies update
inbox/updates/
  └─ /start-session
  └─ Applies updates
```

---

## Usage

```bash
/creator-feedback
```

The command will:
1. Analyze the session for learnings
2. Check for existing feedback file
3. Ask append/replace/skip if file exists
4. Write structured feedback
5. Display instructions for sending to master agent

---

## Integration with Other Commands

### /end-session

The `/end-session` command can include creator feedback generation as part of the session wrap-up flow. Users can choose to generate feedback or skip.

### /get-feedback (Master Agent)

The master agent's `/get-feedback` command processes files in `inbox/from-projects/`, presenting summaries and helping implement improvements.
