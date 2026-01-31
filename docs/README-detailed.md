# Squared Agent Documentation

This guide explains how Squared Agent works. If you haven't read the [main README](../README.md), start there.

---

## Core Concepts

### Master Agent vs Spawned Projects

**Master Agent** — Your central repository of expertise. Contains templates, knowledge guides, and commands that define how you work. You run commands here and improve them over time.

**Spawned Project** — A new project created via `/spawn-project`. Inherits commands and knowledge from its parent. Works independently and can spawn its own children.

**Assumption:** You have one master agent. Everything else is spawned from it (directly or through inheritance chains).

### Pass-Through Inheritance

When a spawned project spawns its own child, it passes down *its own* commands and knowledge — not the original master's templates.

```
Master Agent
    └── spawns → Project A (inherits from Master)
                    └── spawns → Microsite (inherits from Project A, not Master)
```

**Assumption:** Each generation can add its own commands. Those additions propagate to children.

### Templates vs Active Commands

| Location | Purpose |
|----------|---------|
| `.claude/commands/` | Active commands you run right now |
| `templates/commands/` | Guides copied to spawned projects |

The master agent runs active commands and uses `/sync-templates` to update template guides when improvements are ready to propagate.

**Assumption:** Changes to active commands don't affect spawned projects until you explicitly sync.

→ See [Template Sync Workflow](template-sync-workflow.md) for details.

---

## Features

### Session Management

Commands that bookend your work sessions.

| Command | What it does |
|---------|--------------|
| `/start-session` | Loads context, checks for handovers, detects protected branches |
| `/end-session` | Logs summary, captures learnings, tracks tokens, creates handover, commits |

**Handovers** — When you end a session on a feature branch, `/end-session` creates a handover document. Next time you run `/start-session` on that branch, you see where you left off.

