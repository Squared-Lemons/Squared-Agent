# Developer Workflow Setup Instructions

Set up this project with the standard developer workflow.

---

## Step 1: Initialize Git

If not already a git repo:
```bash
git init
```

Ensure `.claude/` will be committed to git.

---

## Step 2: Configure Claude Code

Create `.claude/settings.json` with plugins, permissions, and hooks:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build:*)",
      "Bash(npm run test:*)",
      "Bash(npm run lint:*)",
      "Bash(npm run format:*)",
      "Bash(npm run typecheck:*)",
      "Bash(pnpm build:*)",
      "Bash(pnpm test:*)",
      "Bash(pnpm lint:*)",
      "Bash(pnpm format:*)",
      "Bash(pnpm typecheck:*)",
      "Bash(bun run build:*)",
      "Bash(bun run test:*)",
      "Bash(bun run lint:*)",
      "Bash(bun run format:*)",
      "Bash(bun run typecheck:*)"
    ],
    "deny": []
  },
  "enabledPlugins": {
    "ralph-loop@claude-plugins-official": true,
    "feature-dev@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true,
    "code-simplifier@claude-plugins-official": true,
    "playwright@claude-plugins-official": true,
    "context7@claude-plugins-official": true
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run format --silent 2>/dev/null || pnpm format --silent 2>/dev/null || bun run format 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

### What this configures:

**Permissions** - Pre-allow common safe commands so Claude won't ask for permission every time:
- Build, test, lint, format, typecheck commands
- Supports npm, pnpm, and bun

**Hooks** - Auto-format code after Claude writes/edits files:
- Runs your project's formatter after every file change
- Falls back gracefully if no formatter configured

---

## Step 3: Create Commands

Read the command documentation files and create the corresponding commands in `.claude/commands/`.

### Core Session Commands

| Documentation | Creates | Purpose |
|--------------|---------|---------|
| `Start-Session-Command.md` | `/start-session` | Begin session with branch safety check |
| `END-SESSION-COMMAND.md` | `/end-session`, `/commit` | End session, update docs, commit |
| `Summary-Command.md` | `/summary` | Generate accomplishments report |

### Feature Development Commands

| Documentation | Creates | Purpose |
|--------------|---------|---------|
| `New-Feature-Command.md` | `/new-feature` | Create feature branch for safe development |
| `Complete-Feature-Command.md` | `/complete-feature` | Merge or create PR when done |
| `Clean-Branches-Command.md` | `/clean-branches` | Remove merged or stale branches |

### Environment Commands

| Documentation | Creates | Purpose |
|--------------|---------|---------|
| `Local-Env-Command.md` | `/local-env` | Manage local domains and trusted HTTPS |

### Feedback Commands

| Documentation | Creates | Purpose |
|--------------|---------|---------|
| `Creator-Feedback-Command.md` | `/creator-feedback` | Generate feedback to send to master agent |

For each documentation file:
1. Read the implementation guide
2. Create the command in `.claude/commands/` following the guide
3. Test that the command works

---

## Step 4: Create Custom Agents (Optional)

Custom agents automate common workflows. Create `.claude/agents/` folder with agent definitions:

```bash
mkdir -p .claude/agents
```

### Recommended Agents

**build-validator.md** - Validates code compiles and passes checks:
```markdown
Validate the build after changes:
1. Run typecheck
2. Run linter
3. Run tests
4. Report any failures with file:line references
```

**code-reviewer.md** - Reviews code for issues:
```markdown
Review the recent changes for:
- Logic errors or bugs
- Security vulnerabilities
- Performance issues
- Code style violations
Report issues with confidence levels (high/medium/low).
```

**verify-app.md** - End-to-end verification:
```markdown
Verify the application works:
1. Start the dev server
2. Check key pages load without errors
3. Test core user flows
4. Report any issues found
```

Agents are invoked via the Task tool and provide specialized workflows that can run in the background.

---

## Step 5: Create Supporting Files

### Directory Structure
```bash
mkdir -p .claude/commands
mkdir -p .claude/agents
mkdir -p .project/sessions
mkdir -p inbox/updates
mkdir -p outbox
```

### Environment File
If a `.env.example` template was provided, copy it to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in the required values:
- `BETTER_AUTH_SECRET` - Generate with `openssl rand -base64 32`
- OAuth credentials if using Google/GitHub login
- Adjust `DATABASE_URL` if using a different database location

### Gitignore
Add to `.gitignore`:
```
# Local data (personal to each user)
.project/
.claude/settings.local.json
```

### Token Usage File
Create `.project/token-usage.md` for tracking session costs:

```markdown
# Token Usage History

Raw token data. Costs calculated at report time.

## Subscription Limits

| Limit | Value | Notes |
|-------|-------|-------|
| Daily limit | | Your plan's daily token limit |
| Hourly limit | | Your plan's hourly token limit |

## Session Log

| Date | Type | Input | Output | Cache Read | Cache Create | Turns |
|------|------|-------|--------|------------|--------------|-------|
```

This file is populated automatically by `/end-session` and aggregated by `/summary`.

### CLAUDE.md
Create or update `CLAUDE.md` in project root to document the available commands.

### LEARNINGS.md
Create `LEARNINGS.md` in project root for capturing session insights.

---

## Step 6: Organize Documentation

Move setup files into `docs/` folder to keep the project root clean. Only `CLAUDE.md` and `README.md` should remain at root.

```bash
mkdir -p docs/commands docs/knowledge
```

### Move these files to docs/

| From | To |
|------|-----|
| `SETUP.md` | `docs/SETUP.md` |
| `SETUP-INSTRUCTIONS.md` | `docs/SETUP-INSTRUCTIONS.md` |
| `LEARNINGS.md` | `docs/LEARNINGS.md` |
| `commands/*.md` | `docs/commands/` |
| `knowledge/*.md` | `docs/knowledge/` |

```bash
# Move setup files (if they exist)
mv SETUP.md docs/ 2>/dev/null || true
mv SETUP-INSTRUCTIONS.md docs/ 2>/dev/null || true
mv LEARNINGS.md docs/ 2>/dev/null || true

# Move command guides (not .claude/commands/)
mv commands/*.md docs/commands/ 2>/dev/null || true
rmdir commands 2>/dev/null || true

# Move knowledge
mv knowledge/*.md docs/knowledge/ 2>/dev/null || true
rmdir knowledge 2>/dev/null || true
```

### Keep at root
- `CLAUDE.md` - Required by Claude Code
- `README.md` - User-facing documentation

---

## Step 7: Commit

```bash
git add .
git commit -m "Setup developer workflow with Claude Code

- Configured plugins, permissions, and hooks
- Created commands: end-session, commit, new-feature
- Created custom agents (optional)
- Organized documentation into docs/

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Verification

After setup, these commands should be available:
- `/start-session` - Begin session with branch awareness and context loading
- `/new-feature` - Create feature branch for safe development
- `/complete-feature` - Wrap up feature branch with merge or PR
- `/clean-branches` - Remove merged or stale feature branches
- `/end-session` - End session, update docs, capture token usage, commit
- `/commit` - Quick commit with approval
- `/summary` - Generate accomplishments report
- `/local-env` - Manage local domains and trusted HTTPS
- `/creator-feedback` - Generate feedback to send to master agent
- `/cancel-ralph` - Stop a running Ralph Loop (from plugin)

Token tracking is automatic — `/end-session` captures usage data, `/summary` calculates costs

---

## Step 8: Project Exploration (Optional)

**Ask the user:** "Would you like me to explore the codebase and document its structure?"

If yes, read and execute the task file in `docs/` if one was included.

---

## Setup Complete

Tell the user:
> "Setup is complete! Please restart Claude to load the new configuration. Documentation has been organized into `docs/`."

---

## Working with Claude Code - Best Practices

### Start in Plan Mode

**Most sessions should start in Plan Mode** (press `shift+tab` twice to cycle modes).

When tackling a new feature or complex task:
1. Enter Plan Mode first
2. Describe what you want to build
3. Iterate on the plan until you're happy with it
4. Switch to auto-accept edits mode
5. Claude can often 1-shot the implementation after a good plan

A good plan dramatically increases the quality of the final result.

### Give Claude Verification

**The most important tip:** Give Claude a way to verify its work.

When Claude can run tests, check types, or validate the build after making changes, the quality of the output improves 2-3x. Always:

- Have a test command Claude can run
- Have a typecheck command
- Have a lint command
- Let Claude verify its own work before declaring "done"

The pre-configured permissions in `.claude/settings.json` allow Claude to run these verification commands without asking permission each time.

### CLAUDE.md as Living Document

Treat `CLAUDE.md` as a living document that grows with your project:

- When Claude does something incorrectly, add a rule to prevent it
- When you discover a pattern that works well, document it
- When you hit a gotcha, add it so Claude remembers next time

The more specific guidance in CLAUDE.md, the better Claude performs on your project.
