# Complete-Feature Command - Implementation Guide

A Claude Code command for wrapping up feature branches by merging to main or creating a pull request.

---

## Overview

The `/complete-feature` command handles the completion of a feature branch. It reviews changes, suggests commit cleanup, and offers two paths: direct merge (solo workflow) or pull request (team workflow).

### What It Does

| Step | Action |
|------|--------|
| 1 | Verifies on a feature branch |
| 2 | Reviews all changes (commits, diff) |
| 3 | Suggests squashing if many commits |
| 4 | Asks: merge directly or create PR? |
| 5 | Executes chosen workflow |
| 6 | Offers cleanup (delete branch/worktree) |

---

## Files to Create

### Main Command: `.claude/commands/complete-feature.md`

```markdown
---
description: Wrap up feature branch - merge or create PR
allowed-tools: Bash, AskUserQuestion
---

# Complete Feature - Merge or PR

Wrap up the current feature branch by merging to main or creating a pull request.

---

## Step 1: Verify Feature Branch

\```bash
git branch --show-current
\```

If on a protected branch (main, master, develop, release/*):

\```
You're on [branch], not a feature branch.
This command is for completing feature branches.

To start a feature: /new-feature "description"
\```

Stop execution.

---

## Step 2: Review Changes

### Get branch info

\```bash
# Base branch (usually main)
git merge-base HEAD main

# All commits on this branch
git log main..HEAD --oneline

# Summary of changes
git diff main..HEAD --stat
\```

### Display summary

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature Branch Review: [branch-name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commits: [count]
[commit list]

Files changed: [count]
[file summary]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Step 3: Suggest Squashing (if needed)

If more than 5 commits, suggest squashing:

\```
This branch has [count] commits. Consider squashing into fewer commits
for a cleaner history.

Options:
1. Squash into single commit (recommended)
2. Keep all commits as-is
3. Interactive rebase (you handle manually)
\```

### If squashing

\```bash
# Reset to merge-base, keeping changes staged
git reset --soft $(git merge-base HEAD main)
git commit -m "[suggested message]"
\```

---

## Step 4: Ask Completion Method

\```
How would you like to complete this feature?

1. **Merge to main** (solo workflow)
   - Merges branch directly to main
   - Deletes feature branch after
   - Best for: solo projects, small teams

2. **Create Pull Request** (team workflow)
   - Pushes branch to remote
   - Creates PR via GitHub CLI
   - Best for: code review, collaboration
\```

---

## Step 5: Execute Workflow

### Option A: Merge to Main

\```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Merge with no-ff to preserve branch history
git merge --no-ff feature/[name] -m "Merge feature/[name]: [summary]"

# Delete the feature branch
git branch -d feature/[name]
\```

Output:
\```
✓ Merged feature/[name] to main
✓ Deleted feature branch

To push: git push origin main
\```

### Option B: Create Pull Request

\```bash
# Push branch to remote
git push -u origin feature/[name]

# Create PR using GitHub CLI
gh pr create --title "[title]" --body "[body]"
\```

Output:
\```
✓ Pushed feature/[name] to origin
✓ Created PR: [url]

Next steps:
- Review the PR
- Request reviewers
- Merge when approved
\```

---

## Step 6: Cleanup (for worktrees)

If this was a worktree, offer cleanup:

\```bash
# Check if in a worktree
git worktree list
\```

If worktree:
\```
This branch was created as a worktree.
Would you like to remove the worktree directory?

1. Yes, remove worktree
2. No, keep it
\```

If yes:
\```bash
git worktree remove ../worktrees/[name]
\```

---

## Execution Instructions

1. Verify on feature branch (not main/master/develop)
2. Review all commits and changes since branching
3. If many commits, suggest squashing
4. Ask: merge directly or create PR
5. Execute chosen workflow
6. Offer worktree cleanup if applicable
7. Provide next steps
```

---

## Branch Verification