**Assumptions:**
- Sessions are bounded work periods (a few hours to a day)
- You want continuity between sessions on the same branch
- Protected branches (main, master, develop, release/*) shouldn't receive direct commits

→ See [Development Workflow](workflow.md) for the full session lifecycle.

### Feature Development

Commands for safe, organized feature work.

| Command | What it does |
|---------|--------------|
| `/new-feature "description"` | Creates feature branch or worktree from current branch |
| `/complete-feature` | Merges to main or creates PR |
| `/commit` | Quick commit with message approval |

**Branch Protection** — If you're on a protected branch, commands will stop and ask you to create a feature branch first.

**Worktrees** — `/new-feature` can create a git worktree instead of a regular branch, letting you work on multiple features simultaneously in separate directories.

**Assumptions:**
- You use feature branches for all development work
- Direct commits to main/master are mistakes, not intentional

→ See [Development Workflow](workflow.md) for examples.

### Project Spawning

Create new projects that inherit your expertise.

| Command | What it does |
|---------|--------------|
| `/spawn-project` | Creates a new project via discovery conversation or template selection |
| `/discuss` | Exploratory conversation about a vague idea (can feed into `/spawn-project`) |

**Two Flows:**

1. **Discuss & Design** — Have a conversation about what you want to build. The agent asks about requirements, platform, technology choices. Outputs a complete project package with full context.

2. **Use Template** — Select components directly (profile, knowledge categories, commands). Best when you already know what you need.

**Output:** Project package in `outbox/[project-slug]/` containing commands, knowledge, setup instructions.

**Assumptions:**
- New projects benefit from inheriting your patterns
- Discovery conversations produce better technical decisions than just "build X"
- You'll copy the output folder to wherever the new project should live

→ See [Commands Reference](commands.md) for detailed `/spawn-project` documentation.

### Feedback System

Learnings from spawned projects flow back to improve the master.

| Command | Where | What it does |
|---------|-------|--------------|
| `/agent-feedback` | Spawned project | Generates feedback file to `outbox/feedback/` |
| `/get-feedback` | Master agent | Processes feedback from `inbox/feedback/` |

**The Flow:**
1. In spawned project: Run `/agent-feedback` when you discover something worth sharing
2. You: Copy the output file to master's `inbox/feedback/`
3. In master: `/start-session` detects pending feedback and offers to process it
4. Processed feedback is archived to `knowledge/archive/`

**What Gets Captured:**
- Knowledge gaps (missing documentation, outdated patterns)
- Setup issues (missing configuration, gotchas)
- New patterns (reusable code, workflows)
- Technical gotchas (library issues, non-obvious solutions)

**Assumptions:**
- You control what feedback flows back (manual file copy)
- Not every session produces feedback — only send when you learned something
- Processed learnings become part of your knowledge base

→ See [Feedback System](feedback.md) for the complete workflow.

### Token Tracking

Track API usage and costs across sessions.

**What's Tracked:**
- Input/output tokens per session
- Cache read/write tokens
- Billing type (subscription vs API)

**Where Data Lives:**
- `.project/token-usage.md` — Raw token data per session
- Dashboard (`apps/web/dashboard/`) — Visual aggregation across projects

**Cost Calculation:** Stored as raw tokens, calculated at report time. This means pricing changes don't require data migration.

**Assumptions:**
- You want visibility into token usage
- Subscription users care about limit utilization
- API users care about cost estimation

### Template Sync

Keep templates in sync with your evolving commands.

| Command | What it does |
|---------|--------------|
| `/sync-templates` | Updates `templates/commands/` to match `.claude/commands/` |
| `/sync-templates --audit` | Shows drift without making changes |

**Integration Points:**
- `/start-session` runs a background audit
- `/end-session` prompts to sync if drift detected
- `/complete-feature` prompts to sync if drift detected

**Assumptions:**
- Active commands evolve faster than templates
- You want to test changes before propagating to new projects
- Templates represent your "production" best practices

→ See [Template Sync Workflow](template-sync-workflow.md) for the full pattern.

---

## Configuration

Spawned projects receive configuration from the selected profile.

**Developer Profile** (`templates/profiles/developer/`) includes:

| Component | What it configures |
|-----------|-------------------|
| **Plugins** | feature-dev, ralph-loop, frontend-design, context7, agent-browser, code-simplifier |
| **Permissions** | Pre-allow safe commands (build, test, lint, format, typecheck) |
| **Hooks** | Auto-format code after Write/Edit operations |
| **Commands** | /start-session, /end-session, /new-feature, /complete-feature, /commit |

→ See [Plugins & Configuration](plugins.md) for details on each plugin.

---

## Project Structure

```
.claude/commands/        # Active commands (what you run)
templates/
  commands/              # Command guides (copied to spawned projects)
  knowledge/             # Framework guides by category
    web/nextjs/
    auth/better-auth/
    database/drizzle/
    monorepo/turborepo/
  profiles/              # Setup profiles (developer, etc.)
  skills/                # Portable agent capabilities
  workflows/             # Development process guides
packages/                # Publishable npm packages
  core/                  # Shared utilities
  cli/                   # Command-line interface
  create-project/        # npm create scaffolding
  dev-server/            # Dynamic port allocation
apps/
  web/dashboard/         # Token tracking and session viewer
inbox/
  ideas/                 # Your improvement ideas
  feedback/              # Feedback from spawned projects
outbox/
  discussions/           # Output from /discuss
  feedback/              # Output from /agent-feedback
  handovers/             # Session handover documents
knowledge/
  archive/               # Processed feedback
.project/                # Local session data (gitignored)
  sessions/              # Session logs
  token-usage.md         # Token tracking
  tool-intelligence.md   # Learned tool preferences
```

---

## Further Reading

| Document | What it covers |
|----------|----------------|
| [Development Workflow](workflow.md) | Session lifecycle, branch workflow, command quick reference |
| [Commands Reference](commands.md) | Detailed documentation for /spawn-project, /end-session, /summary, /commit |
| [Skills & MCP Servers](skills-and-mcp.md) | Agent Skills installation, Toolhive MCP, recommended skills by category |
| [Feedback System](feedback.md) | How learnings flow from spawned projects back to master |
| [Template Sync Workflow](template-sync-workflow.md) | How commands evolve and propagate |
| [Plugins & Configuration](plugins.md) | Claude Code plugins configured in spawned projects |
| [Available Content](content.md) | Profiles, knowledge guides, command guides, tasks |
| [How to Use](how-to-use.md) | Quick reference for getting started |
