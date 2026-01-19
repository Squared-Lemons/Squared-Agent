# Squared Lemons - Business Agent - Learnings

Insights and lessons captured from coding sessions to improve future development.

---

## Session Log

### 2026-01-19: Knowledge Template Enhancement with Installed Skills

**What Was Done**
- Reviewed Next.js App Build Guide against newly installed skills (vercel-react-best-practices, web-design-guidelines)
- Enhanced `templates/knowledge/web/nextjs/Next.js-App-Build-Guide.md` with:
  - **Performance Patterns (Critical)** section: waterfalls, bundle size, server-side caching, Suspense boundaries
  - **UI/UX Checklist** section: accessibility, forms, performance, responsive
  - **Skills for Deeper Learning** section: references to installed skills for more detail
- Template grew from 101 lines to 266 lines of actionable guidance

**What Worked Well**
- Reading the full skill AGENTS.md files revealed the depth of guidance available
- Extracting the most impactful patterns (CRITICAL priority) for the template kept it focused
- Checklist format for UI/UX makes it actionable vs wall of text

**Key Insights**
- **Skills are comprehensive but need summary integration**: The 2400-line Vercel guide is too much to copy; better to extract key patterns and reference the skill for deep dives
- **Templates should be practical quick references**: Knowledge templates work best as "what you need to know now" with links to "learn more"
- **Interactive CLI tools need user execution**: `npx add-skill` requires TTY for interactive selection - agent should ask user to run it, not try to automate around it

**Pattern Established**
- Skill integration flow: install skill → read full guidance → extract critical patterns → add to relevant template → reference skill for deeper learning

---

### 2026-01-19: Clean-Branches Command

**What Was Done**
- Created `/clean-branches` command for branch maintenance
- Added command to Session Git Workflow as the 6th command
- Updated all documentation (CLAUDE.md, README.md, templates/)

**What Worked Well**
- Following the plan from plan mode made implementation straightforward
- Consistent command patterns from existing commands (complete-feature, new-feature) provided clear templates
- TodoWrite tracking ensured no documentation files were missed

**Key Insight**
- **Maintenance commands complete the workflow** - Session Git Workflow was missing a cleanup step; adding `/clean-branches` fills the gap between `/complete-feature` and `/end-session`

**Pattern Established**
- Branch cleanup flow: merged branches + gone branches → preview → approval → delete local → optionally delete remote
- Safety rules: never delete protected branches, current branch, or worktree branches

---

### 2026-01-19: Agent Skills Integration & Documentation System

