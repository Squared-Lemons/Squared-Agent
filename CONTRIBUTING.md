# Contributing to Squared Agent

This guide explains how to extend and improve the Squared Agent master agent.

## Quick Reference

| Add This | Location | Naming Pattern |
|----------|----------|----------------|
| Command guide | `commands/` | `[COMMAND-NAME]-COMMAND.md` |
| Skill | `skills/` | `[Technology]-[Pattern]-Guide.md` |
| Setup profile | `setups/[name]/` | lowercase folder name |
| Task | `tasks/` | `[Action]-[Target].md` |

## Content Types

### Commands (`commands/`)

Implementation guides that describe how to create slash commands. Agents read these to generate actual command implementations in `.claude/commands/`.

**When to add:** You have a reusable workflow pattern that should become a slash command.

See: [commands/README.md](commands/README.md) for detailed instructions.

### Skills (`skills/`)

Knowledge base documentation that agents consult during feature development. These are reference guides, not setup instructions.

**When to add:** You've learned patterns, gotchas, or best practices for a technology stack that future projects should know.

See: [skills/README.md](skills/README.md) for detailed instructions.

### Setups (`setups/`)

Bootstrap profiles that configure new projects with specific plugin sets, commands, and workflows.

**When to add:** You need a different combination of tools/commands than existing profiles provide.

See: [setups/README.md](setups/README.md) for detailed instructions.

### Tasks (`tasks/`)

One-time activities that run after base setup. Used for project-specific initialization.

**When to add:** You have a repeatable setup activity that applies to certain project types.

See: [tasks/README.md](tasks/README.md) for detailed instructions.

## Naming Conventions

### Folders
- All lowercase: `commands/`, `skills/`, `setups/`, `tasks/`
- Use hyphens for multi-word names: `open-source/`, `full-stack/`

### Files
- Use Title-Case with hyphens
- Commands: `[NAME]-COMMAND.md`
- Skills: `[Tech]-[Pattern]-Guide.md`
- Tasks: `[Action]-[Target].md`

## Workflow

### Adding New Content

1. Create the content file in the appropriate folder
2. Update the folder's README.md table
3. Update CLAUDE.md's Available Content section
4. Update README.md if user-facing
5. Test by running `/prepare-setup` to verify it appears

### Updating from Feedback

When projects send feedback via `/session-end`:

1. Review the feedback for actionable improvements
2. Update relevant skills with new gotchas/patterns
3. Update setup profiles if workflow changes needed
4. Add new tasks if one-time activities identified
5. Document changes in CLAUDE.md's Recent Changes

## File Updates Checklist

When adding content, update these files:

- [ ] Create content file in correct folder
- [ ] Update folder README.md (add to table)
- [ ] Update CLAUDE.md Available Content section
- [ ] Update README.md if it affects user-facing features
- [ ] Update `/prepare-setup` command if needed (for new setups)

## Quality Guidelines

### Documentation
- Include working code examples
- Document known issues and solutions
- Use mermaid diagrams for complex workflows
- Keep language clear and actionable

### Structure
- Follow the template in each folder's README
- Use consistent heading levels
- Include verification/testing steps

### Maintenance
- Update Recent Changes in CLAUDE.md
- Remove outdated content rather than letting it rot
- Keep examples current with latest versions
