# Squared Agent

A master agent for bootstrapping new projects with Claude Code. Contains reusable setup profiles, development patterns, and a knowledge base that improves through feedback from spawned projects.

## What This Does

Use `/prepare-setup` to create setup packages for new projects. Each package includes:
- **Setup instructions** - Step-by-step bootstrap guide
- **Command guides** - Implementation guides for slash commands
- **Skills** - Knowledge base docs for building (tech stacks, patterns)
- **Tasks** - Optional one-time setup activities
- **Best practices** - Plan mode, verification loops, living CLAUDE.md

Projects created from these packages can send feedback back to improve future setups.

## What Gets Configured

The developer profile sets up:

| Feature | What It Does |
|---------|--------------|
| **Plugins** | feature-dev, ralph-loop, code-simplifier, playwright, context7 |
| **Permissions** | Pre-allow safe commands (build, test, lint, format, typecheck) |
| **Hooks** | Auto-format code after Write/Edit operations |
| **Commands** | /session-end, /commit, /new-feature |
| **Agents** | Optional custom agents (build-validator, code-reviewer, verify-app) |

Based on [how the Claude Code creator uses it](https://x.com/bcherny/status/2007179832300581177).

## Commands

| Command | Description |
|---------|-------------|
| `/prepare-setup` | Create a setup package for a new project |
| `/session-end` | End session - update docs, capture learnings, commit |
| `/commit` | Quick commit with approval |

## Plugins

| Plugin | Purpose |
|--------|---------|
| **feature-dev** | Guided feature development with codebase understanding |
| **ralph-loop** | Autonomous development loop for complex tasks |
| **frontend-design** | Production-grade UI components with high design quality |
| **context7** | Up-to-date documentation lookup for libraries |
| **playwright** | Browser automation and testing |
| **code-simplifier** | Code refinement for clarity and maintainability |

## Available Content

### Setup Profiles (`setups/`)
- **developer** - Full developer workflow with plugins, commands, and session management

### Command Guides (`commands/`)
- **SESSION-END-COMMAND.md** - Session-end workflow with creator feedback loop
- **New Feature Workflow.md** - Feature development with Feature-Dev and Ralph Loop
- **Canvas-Panel-Navigation-System.md** - React UI pattern for horizontal navigation

### Skills (`skills/`)
- **Next.js-App-Build-Guide.md** - Next.js + Better Auth + Drizzle + Turborepo patterns

### Tasks (`tasks/`)
- **ExistingProject-Investigate.md** - Analyze existing codebase and generate documentation

## How It Works

```
┌─────────────────┐     /prepare-setup      ┌──────────────────┐
│  Squared Agent  │ ──────────────────────► │   New Project    │
│  (this repo)    │                         │                  │
└─────────────────┘                         └──────────────────┘
        ▲                                            │
        │         creator feedback                   │
        └────────────────────────────────────────────┘
                    (continuous improvement)
```

1. Run `/prepare-setup` to select profile, commands, tasks, and skills
2. Copy the generated package to your new project
3. Tell Claude Code to execute the setup
4. At session end, optionally send feedback back to improve the master agent

## Project Structure

```
commands/           # Implementation guides for slash commands
skills/             # Knowledge base (tech stacks, patterns)
setups/             # Setup profiles
  developer/        # Developer workflow profile
tasks/              # One-time setup tasks
.claude/            # Claude Code configuration
  commands/         # Active slash commands
  agents/           # Custom agent definitions (optional)
.project/sessions/  # Local session logs (gitignored)
CONTRIBUTING.md     # How to extend this project
```

## Getting Started

1. Open this project with Claude Code
2. Run `/prepare-setup`
3. Select what to include in your setup package
4. Copy the package to your new project
5. Execute the setup

## Receiving Feedback

When projects send feedback via `/session-end`, they'll display it in a copy-paste format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY THE FOLLOWING TO SQUARED-AGENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
...feedback content...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Paste feedback here to integrate improvements into skills, setups, or tasks.

## License

Private - Squared Lemons