### Protected Branch Detection

```bash
BRANCH=$(git branch --show-current)

case "$BRANCH" in
  main|master|develop)
    echo "Protected branch"
    exit 1
    ;;
  release/*)
    echo "Protected branch"
    exit 1
    ;;
  *)
    echo "Feature branch - OK"
    ;;
esac
```

### Feature Branch Patterns

Recognized feature branch patterns:
- `feature/*`
- `feat/*`
- `fix/*`
- `bugfix/*`
- `hotfix/*`
- `[username]/*`
- Any branch not in protected list

---

## Squashing Commits

### When to Suggest

Suggest squashing when:
- More than 5 commits on the branch
- Many "WIP" or "fix" commits
- History would be cleaner consolidated

### Squash Process

```bash
# Get the merge base (where branch diverged)
BASE=$(git merge-base HEAD main)

# Soft reset to base (keeps all changes staged)
git reset --soft $BASE

# Create single commit with all changes
git commit -m "Add user authentication

- Implement login/logout endpoints
- Add JWT token generation
- Create session middleware
- Add tests for auth flow"
```

### Commit Message for Squash

Generate a good commit message by:
1. Reading all commit messages
2. Summarizing the feature
3. Listing key changes as bullet points

---

## Merge vs Pull Request

### When to Use Merge

- Solo projects
- Small teams with trust
- Quick fixes
- No code review required

### When to Use PR

- Team collaboration
- Code review required
- CI/CD checks needed
- Documentation of changes

### PR Body Template

```markdown
## Summary
[1-3 bullet points describing the feature]

## Changes
- [List of significant changes]

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] No regressions found

## Screenshots (if applicable)
[Add screenshots for UI changes]
```

---

## Output Examples

### Feature Branch Review

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Feature Branch Review: feature/add-user-authentication
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Commits: 3
a1b2c3d Add login endpoint
d4e5f6g Add JWT token generation
h7i8j9k Add session middleware

Files changed: 8
 apps/web/app/api/auth/login/route.ts   | 45 ++++++
 apps/web/app/api/auth/logout/route.ts  | 23 +++
 packages/auth/src/jwt.ts               | 67 +++++++++
 packages/auth/src/middleware.ts        | 34 +++++
 ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### After Merge

```
✓ Merged feature/add-user-authentication to main
✓ Deleted feature branch

To push: git push origin main
```

### After PR Creation

```
✓ Pushed feature/add-user-authentication to origin
✓ Created PR: https://github.com/user/repo/pull/42

Next steps:
- Review the PR at the link above
- Request reviewers if needed
- Merge when approved
```

---

## Error Handling

### Uncommitted Changes

```
⚠️  You have uncommitted changes.

Please commit or stash them before completing the feature:
- /commit to commit changes
- git stash to stash for later
```

### Merge Conflicts

```
⚠️  Merge conflict detected.

Files with conflicts:
- apps/web/app/page.tsx
- packages/ui/src/button.tsx

Options:
1. Resolve conflicts manually, then run /complete-feature again
2. Abort merge: git merge --abort
```

### GitHub CLI Not Installed

```
⚠️  GitHub CLI (gh) not found.

To create PRs automatically:
1. Install: brew install gh
2. Authenticate: gh auth login

Or create the PR manually:
- Push: git push -u origin feature/[name]
- Open: https://github.com/[user]/[repo]/compare/feature/[name]
```

---

## Customization Points

### Default Merge Target

Default: `main`

Customize for projects using different trunk branches:
- `master` - Legacy projects
- `develop` - GitFlow projects
- `trunk` - Some CI/CD setups

### PR Template

Customize the PR body template for your project's needs:
- Add checklist items
- Include issue references
- Add deployment notes

### Squash Threshold

Default: 5 commits

Adjust based on team preference:
- Lower (3) for very clean history
- Higher (10) for detailed commit history
- Never for projects that want all commits
