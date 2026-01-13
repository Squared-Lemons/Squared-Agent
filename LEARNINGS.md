# Squared Lemons - Business Agent - Learnings

Insights and lessons captured from coding sessions to improve future development.

---

## Session Log

### 2026-01-13: Boris Cherny's Claude Code Best Practices

**What Was Done**
- Analyzed Boris Cherny's Twitter thread about how he uses Claude Code
- Identified gaps between his recommendations and our setup templates
- Added PostToolUse hooks for auto-formatting after Write/Edit
- Added pre-configured permissions for safe commands (build, test, lint, format, typecheck)
- Added `.claude/agents/` pattern with template agents (build-validator, code-reviewer, verify-app)
- Added Development Workflow section to CLAUDE.md template
- Added "Working with Claude Code - Best Practices" section to setup instructions
- Emphasized Plan Mode, verification loops, and living CLAUDE.md

**What Worked Well**
- Browser automation tools to read Twitter thread (WebFetch couldn't handle JS-heavy page)
- Reading the full thread gave comprehensive understanding of best practices
- Mapping insights to our existing structure showed clear gaps

**Key Insights**
- **Plan Mode first**: Most sessions should start in Plan Mode (shift+tab twice), iterate on plan, then auto-accept
- **Verification = 2-3x quality**: When Claude can verify its work (tests, typecheck, lint), quality improves dramatically
- **CLAUDE.md as living doc**: Team contributes to it, add rules when Claude does something wrong
- **Pre-allow safe commands**: Avoid permission fatigue with pre-configured permissions
- **Auto-format hooks**: Format code after every Write/Edit to avoid CI issues

**Source**
- https://x.com/bcherny/status/2007179832300581177

---

### 2026-01-12: Creator Feedback Integration

**What Was Done**
- Integrated creator feedback from spawned project (gym-management)
- Enhanced Next.js skill with Better Auth gotchas (serverExternalPackages, singleton pattern, webpack config)
- Added Handoff Document Template section to Next.js skill
- Added Developer Experience Checklist to Next.js skill
- Updated session-end to auto-generate SETUP.md handoff document
- Changed creator feedback to auto-generate from session analysis (not ask user)
- Added Plugins section to README.md

**What Worked Well**
- Creator feedback loop actually works - real issues from spawned project improved master agent
- Auto-generating feedback is better than asking - agent has context about what happened
- Handoff document template ensures consistent project documentation

**Key Insight**
- Agent should analyze the session and generate feedback automatically rather than asking user
- This produces better structured feedback based on actual issues encountered

**Process Improvement**
- session-end now has 11 steps including SETUP.md generation and auto-feedback
- Feedback displayed with visual delimiters for easy copy-paste to master agent

---

### 2026-01-12: Auto-organize Docs & Improved Feedback Display

**What Was Done**
- Added auto-organize step to SETUP-INSTRUCTIONS.md - moves docs to `docs/` folder
- Updated SESSION-END-COMMAND.md with creator feedback step and `docs/` paths
- Enhanced feedback display with copy-paste friendly format

**What Worked Well**
- Clear visual delimiters (━━━) make feedback block easy to select and copy
- Moving docs to `docs/` keeps project root clean from start
- Only CLAUDE.md and README.md remain at root (as required)

**Key Insight**
- Subagent feedback should be displayed in a format optimized for transfer back to master agent
- Visual delimiters and clear headers make copy-paste seamless

**Process Improvement**
- Feedback now displayed with "COPY THE FOLLOWING TO SQUARED-AGENT:" header
- Box-style formatting makes selection easy in terminal

---

### 2026-01-12: Skills Knowledge Base & Feedback Loop

**What Was Done**
- Created `skills/` folder as knowledge base for agent development
- Added Next.js App Build Guide (Better Auth, Drizzle, Turborepo patterns)
- Enhanced `/prepare-setup` to include commands and skills selection
- Added creator feedback loop to `/session-end` command

**What Worked Well**
- Separating skills (knowledge docs) from commands (implementation guides) creates clear mental model
- Skills go in `skills/` subfolder in output, keeping root clean
- Creator feedback loop creates continuous improvement cycle between projects and master agent

**Key Insight**
- Four-layer architecture for agent setup:
  1. **Profiles** (`setups/`) - Bootstrap instructions
  2. **Commands** (`Commands/`) - Slash command implementation guides
  3. **Tasks** (`tasks/`) - One-time setup activities
  4. **Skills** (`skills/`) - Reference knowledge for building

**Process Improvement**
- `/session-end` now asks for feedback to send back to master agent
- Feedback saved to `docs/creator-feedback.md` in project
- User can bring feedback back to improve future setups

---

### 2026-01-12: Prepare-Setup Command

**What Was Done**
- Created `/prepare-setup` command for bootstrapping new projects
- Added `setups/` directory with developer profile
- Added `tasks/` directory for one-time setup tasks
- Created setup packaging workflow that copies selected files to temp folder

**What Worked Well**
- Separating profiles, commands, and tasks makes setup flexible
- Generating customized SETUP-INSTRUCTIONS.md based on selections
- Opening temp folder in Finder for easy access

**Key Decision**
- Setup packages are self-contained in temp folders, not integrated into target projects until user copies them

---

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
