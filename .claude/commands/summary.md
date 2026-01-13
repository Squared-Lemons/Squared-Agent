---
description: Generate an accomplishments summary for a specified time period
---

# Summary - Accomplishments Report

Generate a structured report of git activity and session work for a time period.

---

## Step 1: Ask Time Period

Use AskUserQuestion to ask which time period to summarize:

- **Today** - All commits since midnight today
- **Yesterday** - Commits from yesterday only
- **Past 7 days** - Last week of activity
- **Custom** - Specify number of days

If user selects "Custom", follow up asking for the number of days.

---

## Step 2: Gather Git Data

Based on the selected time period, run these commands in parallel:

### Date calculations:
- **Today**: `--since="00:00:00"`
- **Yesterday**: `--since="yesterday 00:00:00" --until="today 00:00:00"`
- **Past N days**: `--since="N days ago"`

### Commands to run:

```bash
# Commits with details
git log --since="[date]" --format="%H|%s|%ai" --no-merges
```

```bash
# Commit stats (files changed)
git log --since="[date]" --stat --no-merges
```

---

## Step 3: Check Session Logs

Check for session logs in the date range:

```bash
ls -la .project/sessions/ 2>/dev/null || echo "No session logs directory"
```

If session logs exist for dates in the range, read them:
- Location: `.project/sessions/YYYY-MM-DD.md`

---

## Step 4: Categorize Commits

Sort commits into categories based on their messages:

| Category | Patterns |
|----------|----------|
| Features | `feat:`, `feature:`, "add", "implement", "create" |
| Fixes | `fix:`, "bug", "resolve", "correct" |
| Refactors | `refactor:`, "simplify", "clean", "restructure" |
| Docs | `docs:`, "documentation", "readme" |
| Chores | `chore:`, "update", "upgrade", "bump" |
| Style | `style:`, "format", "lint" |

---

## Step 5: Generate Report

Output the report in this format:

```
# Accomplishments Summary

**Period:** [Start Date] to [End Date]
**Total Commits:** [count]

---

## Features Added
[List features grouped by area if related]

## Bug Fixes
[List fixes with brief descriptions]

## Refactoring & Improvements
[List refactors]

## Documentation Updates
[List doc changes]

## Other Changes
[Anything that doesn't fit above categories]

---

## Session Highlights

### Key Changes
[From session logs if available - summarize major work]

### Insights Captured
[Key learnings from session logs]

---

## Statistics

| Category | Count |
|----------|-------|
| Features | [n] |
| Fixes | [n] |
| Refactors | [n] |
| Docs | [n] |
| Chores | [n] |
| Files changed | [n] |
```

---

## Edge Cases

- **No commits found**: Display "No activity found for the selected time period"
- **No session logs**: Skip the Session Highlights section entirely
- **Multiple sessions same day**: Combine highlights from all sessions
- **Empty categories**: Omit sections with no items

---

## Output Notes

The report should be:
1. **Copy-paste friendly** - Can be shared directly
2. **Scannable** - Use bullet points, not paragraphs
3. **Factual** - Don't embellish or add commentary

If user asks to adjust for email, convert to prose format suitable for email updates.

---

## Starting Now

Ask the user which time period they want to summarize.
