# Squared Agent

A Claude Code agent that bootstraps new projects. It packages up setup instructions, platform-specific guidance, and development workflows into folders you copy to new projects.

**The idea:** You describe what you want to build → Squared Agent creates a setup package → You copy it to a new folder → Claude Code reads the instructions and helps you build it.

---

## Quick Start

### 1. Get the Agent

```bash
git clone https://github.com/squared-lemons/squared-agent.git
cd squared-agent
```

Or download and extract the ZIP.

### 2. Open with Claude Code

```bash
claude .
```

### 3. Start a New Idea

```
/new-idea
```

Have a conversation:
- Describe what you want to build
- Discuss requirements and platform options
- Make technical decisions together
- Claude generates a complete project package

### 4. Copy to Your Project

A folder opens with your setup package. Copy its contents to your new project folder.

### 5. Run the Setup

In your new project folder:

```bash
claude .
```

Tell Claude: "Read SETUP.md and help me set up this project"

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                      SQUARED AGENT                               │
│                                                                  │
│  /new-idea                                                       │
│     │                                                            │
│     ├─► Discovery conversation                                  │
│     ├─► Discuss requirements & platform                         │
│     ├─► Make technical decisions                                │
│     └─► Generate project package                                │
│              │                                                   │
│              ▼                                                   │
│     ┌──────────────────────┐                                    │
│     │  Project Package     │                                    │
│     │  - PROJECT-BRIEF.md  │  ◄── Full context                  │
│     │  - TECHNICAL-DECISIONS│                                   │
│     │  - SETUP.md          │                                    │
│     │  - skills/           │                                    │
│     │  - commands/         │                                    │
│     └────────┬─────────────┘                                    │
└──────────────┼──────────────────────────────────────────────────┘
               │
               │  Copy to new folder
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      YOUR NEW PROJECT                            │
│                                                                  │
│  "Read SETUP.md and build this project"                         │
│     │                                                            │
│     ├─► Claude reads project brief                              │
│     ├─► Claude understands WHY decisions were made              │
│     ├─► Claude enters plan mode                                 │
│     └─► Claude builds version 1                                 │
│              │                                                   │
│              ▼                                                   │
│     Working app!                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Commands

| Command | What it does | Details |
|---------|--------------|---------|
| `/new-idea` | Discovery conversation → project package | [docs/commands.md](docs/commands.md#new-idea) |
| `/prepare-setup` | Create generic setup package | [docs/commands.md](docs/commands.md#prepare-setup) |
| `/session-end` | End session, update docs, commit | [docs/commands.md](docs/commands.md#session-end) |
| `/commit` | Quick commit with approval | [docs/commands.md](docs/commands.md#commit) |

---

## Documentation

| Doc | What's in it |
|-----|--------------|
| [docs/commands.md](docs/commands.md) | Full command documentation |
| [docs/plugins.md](docs/plugins.md) | Plugins and configuration details |
| [docs/content.md](docs/content.md) | Available profiles, skills, and tasks |
| [docs/feedback.md](docs/feedback.md) | Creator feedback loop |

---

## Project Structure

```
commands/           # Implementation guides for slash commands
skills/             # Knowledge base (tech stacks, patterns)
setups/             # Setup profiles
  developer/        # Developer workflow profile
tasks/              # One-time setup tasks
docs/               # Documentation
.claude/            # Claude Code configuration
  commands/         # Active slash commands
```

---

## License

Private - Squared Lemons
