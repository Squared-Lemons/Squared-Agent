# Plugins & Configuration

What gets configured when you use a Squared Agent setup package.

---

## What Gets Configured

The developer profile sets up:

| Feature | What It Does |
|---------|--------------|
| **Plugins** | feature-dev, ralph-loop, code-simplifier, playwright, context7, frontend-design |
| **Permissions** | Pre-allow safe commands (build, test, lint, format, typecheck) |
| **Hooks** | Auto-format code after Write/Edit operations |
| **Commands** | /session-end, /commit, /new-feature |
| **Agents** | Optional custom agents (build-validator, code-reviewer, verify-app) |

Based on [how the Claude Code creator uses it](https://x.com/bcherny/status/2007179832300581177).

---

## Plugins

### feature-dev

Guided feature development with codebase understanding.

**Agents included:**
- `code-explorer` - Analyzes existing codebase features
- `code-architect` - Designs feature architectures
- `code-reviewer` - Reviews code for bugs and issues

**When to use:** Complex features that need understanding of existing patterns.

---

### ralph-loop

Autonomous development loop for complex tasks.

**What it does:** Runs a loop where Claude implements, tests, and iterates until the task is complete.

**When to use:** Tasks that benefit from iterative refinement.

---

### frontend-design

Production-grade UI components with high design quality.

**What it does:** Creates distinctive, polished frontend interfaces that avoid generic AI aesthetics.

**When to use:** Building web components, pages, or applications where design quality matters.

---

### context7

Up-to-date documentation lookup for libraries.

**What it does:** Fetches current documentation for any library or framework.

**When to use:** When you need accurate, up-to-date API information.

---

### playwright

Browser automation and testing.

**What it does:** Controls browsers for testing, screenshots, and automation.

**When to use:** E2E testing, visual verification, scraping.

---

### code-simplifier

Code refinement for clarity and maintainability.

**What it does:** Simplifies and refines code while preserving functionality.

**When to use:** After implementing features, to clean up code.

---

## Permissions

The setup pre-allows safe commands to avoid permission fatigue:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run build:*)",
      "Bash(npm run test:*)",
      "Bash(npm run lint:*)",
      "Bash(npm run format:*)",
      "Bash(npm run typecheck:*)",
      "Bash(pnpm build:*)",
      "Bash(pnpm test:*)",
      "Bash(pnpm lint:*)",
      "Bash(pnpm format:*)",
      "Bash(pnpm typecheck:*)"
    ]
  }
}
```

These are read-only or safe operations that don't need manual approval each time.

---

## Hooks

Auto-format hook runs after Write/Edit operations:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npm run format -- $FILE_PATH 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

This keeps code formatted consistently without manual intervention.

---

## Custom Agents

Optional agents in `.claude/agents/`:

| Agent | Purpose |
|-------|---------|
| `build-validator.md` | Validates builds and catches errors |
| `code-reviewer.md` | Reviews code for issues |
| `verify-app.md` | Verifies app functionality |

These are templates - customize them for your project's needs.
