# Session-End Command - Implementation Guide

A Claude Code command for wrapping up coding sessions by updating documentation, capturing lessons learned, and committing changes with user approval.

---

## Overview

The `/session-end` command provides a structured workflow for ending coding sessions. It ensures documentation stays current, insights are captured, and changes are committed cleanly.

### What It Does

| Step | Action |
|------|--------|
| 1 | Reviews git diff and commits from the session |
| 2 | Updates README.md (user-facing documentation) |
| 3 | Updates CLAUDE.md (technical docs, status tables) |
| 4 | Updates workflow docs (agents, skills, commands) |
| 5 | Captures lessons → docs/LEARNINGS.md |
| 6 | Syncs supporting files for consistency |
| 7 | Saves session log (local, gitignored archive) |
| 8 | Generates/updates SETUP.md (handoff document) |
| 9 | Generates creator feedback (auto-analyzed from session) |
| 10 | Shows summary to user |
| 11 | Commits with approval (user signs off last) |

---

## Files to Create

### 1. Main Command: `.claude/commands/session-end.md`

```markdown
---
name: session-end
description: End coding session - update docs, capture learnings, commit changes
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task
---

# Session End - Knowledge Capture

Wrap up this coding session by updating documentation and capturing lessons learned.

---

## What This Command Does

1. **Reviews session changes** - Analyzes git diff and commits from this session
2. **Updates README.md** - Keeps user-facing documentation accurate (commands, workflows, setup)
3. **Updates CLAUDE.md** - Syncs implementation status, recent changes, known issues
4. **Updates agents/skills** - Reflects any workflow changes or new patterns
5. **Captures lessons** - Documents insights in docs/LEARNINGS.md
6. **Saves session log** - Archives summary to `.project/sessions/YYYY-MM-DD.md` (local, not in git)
7. **Generates SETUP.md** - Auto-creates/updates handoff document with env vars, OAuth setup, feature status
8. **Generates creator feedback** - Auto-generates feedback from session for user to copy to master agent
9. **Shows summary** - Lists all changes ready to commit
10. **Commits with approval** - User signs off on commit message (does NOT push)

---

## Step 1: Gather Session Context

First, understand what happened this session:

```bash
# Recent commits (likely this session)
git log --oneline -10

# All uncommitted changes
git status

