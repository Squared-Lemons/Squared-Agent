# Squared Lemons - Business Agent - Learnings

Insights and lessons captured from coding sessions to improve future development.

---

## Session Log

### 2026-01-11: Initial Project Setup

**What Was Done**
- Created project structure with Claude Code commands
- Added `/session-end` command for ending sessions
- Added `/commit` command for quick commits
- Documented reusable patterns in `Commands/`
- Created README.md with user-facing documentation

**What Worked Well**
- Command file structure (`.claude/commands/*.md`) is clean and self-contained
- Separating implementation guides (`Commands/`) from active commands (`.claude/commands/`)

**Key Decision**
- Session logs stored locally in `.project/sessions/` (gitignored) to keep git history clean while maintaining local archive

---

## Patterns That Work

### Documentation Structure
- `CLAUDE.md` as single source of truth for project state
- Command files (`.claude/commands/*.md`) are self-documenting
- Recent Changes section at top of CLAUDE.md for quick context

### Workflow Design
- *To be captured as patterns emerge*

---

## Antipatterns to Avoid

### Documentation
- Don't let CLAUDE.md get stale - update it as you work
- Don't document features before they're working

---

## Technical Gotchas

*Library-specific issues and platform-specific issues will be captured here.*

---

## Ideas for Future Sessions

- [ ] *Future work items will be added here*
