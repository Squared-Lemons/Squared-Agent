# Commands

Detailed documentation for all available commands in Squared Agent.

---

## /spawn-project

Create a new project via discovery conversation or template selection.

### What it does

This command offers two paths:

**1. Discuss & Design (Recommended)**
- Have a discovery conversation about your idea
- Claude helps you think through platform and technology choices
- Discusses authentication, data, UI/UX, integrations
- Recommends knowledge and commands based on your needs
- Generates a complete project package with full context

**2. Use Template**
- Select from existing profiles, knowledge, and commands
- Full control over what gets included
- Best when you know what you need

### Usage

```
/spawn-project
```

Or with files:

```
/spawn-project /path/to/designs
```

### Flow

```
Check for previous /discuss sessions
    ↓
Choose: Discuss & Design or Use Template
    ↓
[Discovery conversation or component selection]
    ↓
Recommendations (knowledge, commands, skills)
    ↓
Generate package to outbox/[project-slug]/
    ↓
Open in Finder
    ↓
Copy to new folder
    ↓
Target agent builds v1
```

### Output

**Discovery flow:**
- `README.md` - Comprehensive project specification
- `PROJECT-BRIEF.md` - Full project context from conversation
- `TECHNICAL-DECISIONS.md` - Technology choices with rationale
- `SETUP.md` - Instructions for target agent
- `.claude/commands/` - All workflow commands
- `knowledge/` - Platform-specific guidance
- `provided-files/` - Any files you provided

**Template flow:**
- `SETUP.md` - Step-by-step setup guide
- Setup files from selected profile
- `commands/` - Selected command guides
- `knowledge/` - Selected knowledge docs

### When to use

**Discovery flow:**
- You have an idea but haven't decided on specifics
- You want help thinking through requirements
- You want the target agent to understand WHY decisions were made
- You have existing files (designs, specs) to include

**Template flow:**
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
7. Generates agent feedback (if applicable)
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
| `END-SESSION-COMMAND.md` | Full end-session workflow with agent feedback |
| `Summary-Command.md` | Accomplishments summary from git history |
| `New Feature Workflow.md` | Feature development with Feature-Dev and Ralph Loop |
| `Spawn-Project-Command.md` | How /spawn-project works with discovery and template flows |
| `Spawn-Project-Workflow.md` | Detailed workflow documentation |

These guides are copied to new projects during setup and used to create the corresponding commands.

## UX Guides

The `templates/ux-guides/` folder contains UI/UX patterns:

| File | Purpose |
|------|---------|
| `Canvas-Panel-Navigation-System.md` | React UI pattern for horizontal navigation |

These are implementation guides for building consistent interfaces.
