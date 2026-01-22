---
description: Draft a commit message, get approval, then commit changes
---

# Commit - Draft and Commit Changes

## Step 1: Pre-flight Secret Check

Check for sensitive files before committing:

```bash
git status --porcelain | grep -E "\.env|credentials|secret|\.pem|\.key" || echo "NO_SECRETS"
```

If sensitive files detected, warn user and confirm before proceeding.

## Step 2: Invoke Commit Skill

Invoke the `commit-commands:commit` skill to handle the git commit workflow.

The skill will:
- Gather git status, diff, and recent commits
- Draft an appropriate commit message
- Show the message and get user approval
- Execute the commit with Co-Authored-By line

## Notes

- Never commit files that look like secrets
- If pre-commit hooks fail, show error and offer to fix
- Never use --no-verify unless explicitly requested
