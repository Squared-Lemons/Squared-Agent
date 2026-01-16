# Tasks

One-time setup activities that can be included in setup packages. Tasks are executed after the base setup and commands are configured.

## Available Tasks

| Task | Description |
|------|-------------|
| [ExistingProject-Investigate](./ExistingProject-Investigate.md) | Analyze existing codebase and generate documentation |

## How Tasks Are Used

1. Run `/prepare-setup`
2. Select a setup profile
3. Choose which tasks to include
4. The generated setup package includes task instructions
5. Tasks are executed after base setup is complete

## How to Extend

### Adding a New Task

1. **Create the task file**
   ```
   tasks/[Task-Description].md
   ```
   Examples: `Database-Migration.md`, `Security-Audit.md`, `Dependency-Cleanup.md`

2. **Structure your task with these sections:**
   - Overview - What this task accomplishes
   - Prerequisites - What's needed before running
   - Steps - Detailed execution instructions
   - Outputs - What gets created/modified
   - Verification - How to confirm success

3. **Update this README** - Add entry to the Available Tasks table

4. **Update CLAUDE.md** - Add to Available Content section

### Naming Convention

- Use `[Action]-[Target].md` format
- Action: What's being done (Investigate, Migrate, Audit, etc.)
- Target: What it's applied to (Project, Database, Dependencies, etc.)
- Use Title-Case with hyphens

### Template Structure

```markdown
# [Task Name]

Brief description of what this task accomplishes.

## Overview

When and why to run this task.

## Prerequisites

- Required tools/access
- Required state (e.g., "base setup complete")

## Steps

### Phase 1: [First Phase]
1. Step one
2. Step two

### Phase 2: [Second Phase]
1. Step one
2. Step two

## Outputs

What gets created or modified:
- File 1: description
- File 2: description

## Verification

How to confirm the task completed successfully:
- [ ] Check 1
- [ ] Check 2
```

### Task Ideas

Consider creating tasks for:
- **Database-Migration** - Set up or migrate database schema
- **Security-Audit** - Review for common vulnerabilities
- **Dependency-Update** - Update and audit dependencies
- **Performance-Analysis** - Profile and identify bottlenecks
- **Testing-Setup** - Configure test framework and initial tests
