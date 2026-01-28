# Clean-Branches Command - Implementation Guide

A Claude Code command for removing merged or stale feature branches to keep repositories tidy.

---

## Overview

The `/clean-branches` command handles branch maintenance. It finds branches that have been merged or whose remote tracking is gone, previews them, and safely deletes selected branches.

### What It Does

| Step | Action |
|------|--------|
| 1 | Verifies branch state (recommends main) |
| 2 | Fetches and prunes remote refs |
| 3 | Finds merged and gone branches |
| 4 | Displays categorized preview |
| 5 | Gets approval for deletion |
| 6 | Deletes selected branches |
| 7 | Offers remote cleanup |

---

## Files to Create

### Main Command: `.claude/commands/clean-branches.md`

```markdown
---
name: clean-branches
description: Remove merged or stale feature branches
allowed-tools: Bash, AskUserQuestion
---

# Clean Branches - Branch Maintenance

Remove local branches that have been merged or whose remote tracking branches are gone.

---

## Step 1: Verify Branch State

\```bash
git branch --show-current
\```

Recommend being on `main` or `master` for cleanup operations. If on a feature branch, warn:

\```
You're on [branch-name] — cleanup is safest from main.

Options:
1. Switch to main and continue
2. Clean from here anyway (current branch will be excluded)
\```

Ask using AskUserQuestion and proceed based on choice.

---

## Step 2: Fetch and Prune

Sync with remote and remove stale tracking refs:

\```bash
git fetch --prune
\```

---

## Step 3: Find Stale Branches

### Merged branches

Branches that have been merged into the current branch:

\```bash
git branch --merged | grep -v "^\*" | grep -Ev "^\s*(main|master|develop|release)" | sed 's/^[[:space:]]*//'
\```

### Gone branches

Branches whose remote tracking branch was deleted:

\```bash
git branch -vv | grep ': gone]' | awk '{print $1}' | grep -Ev "^(main|master|develop|release)"
\```

### Active worktree branches

Get branches with active worktrees (cannot be deleted):

\```bash
git worktree list --porcelain | grep "^branch" | sed 's/branch refs\/heads\///'
\```

---

## Step 4: Categorize and Display

Combine results, excluding:
- Protected branches: `main`, `master`, `develop`, `release/*`
- Current branch
- Branches with active worktrees

Display:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch Cleanup Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Merged branches ([count]):
  • feature/add-login
  • feature/fix-header

Gone branches ([count]):
  • feature/old-experiment
  • bugfix/stale-fix

Protected (skipped): main, develop
Worktrees (skipped): feature/in-progress

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

If no branches to clean:

\```
✓ No stale branches found. Your repository is clean!
\```

Stop execution.

---

## Step 5: Get Approval

Ask using AskUserQuestion:

- **Delete all** — Remove all [count] stale branches
- **Merged only** — Remove only merged branches ([count])
- **Select individually** — Choose which to delete
- **Cancel** — Keep all branches

If "Select individually", show each branch and ask Yes/No.

---

## Step 6: Execute Cleanup

Delete selected local branches:

\```bash
git branch -d [branch-name]
\```

If a branch can't be deleted with `-d` (not fully merged), inform the user:

\```
Branch [branch-name] is not fully merged.

Options:
1. Force delete with -D (lose unmerged commits)
2. Skip this branch
\```

---

## Step 7: Offer Remote Cleanup

After local cleanup, offer to delete remote branches too:

\```
Deleted [count] local branches.

Also delete these from remote origin?
\```

List the branches and ask using AskUserQuestion:

- **Yes, delete remote branches** — Clean up remote too
- **No, keep remote branches** — Local only

If yes:

\```bash
git push origin --delete [branch-name]
\```

---

## Step 8: Confirm

Display summary:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Cleanup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deleted locally:
  • feature/add-login
  • feature/fix-header

Deleted from remote:
  • feature/add-login

Skipped:
  • feature/in-progress (active worktree)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Safety Rules

**Never delete:**
- Protected branches: `main`, `master`, `develop`, `release/*`
- The current branch
- Branches with active worktrees

**Always:**
- Show preview before any deletion
- Require explicit approval
- Use `-d` (safe delete) before `-D` (force delete)
- Warn before force-deleting unmerged branches

---

## Notes

- Run periodically to keep your repository tidy
- Safe to run after `/complete-feature` has merged several branches
- Pairs well with `/end-session` for a clean finish
```

---

## Branch Categories

### Merged Branches

Branches where all commits are already in the current branch:

```bash
# List merged branches (excluding protected)
git branch --merged | grep -v "^\*" | grep -Ev "^\s*(main|master|develop|release)"
```

These are safe to delete — their work is preserved in the target branch.

### Gone Branches

Branches whose upstream tracking branch was deleted (often after PR merge):

```bash
# List branches with gone upstream
git branch -vv | grep ': gone]' | awk '{print $1}'
```

These indicate branches where remote cleanup already happened.

### Protected Branches

Never delete these regardless of status:

| Pattern | Description |
|---------|-------------|
| `main` | Primary branch |
| `master` | Legacy primary |
| `develop` | Integration branch |
| `release/*` | Release branches |

---

## Safety Mechanisms

### Worktree Detection

Branches with active worktrees cannot be deleted:

```bash
# Get worktree branches
git worktree list --porcelain | grep "^branch" | sed 's/branch refs\/heads\///'
```

If user tries to delete a worktree branch:

```
Branch [name] has an active worktree at ../worktrees/[name].
Remove the worktree first: git worktree remove ../worktrees/[name]
```

### Force Delete Warning

When `-d` fails (branch not fully merged):

```
Branch [name] contains commits not in [current-branch]:
  a1b2c3d Unmerged commit message

These commits will be lost if you force delete.
```

Only force delete with explicit confirmation.

---

## Output Examples

### Clean Repository

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch Cleanup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ No stale branches found. Your repository is clean!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Branches Found

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Branch Cleanup Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Merged branches (3):
  • feature/add-dark-mode
  • feature/update-footer
  • fix/typo-in-readme

Gone branches (2):
  • feature/old-experiment
  • bugfix/issue-42

Protected (skipped): main, develop
Current branch (skipped): feature/in-progress

Total: 5 branches can be cleaned

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Cleanup Complete

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Cleanup Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deleted locally (5):
  • feature/add-dark-mode
  • feature/update-footer
  • fix/typo-in-readme
  • feature/old-experiment
  • bugfix/issue-42

Deleted from remote (3):
  • feature/add-dark-mode
  • feature/update-footer
  • fix/typo-in-readme

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Integration with Workflow

### After `/complete-feature`

Run cleanup after merging several features:

```
/complete-feature  # Merge feature A
/complete-feature  # Merge feature B
/clean-branches    # Clean up both
```

### At `/end-session`

Consider suggesting cleanup if stale branches detected:

```
Session wrap-up complete.

Note: You have 3 stale branches. Run /clean-branches to tidy up.
```

### Periodic Maintenance

Run weekly or monthly to keep repository clean:

```
/clean-branches  # Quick maintenance
```

---

## Troubleshooting

### Branch Won't Delete

If a branch refuses to delete:

1. **Check if current branch**: Can't delete branch you're on
2. **Check for worktree**: Remove worktree first
3. **Check if protected**: Protected branches are never deleted
4. **Not fully merged**: User must confirm force delete

### Remote Delete Fails

Common causes:
- Branch already deleted on remote
- No push permissions
- Branch is protected on remote

```
Failed to delete remote branch [name].
This might mean it was already deleted or you don't have permission.
```

### Fetch Fails

If `git fetch --prune` fails:
- Check internet connection
- Verify remote is configured: `git remote -v`
- Check authentication: `gh auth status`