# Full diff of recent work
git diff HEAD~5..HEAD --stat
```

Read these to understand the session's scope.

---

## Step 2: Update README.md

The README is user-facing documentation. Keep it accurate:

### Check for outdated information
- Do commands listed still exist and work as described?
- Does the architecture diagram reflect current reality?
- Are setup instructions still correct?
- Do workflows match implementation?

### Update sections as needed
- **Commands tables** - Add new commands, remove deprecated ones
- **Getting Started** - Update if setup process changed
- **How It Works** - Update if architecture or workflow changed

### Tone consistency
- Keep it user-friendly and accessible
- Don't add technical implementation details (those go in CLAUDE.md)
- Focus on what users need to know, not how it works internally

---

## Step 3: Update CLAUDE.md

Review and update each section:

### Implementation Status Table
- Check each component - has its status changed?
- Did we add new components?
- Did we fix known issues?

### Recent Changes
- Add entries for significant changes made this session
- Format: `- **YYYY-MM-DD:** Description of change`
- Keep most recent at top

### Known Issues
- Remove any issues that were fixed
- Add any new issues discovered
- Be specific about reproduction steps

---

## Step 4: Update Workflow Documentation

If workflows changed, update:

### Agents
Check if any agent definitions need updating:
- `.claude/agents/*.md` - agent capabilities and instructions

### Skills
Check if any skills were added or modified:
- `.claude/skills/*/SKILL.md` - skill definitions

### Commands
Check if any commands were added or modified:
- `.claude/commands/*.md` - command definitions

---

## Step 5: Capture Lessons Learned

Create or update `docs/LEARNINGS.md` with insights from this session.

### Categories to capture:

**What Worked Well**
- Patterns that proved effective
- Tools/approaches that saved time
- Successful debugging strategies

**What Didn't Work**
- Approaches that failed or were abandoned
- Time sinks to avoid
- Antipatterns discovered

**Technical Insights**
- Library quirks or gotchas
- Performance observations
- Compatibility issues

**Process Improvements**
- Workflow optimizations
- Documentation gaps filled
- New commands or automations added

---

## Step 6: Sync Supporting Files

### Check for orphaned documentation
- Are there docs referencing removed features?
- Are there new features without documentation?

### Verify consistency
- Do agent descriptions match their implementations?
- Do skill descriptions match their capabilities?
- Does CLAUDE.md reflect current reality?

---

## Step 7: Save Session Log

Save the summary to a local (gitignored) session log file organised by date.

### File location
`.project/sessions/YYYY-MM-DD.md`

If the file already exists (multiple sessions same day), append to it with a timestamp separator.

### Format
```markdown
# Session Log: YYYY-MM-DD

## Session at HH:MM

### Changes Made
- [List from summary]

### Documentation Updated
- [List from summary]

### Key Insights
- [Lessons captured]

---
```

### Create the file
```bash
# Ensure directory exists
mkdir -p .project/sessions
```

Then write/append the session summary to `.project/sessions/YYYY-MM-DD.md`.

This creates a local archive of all session work that won't clutter the git repo.

---

## Step 8: Generate/Update SETUP.md

Create or update a `SETUP.md` file that serves as the handoff document for this project.

### Check if SETUP.md exists

If it doesn't exist, create it. If it does, update it with current information.

### Required sections

```markdown
# Project Setup

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | How to Get |
|----------|-------------|------------|
| [var] | [description] | [instructions] |

## OAuth Setup (if applicable)

### [Provider] OAuth
1. [Step-by-step instructions]
2. Add authorized redirect URI: `{APP_URL}/api/auth/callback/[provider]`
3. Copy credentials to `.env`

## Installation

\```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm dev
\```

## Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| [Feature] | ✅ Working | - |
| [Feature] | 🚧 In Progress | [Notes] |
| [Feature] | ⏳ Planned | [Notes] |

## Known Issues

- [Any known issues or limitations]
```

### Gather information automatically

1. **Environment variables**: Read `.env.example` or `.env` to list required variables
2. **OAuth providers**: Check auth config for configured social providers
3. **Feature status**: Review recent commits and implementation status
4. **Known issues**: Pull from CLAUDE.md known issues section

---

## Step 9: Creator Feedback

Automatically generate useful feedback for the master agent based on this session's work.

### Analyze the session for feedback

Review the session and identify:

**Skills Gaps**
- What information was missing from skills docs that you had to figure out?
- What errors or outdated info did you encounter?
- What patterns did you implement that should be documented?

**Setup Issues**
- What configuration was missing or unclear?
- What gotchas did you hit during development?
- What should be pre-configured in future setups?

**New Patterns**
- What reusable code patterns were created?
- What commands or workflows should be standardized?
- What UI components or utilities could be shared?

**Technical Gotchas**
- What library issues were discovered?
- What config settings were required but not documented?
- What error messages led to non-obvious solutions?

### Generate and display feedback

Create structured feedback and display it for easy copy-paste:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATOR FEEDBACK - Copy to Squared-Agent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Feedback from [Project Name] - YYYY-MM-DD

### Skills Gaps
- [Specific missing info that would have helped]
- [Patterns worth adding to skills docs]

### Setup Issues
- [Config that should be pre-configured]
- [Gotchas to document for future projects]

### New Patterns
- [Reusable patterns created this session]
- [Code worth extracting to templates]

### Technical Gotchas
- [Library issues and solutions]
- [Config requirements discovered]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Save feedback locally

Also save to `docs/creator-feedback.md` for reference.

**Important:** Only include feedback if there's something meaningful to report. If the session was routine with no issues or discoveries, skip this step.

---

## Step 10: Summary Output

Show the user what was done and what will be committed:

```
## Session Summary

### Changes Made
- [List of significant changes]

### Documentation Updated
- [List of files updated]

### Lessons Captured
- [Key insights from this session]

### Ready to Commit
- [List of files that will be committed]

### Suggested Follow-ups
- [Any tasks for next session]
```

---

## Step 11: Commit with Approval

This is the final step. The user signs off on the commit message.

### Check for uncommitted changes
```bash
git status
git diff --stat
```

### If no changes exist
Inform the user: "All changes already committed. Nothing to do."

### If changes exist

1. **Draft a commit message** summarizing the session's work
2. **Show the message clearly** as a code block BEFORE asking:

```
Commit message:
───────────────────────────────────────────────────────────────

[full commit message here]

───────────────────────────────────────────────────────────────
```

3. **Ask for approval** using AskUserQuestion:
   - **Commit** - Stage all and commit with this message
   - **Edit message** - Change the commit message
   - **Skip** - Don't commit (user will handle manually)

### Commit message format
```
Session-end: [brief summary of session work]

[Detailed bullet points of what was done]

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Once approved

1. Stage all changes:
```bash
git add -A
```

2. Commit:
```bash
git commit -m "$(cat <<'EOF'
[approved commit message]

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

3. Confirm:
```
Committed: [hash] [first line of message]

To push: git push
```

**Important:** Do NOT push. The user will push when ready.

---

## Execution Instructions

1. **Read recent git history** to understand session scope
2. **Read README.md** and check if user-facing docs need updates
3. **Make updates** to README.md if commands, workflows, or setup changed
4. **Read CLAUDE.md** and identify needed updates
5. **Make updates** to CLAUDE.md (implementation status, recent changes, known issues)
6. **Check agents/skills** for any that need updates based on session work
7. **Create/update docs/LEARNINGS.md** with session insights
8. **Save session log** to `.project/sessions/YYYY-MM-DD.md` (local archive)
9. **Generate/update SETUP.md** with env vars, OAuth setup, feature status, known issues
10. **Generate creator feedback** - analyze session for gaps/issues/patterns, display for user to copy
11. **Output summary** of what was done and what will be committed
12. **Get user approval** and commit (do NOT push)

Be thorough but concise. Focus on changes that will help future sessions understand the current state of the project.

**The commit is the final sign-off.** Everything is updated and ready before the user approves.

---

## Starting Now

Begin the session-end process by gathering context about what was done this session.
```

---

### 2. Helper Command: `.claude/commands/commit.md`

A standalone commit command for when you just want to commit without the full session-end workflow:

```markdown
---
description: Draft a commit message, get approval, then commit changes
---

# Commit - Draft and Commit Changes

---

## Step 1: Gather Information

Run these commands in parallel:

```bash
git status
```

```bash
git diff
```

```bash
git diff --staged
```

```bash
git log --oneline -5
```

If there are no changes (nothing staged or unstaged), inform the user:
```
No changes to commit.
```

---

## Step 2: Draft Commit Message

Analyze all changes (staged + unstaged) and draft a commit message:

1. **First line**: Concise summary (50 chars or less ideally)
   - Use imperative mood ("Add feature" not "Added feature")
   - Capitalize first letter
   - No period at end

2. **Body** (if needed): Explain the "why" not the "what"

3. **Match the repo's style** based on recent commits

---

## Step 3: Show Message and Get Approval

**IMPORTANT:** Show the commit message FIRST as a code block, THEN ask for approval.

### 3a. Display the commit message clearly

```
Commit message:
───────────────────────────────────────────────────────────────

[full commit message here, including body and co-author line]

───────────────────────────────────────────────────────────────

Files to commit:
- [file1] - [brief description]
- [file2] - [brief description]
```

### 3b. Ask for approval

AFTER showing the message, use AskUserQuestion with options:
- **Commit** - Stage all and commit with this message
- **Edit message** - Change the commit message
- **Cancel** - Don't commit

If user chooses to edit, ask what changes they want, revise, and show the new message again before asking.

---

## Step 4: Commit

Once approved:

1. Stage all changes:
```bash
git add -A
```

2. Commit with the approved message:
```bash
git commit -m "$(cat <<'EOF'
[approved commit message]

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

3. Verify:
```bash
git log --oneline -1
```

---

## Step 5: Report Success

```
Committed: [hash] [message]

To push: git push
```

---

## Notes

- Never commit files that look like secrets (.env, credentials, API keys)
- If pre-commit hooks fail, show the error and offer to fix
- Never use --no-verify unless explicitly requested
```

---

### 3. Learnings File: `docs/LEARNINGS.md`

Create this in your project's docs folder:

```markdown
# Project Name - Learnings

Insights and lessons captured from coding sessions to improve future development.

---

## Session Log

### YYYY-MM-DD: Session Title

**What Was Done**
- [List of changes made]

**What Worked Well**
- [Patterns that proved effective]
- [Tools/approaches that saved time]

**What Didn't Work**
- [Approaches that failed or were abandoned]
- [Antipatterns discovered]

**Technical Insights**
- [Library quirks or gotchas]
- [Performance observations]

---

## Patterns That Work

### Documentation Structure
- `CLAUDE.md` as single source of truth for project state
- Command files (`.claude/commands/*.md`) are self-documenting
- Recent Changes section at top of CLAUDE.md for quick context

### Workflow Design
- [Your effective patterns]

### Testing Strategy
- [Your testing patterns]

---

## Antipatterns to Avoid

### Documentation
- Don't let CLAUDE.md get stale - update it as you work
- Don't document features before they're working

### Code Generation
- [Your antipatterns]

---

## Technical Gotchas

- [Library-specific issues]
- [Platform-specific issues]

---

## Ideas for Future Sessions

- [ ] [Future work item 1]
- [ ] [Future work item 2]
```

---

## Setup Requirements

### 1. Gitignore the session logs

Add to `.gitignore`:

```
# Session logs (local archive)
.project/sessions/
```

### 2. Create required directories

```bash
mkdir -p .project/sessions
mkdir -p docs
```

### 3. Ensure CLAUDE.md exists

Your project should have a `CLAUDE.md` file with at minimum:
- Implementation Status table
- Recent Changes section
- Known Issues section

---

## Key Design Patterns

### Commit as Final Step

The user signs off on the commit AFTER all documentation is updated:

1. Do all documentation updates
2. Save session log locally
3. Show summary of what will be committed
4. Ask for approval using AskUserQuestion
5. Only then run `git add -A && git commit`

This ensures the user reviews everything before the final commit.

### Session Log Archive

Session logs are saved locally but not committed to git:
- Location: `.project/sessions/YYYY-MM-DD.md`
- Multiple sessions same day: append with timestamp separator
- Purpose: local archive for reference without cluttering git history

### Commit Message Format

```
Session-end: [brief summary]

- [bullet point 1]
- [bullet point 2]
- [bullet point 3]

Co-Authored-By: Claude <noreply@anthropic.com>
```

Using HEREDOC ensures proper multi-line formatting:

```bash
git commit -m "$(cat <<'EOF'
Session-end: Add user authentication

- Implemented JWT token generation
- Added login/logout endpoints
- Created user session middleware

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

---

## Customization Points

When adapting for your project, modify these:

| Element | Default | Your Project |
|---------|---------|--------------|
| Session log path | `.project/sessions/` | Your preferred location |
| Co-author email | `noreply@anthropic.com` | Your preference |
| Privacy rules | None | Add project-specific rules |
| Status table format | Basic | Match your CLAUDE.md structure |

---

## Usage

```bash
/session-end
```

The command will:
1. Analyze what you did this session
2. Update documentation as needed
3. Capture lessons learned
4. Show you a summary
5. Ask for commit approval
6. Commit (but not push)

You push when ready: `git push`
