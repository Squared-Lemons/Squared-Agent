# Contributing to Squared Agent

This guide explains how to extend and improve the Squared Agent master agent.

## Quick Reference

| Add This | Location | Naming Pattern |
|----------|----------|----------------|
| Command guide | `templates/commands/` | `[COMMAND-NAME]-COMMAND.md` |
| Knowledge | `templates/knowledge/` | `[Technology]-[Pattern]-Guide.md` |
| Setup profile | `templates/profiles/[name]/` | lowercase folder name |
| Task | `templates/tasks/` | `[Action]-[Target].md` |
| Idea | `inbox/ideas/` | `[topic].md` |
| Project feedback | `inbox/feedback/` | `feedback-YYYY-MM-DD.md` |

## Content Types

### Templates

Everything in `templates/` gets copied to new projects.

#### Commands (`templates/commands/`)

Implementation guides that describe how to create commands. Agents read these to generate actual command implementations in `.claude/commands/`.

**When to add:** You have a reusable workflow pattern that should become a command.

#### Knowledges (`templates/knowledge/`)

Knowledge base documentation that agents consult during feature development. These are reference guides, not setup instructions.

**When to add:** You've learned patterns, gotchas, or best practices for a technology stack that future projects should know.

#### Profiles (`templates/profiles/`)

Bootstrap profiles that configure new projects with specific plugin sets, commands, and workflows.

**When to add:** You need a different combination of tools/commands than existing profiles provide.

#### Tasks (`templates/tasks/`)

One-time activities that run after base setup. Used for project-specific initialization.

**When to add:** You have a repeatable setup activity that applies to certain project types.

### Inbox

Drop ideas and feedback here for discussion.

#### Ideas (`inbox/ideas/`)

Your ideas for improving this agent. Create a markdown file describing what you want to change and why.

#### Project Feedback (`inbox/feedback/`)

Feedback from projects created with this agent. Copy feedback from spawned project's `outbox/feedback/` here.

### Suggestions

I create proposals here based on inbox items and learnings. Each suggestion is a markdown file explaining what to change, why, and how.

## Naming Conventions

### Folders
- All lowercase: `templates/`, `inbox/`, `suggestions/`
- Use hyphens for multi-word names: `open-source/`, `full-stack/`

### Files
- Use Title-Case with hyphens
- Commands: `[NAME]-COMMAND.md`
- Knowledges: `[Tech]-[Pattern]-Guide.md`
- Tasks: `[Action]-[Target].md`

## Workflow

### Adding New Content

1. Create the content file in the appropriate `templates/` folder
2. Update CLAUDE.md's Available Content section
3. Update README.md if user-facing
4. Test by running `/spawn-project` to verify it appears

### Submitting Ideas

1. Create a markdown file in `inbox/ideas/`
2. Describe what you want to change and why
3. I'll review and create proposals in `suggestions/`

### Feedback from Projects

When projects send feedback via `/agent-feedback`:

1. Copy feedback file from `outbox/feedback/` to `inbox/feedback/`
2. Run `/start-session` which will detect and offer to process
3. We discuss and implement approved improvements
4. Processed feedback archives to `knowledge/archive/`
5. Document changes in CLAUDE.md's Recent Changes

## File Updates Checklist

When adding content, update these files:

- [ ] Create content file in correct `templates/` folder
- [ ] Update CLAUDE.md Available Content section
- [ ] Update README.md if it affects user-facing features
- [ ] Update `/spawn-project` command if needed (for new profiles)

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
