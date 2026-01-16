# Commands

Detailed documentation for all available commands in Squared Agent.

---

## /new-idea

A consultative conversation to design your project and generate a comprehensive package.

### What it does

This is a **conversation**, not a form. Claude:
1. Asks about your idea and explores requirements
2. Helps you think through platform and technology choices
3. Discusses authentication, data, UI/UX, integrations
4. Recommends knowledge and commands based on your needs
5. Generates a complete project package with full context

### Usage

```
/new-idea
```

Or with files:

```
/new-idea /path/to/designs
```

### Flow

```
Conversation about your idea
    ↓
Discuss requirements & platform
    ↓
Make technical decisions together
    ↓
Recommendations (knowledge, commands)
    ↓
Generate package
    ↓
Copy to new folder
    ↓
Target agent builds v1
```

### Output

A folder containing:
- `PROJECT-BRIEF.md` - Full project context from conversation
- `TECHNICAL-DECISIONS.md` - Technology choices with rationale
- `SETUP.md` - Instructions for target agent
- `knowledge/` - Platform-specific guidance
- `commands/` - Workflow guides
- `provided-files/` - Any files you provided

### When to use

- You have an idea but haven't decided on specifics
- You want help thinking through requirements
- You want the target agent to understand WHY decisions were made
- You have existing files (designs, specs) to include

---

## /prepare-setup

Create a generic setup package for a new project.

### What it does

1. Asks which setup profile to use
2. Asks which setup files to include
3. Asks which command guides to include
4. Asks which tasks to run after setup
5. Asks which knowledge to include
6. Creates a setup package with SETUP.md guide
7. Opens the folder for you to copy

### Usage

```
/prepare-setup
```

Or with arguments:

```
/prepare-setup --profile developer --commands all --knowledge all
```

### Arguments

| Argument | Description |
|----------|-------------|
| `--profile <name>` | Skip profile selection |
| `--setup <files>` | Skip setup files selection (comma-separated or "all") |
| `--commands <files>` | Skip commands selection (comma-separated, "all", or "none") |
| `--tasks <files>` | Skip tasks selection (comma-separated, "all", or "none") |
| `--knowledge <files>` | Skip knowledge selection (comma-separated, "all", or "none") |

### Output

A folder containing:
- `SETUP.md` - Step-by-step setup guide
- `SETUP-INSTRUCTIONS.md` - Detailed setup instructions
- `commands/` - Selected command guides
- `knowledge/` - Selected knowledge docs

### When to use

- Setting up a new project without a specific idea yet
- You want full control over what gets included
- You're creating a setup for someone else

---

## /end-session

End a coding session by updating documentation, capturing learnings, and committing changes.

### What it does

1. Reviews git history to understand session scope
2. Updates README.md if needed
3. Updates CLAUDE.md with recent changes
4. Updates LEARNINGS.md with session insights
5. Saves session log to `.project/sessions/`
6. Generates/updates SETUP.md handoff document
7. Generates creator feedback (if applicable)
8. Shows summary of all changes
9. Commits with your approval

### Usage

```
/end-session
```

### Commit approval

After reviewing changes, you'll be asked:
- **Commit** - Stage all and commit
- **Edit message** - Change the commit message
- **Skip** - Don't commit (handle manually)

### When to use

- End of a coding session
- Before switching to a different task
- When you want to capture what you learned

---

## /summary

Generate an accomplishments summary for a specified time period.

### What it does

1. Asks which time period to summarize (Today, Yesterday, Past 7 days, Custom)
2. Gathers git commits and stats for that period
3. Checks for session logs in the date range
4. Categorizes commits by type (features, fixes, refactors, docs, chores)
5. Generates a structured report

### Usage

```
/summary
```

### Output

A structured report:
- **Features Added** - New functionality
- **Bug Fixes** - Issues resolved
- **Refactoring & Improvements** - Code quality changes
- **Documentation Updates** - Doc changes
- **Session Highlights** - From session logs (if available)
- **Statistics** - Commit counts by category

### When to use

- Personal review of work done
- Sharing progress with team members
- Converting to email updates (ask "adjust for email")
- Tracking productivity over time

---

## /commit

Quick commit with approval.

### What it does

1. Shows git status and diff
2. Drafts a commit message
3. Shows the message for your approval
4. Commits when approved

### Usage

```
/commit
```

### Commit approval

You'll be asked:
- **Commit** - Stage all and commit with this message
- **Edit message** - Change the commit message
- **Skip** - Don't commit

### When to use

- Quick commits during development
- When you don't need the full end-session workflow

---

## Command Implementation Guides

The `templates/commands/` folder contains implementation guides for setting up these commands in new projects:

| File | Purpose |
|------|---------|
| `END-SESSION-COMMAND.md` | Full end-session workflow with creator feedback |
| `Summary-Command.md` | Accomplishments summary from git history |
| `New Feature Workflow.md` | Feature development with Feature-Dev and Ralph Loop |
| `New-Idea-Workflow.md` | How /new-idea works and how to extend it |

These guides are copied to new projects during setup and used to create the corresponding commands.

## UX Guides

The `templates/ux-guides/` folder contains UI/UX patterns:

| File | Purpose |
|------|---------|
| `Canvas-Panel-Navigation-System.md` | React UI pattern for horizontal navigation |

These are implementation guides for building consistent interfaces.