**What Was Done**
- Integrated Agent Skills system ([agentskills.io](https://agentskills.io/home)) for portable agent capabilities
- Created `/add-skill` command to install and catalogue skills
- Created `templates/skills/` with `skill-mapping.json` for category-based recommendations
- Updated `/prepare-setup` and `/new-idea` to recommend skills based on knowledge categories
- Created `/sync-docs` command for documentation consistency
- Created `docs/style-guide.md` with voice, terminology, and formatting standards
- Created `docs/doc-patterns/` with templates for README, command, and knowledge docs
- Split monolithic Next.js guide into category folders: `web/`, `database/`, `auth/`, `monorepo/`, `patterns/`

**What Worked Well**
- Install-not-copy model for skills: spawned projects install fresh via `npx add-skill` instead of copying skill files
- Category-based skill mapping: skills are recommended based on selected knowledge categories
- Style guide with terminology table catches inconsistent naming across docs

**Key Insights**
- **Skills ≠ Claude Code plugins**: Skills are portable across any agent (Cursor, VS Code, Gemini CLI), plugins are Claude Code specific
- **Install fresh, don't copy**: Spawned projects get latest versions by installing during setup, not copying stale files
- **Documentation drift is inevitable**: Need systematic tooling (`/sync-docs`) to maintain consistency across 20+ files
- **Terminology matters**: "spawned project" vs "child project", "install" vs "copy" - consistent terms reduce confusion

**Pattern Established**
- Skills flow: `/add-skill` catalogues → `skill-mapping.json` tracks → `/prepare-setup` recommends → spawned agent installs
- Doc consistency: `style-guide.md` defines standards → `doc-patterns/` provides templates → `/sync-docs` enforces

---

### 2026-01-16: Documentation & Terminology Improvements

**What Was Done**
- Added `/how-to-use` command with human-editable guide at `docs/how-to-use.md`
- Added `/get-feedback` command for processing inbox and implementing improvements
- Renamed `/list` to `/list-tools` for clarity
- Renamed `templates/skills/` to `templates/knowledge/` - better reflects that these are framework guides from other agents
- Created `templates/ux-guides/` for UI/UX patterns (moved Canvas navigation here)
- Added `docs/workflow.md` explaining the development workflow with Mermaid diagrams
- Converted README.md ASCII diagrams to Mermaid for better rendering
- Updated 20+ files with skills→knowledge terminology

**What Worked Well**
- Separating content types: commands (how to build slash commands), knowledge (framework guides), ux-guides (UI patterns)
- Human-editable docs pattern: command reads from a .md file users can customize
- Mermaid in .md files, ASCII in terminal output - best of both worlds

**Key Insight**
- **Naming reflects purpose** - "skills" implied agent abilities; "knowledge" correctly describes framework guides created by other agents
- **Let users extend** - `/how-to-use` points to a file users can add their own tips to
- **Consistent folder patterns** - templates/ has clear categories that map to what gets copied to new projects

---

### 2026-01-16: Session Git Workflow Implementation

**What Was Done**
- Implemented branch discipline workflow from `inbox/ideas/Session-Git-Work-Flow.md`
- Created `/start-session` command (replaces `/catch-up`) with branch awareness
- Created `/new-feature` command for safe branch/worktree creation
- Created `/complete-feature` command with merge or PR options
- Renamed `/session-end` to `/end-session` for naming consistency
- Added Branch Protection Rule to CLAUDE.md
- Updated 20+ files with renamed command references

**What Worked Well**
- Plan mode ensured full design was agreed before implementation
- `{action}-{thing}` naming convention makes commands intuitive:
  - `/start-session`, `/end-session`
  - `/new-feature`, `/complete-feature`
- Offering both merge and PR options in `/complete-feature` supports solo and team workflows

**Key Insight**
- **Teaching through enforcement** - Hard stops on protected branches with clear guidance teaches good habits without being annoying
- **Worktree support from day one** - Including worktree option means users can do parallel work when needed
- **Naming conventions matter** - Consistent `{action}-{thing}` pattern makes commands predictable

**Pattern Established**
- Session workflow: `/start-session` → work → `/new-feature` → work → `/complete-feature` → `/end-session`
- Branch protection is enforced via CLAUDE.md rule, not hooks

---

### 2026-01-16: Folder Structure Reorganization

**What Was Done**
- Reorganized entire project structure for clarity
- Created `templates/` folder containing all exportable content
- Moved `commands/`, `knowledge/`, `tasks/` into `templates/`
- Renamed `setups/` to `templates/profiles/`
- Created `inbox/` for ideas and project feedback
- Created `suggestions/` for agent-generated improvement proposals
- Updated all command files with new paths
- Updated all documentation (CLAUDE.md, README.md, docs/*.md, CONTRIBUTING.md)

**What Worked Well**
- Plan mode was essential for this refactor - having the full plan approved before starting
- Moving everything at once (vs incremental) avoided broken state
- The new structure makes intent obvious:
  - `templates/` = stuff that gets copied
  - `inbox/` = raw input from users/projects
  - `suggestions/` = agent's proposals for discussion

**Key Insight**
- **Clear separation enables autonomy** - With distinct folders for templates vs feedback vs proposals, the agent can proactively review inbox and create suggestions without needing to ask "where does this go?"
- **File-based feedback > paste-and-tell** - Saving feedback as files in `inbox/from-projects/` creates a reviewable queue instead of ephemeral chat messages

**Pattern Established**
- Improvement workflow: `inbox/` → `LEARNINGS.md` → `suggestions/` → discuss → implement → `templates/`
- Agent can autonomously create proposals in `suggestions/` for user review

---

### 2026-01-13: Enhanced /new-idea as Consultative Process

**What Was Done**
- Transformed `/new-idea` from form-based to conversational discovery process
- Added support for user-provided files (designs, specs)
- Output now includes PROJECT-BRIEF.md with full context
- Output includes TECHNICAL-DECISIONS.md with rationale for choices
- Created docs/ folder with detailed documentation (commands, plugins, content, feedback)
- Restructured README to be minimal with Quick Start focus

**What Worked Well**
- Separating "what" from "why" in output (PROJECT-BRIEF vs TECHNICAL-DECISIONS)
- Moving details to docs/ keeps README scannable
- Conversational flow allows natural exploration of requirements

**Key Insight**
- **Consultative > Transactional** - A conversation that explores requirements produces better context than a form that collects answers
- Target agent benefits from understanding WHY decisions were made, not just WHAT was decided
- User-provided files (designs, specs) are valuable context that should travel with the package

**Pattern Established**
- `/new-idea` now generates:
  - `PROJECT-BRIEF.md` - Full project context
  - `TECHNICAL-DECISIONS.md` - Choices with rationale
  - `SETUP.md` - Instructions for target agent
  - `knowledge/`, `commands/`, `provided-files/`

---

### 2026-01-13: New Idea Command (Initial)

**What Was Done**
- Created `/new-idea` command for idea-focused project bootstrapping
- Initially misunderstood requirement - built it to enter plan mode directly in Squared-Agent
- Corrected after user clarification - now creates setup packages like `/prepare-setup`
- Setup package includes: SETUP.md with idea baked in, platform skill, selected commands
- Target agent reads SETUP.md and enters plan mode with full context

**What Worked Well**
- Plan mode helped catch the misunderstanding early before too much implementation
- User's clarification "this creates agent instructions files" made the intent clear
- Reusing `/prepare-setup` patterns made the fix quick

**Key Insight**
- **Squared-Agent doesn't execute setups directly** - it creates packages for other projects
- The pattern is: gather context → create package → user copies to new project → target agent executes
- This was the same pattern as `/prepare-setup` but applied to a more specific use case (app ideas)

**Misunderstanding to Avoid**
- Don't enter plan mode or make changes in Squared-Agent when the user wants a setup package
- `/prepare-setup` and `/new-idea` both create packages that get copied elsewhere

**Command Difference**
- `/prepare-setup` - Generic setup package (profile + commands + tasks + knowledge)
- `/new-idea` - Idea-specific package (platform + idea description + commands)
- Both create temp folders with SETUP.md that target agents execute

---

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
- Updated END-SESSION-COMMAND.md with creator feedback step and `docs/` paths
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

### 2026-01-12: Knowledge Base & Feedback Loop

**What Was Done**
- Created `knowledge/` folder as knowledge base for agent development
- Added Next.js App Build Guide (Better Auth, Drizzle, Turborepo patterns)
- Enhanced `/prepare-setup` to include commands and knowledge selection
- Added creator feedback loop to `/end-session` command

**What Worked Well**
- Separating knowledge (knowledge docs) from commands (implementation guides) creates clear mental model
- Knowledge goes in `knowledge/` subfolder in output, keeping root clean
- Creator feedback loop creates continuous improvement cycle between projects and master agent

**Key Insight**
- Four-layer architecture for agent setup:
  1. **Profiles** (`setups/`) - Bootstrap instructions
  2. **Commands** (`Commands/`) - Slash command implementation guides
  3. **Tasks** (`tasks/`) - One-time setup activities
  4. **Knowledge** (`knowledge/`) - Reference guides for building

**Process Improvement**
- `/end-session` now asks for feedback to send back to master agent
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
- Setup packages are self-contained in temp folders, not integrated into spawned projects until user copies them

---

### 2026-01-11: Initial Project Setup

**What Was Done**
- Created project structure with Claude Code commands
- Added `/end-session` command for ending sessions
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

### Project Structure
- `templates/` for content that gets exported to new projects
- `inbox/` for raw input (ideas, feedback from spawned projects)
- `suggestions/` for agent-generated proposals (categorized by type)
- Clear separation enables agent autonomy in improvement workflow

### Workflow Design
- **Improvement loop**: inbox → learnings → suggestions → discuss → implement → templates
- **File-based feedback**: Save feedback as files, not chat messages

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
