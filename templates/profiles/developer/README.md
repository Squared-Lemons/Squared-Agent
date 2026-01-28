# Developer Profile

[← Back to Profiles](../README.md) · [← Back to Templates](../../README.md)

---

The standard developer workflow for Claude Code projects. This profile sets up everything most projects need — plugins, permissions, hooks, and session management.

## What's Included

| Component | What It Configures |
|-----------|-------------------|
| **Plugins** | feature-dev, ralph-loop, code-simplifier, agent-browser, context7 |
| **Permissions** | Pre-allow build, test, lint, format, typecheck commands |
| **Hooks** | Auto-format after Write/Edit operations |
| **Commands** | /start-session, /new-feature, /complete-feature, /end-session, /commit |
| **Agents** | Optional build-validator, code-reviewer, verify-app |

---

## Files

| File | Purpose |
|------|---------|
| [SETUP-INSTRUCTIONS.md](SETUP-INSTRUCTIONS.md) | Step-by-step guide the agent follows to set up a project |

---

## What Gets Created

When the agent runs this profile, it creates:

```
project/
├── .claude/
│   ├── settings.json       # Plugins, permissions, hooks
│   ├── commands/           # Slash commands
│   │   ├── start-session.md
│   │   ├── new-feature.md
│   │   ├── complete-feature.md
│   │   ├── end-session.md
│   │   └── commit.md
│   └── agents/             # Optional custom agents
├── .project/               # Local data (gitignored)
│   ├── sessions/           # Daily session logs
│   ├── token-usage.md      # Cumulative token history
│   ├── session-note.md     # Handoff between sessions
│   └── tool-intelligence.md # Learned tool preferences
├── CLAUDE.md               # Agent instructions
└── LEARNINGS.md            # Session insights
```

---

## Plugins

### feature-dev
Architecture-first feature development with code-explorer, code-architect, and code-reviewer agents.

### ralph-loop
Autonomous implement → test → iterate loop. Feature-dev uses this where appropriate.

### code-simplifier
Refines code for clarity while preserving functionality.

### agent-browser
Browser automation and testing (headless by default).

### context7
Fetches up-to-date library documentation.

---

## Permissions

Pre-allowed commands (no approval needed):

```
npm run build:*    pnpm build:*    bun run build:*
npm run test:*     pnpm test:*     bun run test:*
npm run lint:*     pnpm lint:*     bun run lint:*
npm run format:*   pnpm format:*   bun run format:*
npm run typecheck:* pnpm typecheck:* bun run typecheck:*
```

---

## Hooks

**PostToolUse** — After Write/Edit operations:
- Runs project formatter automatically
- Falls back gracefully if no formatter configured

---

## Best For

- Most development projects
- Solo or team workflows
- Projects needing git discipline
- Any stack (Node, Python, Go, etc.)

---

## Customizing

After setup, you can:

1. **Add plugins** — Edit `.claude/settings.json`
2. **Add permissions** — Pre-allow more commands
3. **Modify commands** — Edit files in `.claude/commands/`
4. **Add agents** — Create files in `.claude/agents/`

The profile provides a solid foundation. Evolve it as your project grows.
