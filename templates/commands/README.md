# Commands

Implementation guides that describe how to create Claude Code slash commands. These are reference documentation that agents read to generate actual command implementations.

## How It Works

```
commands/                          .claude/commands/
┌─────────────────────────┐       ┌─────────────────────────┐
│ SESSION-END-COMMAND.md  │ ───►  │ session-end.md          │
│ (documentation)         │       │ (executable command)    │
└─────────────────────────┘       └─────────────────────────┘
```

**Command guides** in this folder are comprehensive documentation. When a new project is set up, the agent reads these guides and generates actual executable commands in `.claude/commands/`.

## Available Commands

| Guide | Creates Command | Purpose |
|-------|-----------------|---------|
| [SESSION-END-COMMAND.md](./SESSION-END-COMMAND.md) | `/session-end` | End session, update docs, capture learnings, commit |
| [Summary-Command.md](./Summary-Command.md) | `/summary` | Generate accomplishments summary for a time period |
| [New Feature Workflow.md](./New%20Feature%20Workflow.md) | `/feature` | Multi-phase feature development with agents |
| [Canvas-Panel-Navigation-System.md](./Canvas-Panel-Navigation-System.md) | (pattern) | React UI pattern reference |

## How to Extend

### Adding a New Command Guide

1. **Create the documentation file**
   ```
   commands/[COMMAND-NAME]-COMMAND.md
   ```

2. **Structure your guide with these sections:**
   - Overview - What the command does
   - Prerequisites - What's needed before use
   - Workflow - Step-by-step execution flow
   - Implementation - Code patterns and examples
   - Troubleshooting - Common issues and solutions

3. **Update this README** - Add entry to the Available Commands table

4. **Update CLAUDE.md** - Add to Available Content section

5. **Update setups if needed** - Reference in relevant setup profiles

### Naming Convention

- Use `[COMMAND-NAME]-COMMAND.md` for command implementations
- Use descriptive names for pattern references (like Canvas-Panel-Navigation-System.md)
- Use Title Case with hyphens

### Template Structure

```markdown
# [Command Name]

Brief description of what this command does.

## Overview

Detailed explanation of purpose and value.

## Prerequisites

- Required plugins
- Required files/folders
- Required configuration

## Workflow

1. Step one
2. Step two
3. ...

## Implementation

### Component 1
[Details and code examples]

### Component 2
[Details and code examples]

## Troubleshooting

| Issue | Solution |
|-------|----------|
| ... | ... |
```
