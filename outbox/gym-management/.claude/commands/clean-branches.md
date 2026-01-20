---
name: clean-branches
description: Remove merged or stale feature branches
allowed-tools: Bash, AskUserQuestion
---

# Clean Branches - Branch Maintenance

Remove local branches that have been merged or whose remote tracking branches are gone.

---

## Step 1: Verify Branch State

```bash
git branch --show-current
```

Recommend being on `main` or `master` for cleanup operations. If on a feature branch, warn:

```
You're on [branch-name] — cleanup is safest from main.

Options:
1. Switch to main and continue
2. Clean from here anyway (current branch will be excluded)
```

Ask using AskUserQuestion and proceed based on choice.

---

## Step 2: Fetch and Prune

Sync with remote and remove stale tracking refs:

```bash
git fetch --prune
```

---

## Step 3: Find Stale Branches

### Merged branches

Branches that have been merged into the current branch:

```bash
git branch --merged | grep -v "^\*" | grep -Ev "^\s*(main|master|develop|release)" | sed 's/^[[:space:]]*//'
```

### Gone branches

Branches whose remote tracking branch was deleted:

```bash
git branch -vv | grep ': gone]' | awk '{print $1}' | grep -Ev "^(main|master|develop|release)"
```

### Active worktree branches

Get branches with active worktrees (cannot be deleted):

```bash
git worktree list --porcelain | grep "^branch" | sed 's/branch refs\/heads\///'
```

---

## Step 4: Categorize and Display

Combine results, excluding:
- Protected branches: `main`, `master`, `develop`, `release/*`
- Current branch
- Branches with active worktrees

Display:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧹 Branch Cleanup Preview
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
```

If no branches to clean:

```
✓ No stale branches found. Your repository is clean!
```

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

```bash
git branch -d [branch-name]
```

If a branch can't be deleted with `-d` (not fully merged), inform the user:

```
Branch [branch-name] is not fully merged.

Options:
1. Force delete with -D (lose unmerged commits)
2. Skip this branch
```

---

## Step 7: Offer Remote Cleanup

After local cleanup, offer to delete remote branches too:

```
Deleted [count] local branches.

Also delete these from remote origin?
```

List the branches and ask using AskUserQuestion:

- **Yes, delete remote branches** — Clean up remote too
- **No, keep remote branches** — Local only

If yes:

```bash
git push origin --delete [branch-name]
```

---

## Step 8: Confirm

Display summary:

```
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
```

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
