# Setups

Reusable setup instructions for bootstrapping projects with Claude Code workflows.

---

## Available Setups

| Setup | Description |
|-------|-------------|
| [`developer/`](developer/) | Developer workflow with Feature-Dev agents, Ralph Loop, and session management |

---

## How to Use

Give the setup instructions to Claude Code in your target project:

```
Read setups/developer/SETUP-INSTRUCTIONS.md and execute all steps.
```

The agent will:
1. Initialize git if needed
2. Install plugins
3. Read the `Commands/` documentation and create the commands
4. Set up supporting files
5. Commit

---

## Documentation References

The setup instructions point to these documentation files:

| File | Describes |
|------|-----------|
| `SESSION-END-COMMAND.md` | Session-end and commit command workflow |
| `New Feature Workflow.md` | Feature-Dev workflow with Ralph Loop |

The agent reads these docs and creates the actual command implementations.
