# Squared Lemons - Business Agent

A sandbox for exploring and prototyping business ideas, agent-based concepts, and reusable patterns for business automation.

## Current State

This project is in early exploration phase. It contains reusable patterns and Claude Code configurations that can be applied to future projects.

## Commands

| Command | Description |
|---------|-------------|
| `/session-end` | End coding session - updates docs, captures learnings, commits changes |
| `/commit` | Draft a commit message, get approval, then commit changes |

## Available Patterns

### Session-End Command
A structured workflow for ending coding sessions. Updates documentation, captures lessons learned, and commits changes with user approval.

See: `Commands/SESSION-END-COMMAND.md`

### Canvas Panel Navigation System
A React/TypeScript UI pattern for horizontal infinite-scrolling navigation.

See: `Commands/Canvas-Panel-Navigation-System.md`

## Project Structure

```
Commands/           # Implementation guides and reusable patterns
.claude/            # Claude Code configuration
  commands/         # Custom slash commands
.project/sessions/  # Local session logs (gitignored)
CLAUDE.md           # Technical documentation for Claude Code
LEARNINGS.md        # Captured insights from sessions
```

## Getting Started

1. Clone this repository
2. Open with Claude Code
3. Start exploring or prototyping

## License

Private - Squared Lemons
