# Squared Lemons - Business Agent

A sandbox for exploring and prototyping business ideas, agent-based concepts, and reusable patterns for business automation.

## Quick Links

| Section | Description |
|---------|-------------|
| [Clients](Clients/) | Client information, research, and documentation |
| [Squared Lemons](Squared-Lemons/) | Company management and operations |
| [Research](Research/) | General research library and knowledge base |
| [Projects](Projects/) | Active and completed projects |

## Current State

This project is in early exploration phase. It contains reusable patterns, Claude Code configurations, and company knowledge management.

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
Clients/            # Client information and research
  _TEMPLATE/        # Template for new clients
Squared-Lemons/     # Company management
  strategy/         # Business strategy and goals
  operations/       # Processes and workflows
  finance/          # Financial documents
  legal/            # Contracts and policies
Research/           # General research library
  market/           # Market research
  technology/       # Tech research
  competitors/      # Competitor analysis
  ideas/            # Business ideas
Projects/           # Active projects
  _TEMPLATE/        # Template for new projects
Commands/           # Implementation guides and patterns
.claude/            # Claude Code configuration
  commands/         # Custom slash commands
.project/sessions/  # Local session logs (gitignored)
```

## Getting Started

1. Clone this repository
2. Open with Claude Code
3. Start exploring or prototyping

## License

Private - Squared Lemons
