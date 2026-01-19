# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Squared Agent** is a master agent for bootstrapping new projects with Claude Code. It contains reusable setup profiles, development patterns, and a knowledge base that improves through feedback from spawned projects.

## Purpose

- **Bootstrap new projects** via `/prepare-setup` and `/new-idea` commands
- **Capture development patterns** in `templates/commands/` as implementation guides
- **Build knowledge base** in `templates/knowledge/` for reference during development
- **Improve continuously** through feedback in `inbox/` → proposals in `suggestions/`

## Commands

### `/start-session`
Begin session with branch awareness and context loading. Checks for protected branches (main/master/develop/release/*) and warns if on one. Shows git status, loads tool intelligence, and displays session note or getting started guide.

### `/new-feature`
Create feature branch (or worktree) for safe development. Accepts a description, generates a branch name, and offers regular branch or worktree mode for parallel work.

### `/complete-feature`
Wrap up feature branch - merge or create PR. Reviews changes, suggests squashing if many commits, then offers two options: merge directly to main (solo workflow) or create a pull request (team workflow).

### `/prepare-setup`
Prepare a setup package for a new project. Asks for profile, commands, tasks, and knowledge to include, then creates a temp folder with all files and a SETUP.md guide.

### `/end-session`
End coding session - updates docs, captures learnings, generates SETUP.md handoff document, auto-generates creator feedback for user to copy back to master agent, and commits changes with approval.

### `/commit`
Draft a commit message, get approval, then commit changes.

### `/summary`
Generate an accomplishments summary for a time period. Analyzes git commits and session logs, categorizes by type (features, fixes, refactors, etc.), and produces a copy-paste ready report.

### `/new-idea`
Consultative discovery conversation to design a new project. Discuss requirements, platform, and technical decisions together, then generate a comprehensive package (PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md, SETUP.md) for the target agent to build v1.

### `/how-to-use`
Display the human-editable guide for using this agent. Content lives at `docs/how-to-use.md` so users can add their own tips and notes.

### `/get-feedback`
Process feedback from the inbox and implement improvements. Scans `inbox/ideas/` and `inbox/from-projects/`, presents summaries, helps discuss and plan implementation, then guides through making and testing changes.

### `/sync-templates`
Sync active commands to template files for spawned projects. Compares `.claude/commands/` with `templates/commands/`, detects drift, and updates template code blocks while preserving prose. Supports `--audit` (report only) and `--background` (silent) modes. Integrates with `/start-session`, `/end-session`, and `/complete-feature`. See [Template Sync Workflow](docs/template-sync-workflow.md) for the full "evolve then deploy" pattern.

### `/sync-docs`
Synchronize documentation across related files for consistency. Checks docs against style guide patterns (`docs/style-guide.md`), identifies terminology/formatting issues, and propagates changes. Supports `--audit` (report only) and `--scope [area]` (readme, commands, knowledge, skills) modes.

### `/add-skill`
Install a skill and catalogue it for spawned projects. Runs `npx add-skill [source]`, categorizes newly installed skills by knowledge category (web, database, auth, monorepo, patterns), copies to `templates/skills/`, and updates skill-mapping.json. Default source is `anthropics/skills`. See [agentskills.io](https://agentskills.io/home) for the open standard.

## Available Content

### Templates (`templates/`)

Content that gets copied to new projects:

#### Command Guides (`templates/commands/`)
- **Start-Session-Command.md** - Branch-aware session entry with context loading
- **New-Feature-Command.md** - Safe feature branch or worktree creation
- **Complete-Feature-Command.md** - Branch completion via merge or PR
- **END-SESSION-COMMAND.md** - End-session workflow with creator feedback loop
- **Summary-Command.md** - Accomplishments summary from git history and session logs
- **New Feature Workflow.md** - Feature development with Feature-Dev and Ralph Loop
- **New-Idea-Workflow.md** - Consultative discovery process for new projects

#### Workflows (`templates/workflows/`)
- **Session-Git-Workflow.md** - The core git workflow this agent uses and passes to spawned projects

#### UX Guides (`templates/ux-guides/`)
- **Canvas-Panel-Navigation-System.md** - React UI pattern for horizontal navigation

#### Knowledge (`templates/knowledge/`)
- **Next.js-App-Build-Guide.md** - Next.js + Better Auth + Drizzle + Turborepo patterns

#### Skills (`templates/skills/`)
[Agent Skills](https://agentskills.io/home) - an open standard (originally by Anthropic) for portable agent capabilities. Skills work across Claude Code, Cursor, VS Code, Gemini CLI, and more.
- **skill-mapping.json** - Maps skills to knowledge categories and lists recommended skills
- **[skill-name]/SKILL.md** - Individual skill definitions (installed via `/add-skill`)

Recommended skills (frontend-design, webapp-testing, mcp-builder, docx, pptx, xlsx, pdf) are automatically included in spawned projects based on selected knowledge categories.

#### Setup Profiles (`templates/profiles/`)
- **developer/** - Full developer workflow with plugins, commands, and session management

#### Tasks (`templates/tasks/`)
- **ExistingProject-Investigate.md** - Analyze existing codebase and generate documentation

### Inbox (`inbox/`)

Raw input for improvements:
- **ideas/** - Your ideas to discuss
- **from-projects/** - Feedback from spawned projects

### Suggestions (`suggestions/`)

My proposals for improvements, organized by category:
- **knowledge/** - Proposed new knowledge guides
- **commands/** - Proposed command improvements
- **workflow/** - Proposed workflow changes
- **other/** - Miscellaneous improvements

## Development Workflow

When making changes to this project:

1. **Make changes** - Edit files as needed
2. **Verify** - Run any relevant checks (this is a docs-heavy project, so mainly review for consistency)
3. **Test generated output** - If changing setup templates, test with `/prepare-setup`
4. **Update docs** - Keep CLAUDE.md and README.md in sync with changes
5. **Commit** - Use `/commit` or `/end-session` to commit with proper message

### Branch Protection Rule

**IMPORTANT**: Before making any file edits, code generation, or git commits:

1. Check current branch: `git branch --show-current`
2. If on main, master, develop, or release/*:
   - **STOP immediately** - do not make changes
   - Tell the user:
     ```
     STOPPED: You're on [branch] (protected).
     Direct changes here are not allowed to keep the codebase safe.

     To start safe work:
     → /new-feature "short-description"
     → Or: git checkout -b feature/your-name
     ```
3. On feature branches: proceed normally

This teaches good git habits and prevents accidental commits to protected branches.

### Key Principles

- **Give Claude verification** - Always provide a way to verify work (tests, typecheck, lint)
- **Start in Plan Mode** - For complex tasks, use Plan Mode first (shift+tab twice)
- **Update CLAUDE.md** - When Claude does something wrong, add a rule to prevent it

## Tool Intelligence

The agent learns which tools work best for which tasks, evolving with each session.

**Location**: `.project/tool-intelligence.md` (gitignored - personal to each user)
**Updated by**: `/end-session` captures tools used and patterns learned
**Loaded by**: `/start-session` reads preferences at session start

**What it tracks**:
- Toolhive MCP shortcuts (GitHub, Perplexity, FireCrawl, ShadCN, etc.)
- Plugin usage patterns (/feature-dev, /ralph-loop, /frontend-design)
- Browser automation tips (claude-in-chrome patterns)
- Core tool efficiency (Task agents vs direct tools)

This enables the agent to select appropriate tools automatically without explicit instruction.

## Browser Automation

**Default:** Use `claude-in-chrome` (mcp__claude-in-chrome__*) for all browser testing and automation.

**Why chrome over Playwright:**
- Real browser with user's actual session/cookies
- Works with authenticated sites without re-login
- Visual feedback in actual Chrome window
- Better for testing against real user state

**Key tools:**
- `tabs_context_mcp` - Get current tabs (call first)
- `tabs_create_mcp` - Create new tab
- `read_page` - Get page structure with element refs
- `computer` - Click, type, screenshot
- `navigate` - Go to URL

**Pattern:**
1. Call `tabs_context_mcp` to see existing tabs
2. Create new tab with `tabs_create_mcp` (don't reuse existing)
3. Navigate and interact

## Token Usage Tracking

Session-level token tracking for cost estimation and optimization.

**Location**: `.project/token-usage.md` (gitignored - personal to each user)
**Updated by**: `/end-session` extracts token data from Claude Code session files
**Reported by**: `/summary` calculates costs at report time using current pricing

**Data source**: Claude Code stores session data in `~/.claude/projects/<project-path>/<session-id>.jsonl`. Each assistant message includes usage metrics (input/output tokens, cache reads/writes).

**What it tracks** (raw tokens only, no pre-calculated costs):
- Input tokens (raw prompts)
- Output tokens (model responses)
- Cache read tokens (previously cached context)
- Cache creation tokens (new cache entries)
- Billing type (`subscription` or `api`)
- Turns per session

**Subscription limits** (user-configured in `.project/token-usage.md`):
- Daily token limit
- Hourly token limit

**Billing types**:
- **subscription**: Interactive Claude Code sessions (covered by monthly plan, tracked against limits)
- **api**: Background agents, automated tasks, programmatic API calls (charged per token)

**Cost/limit calculation** (at report time):
- Subscription: Usage vs configured daily/hourly limits, % utilization, tier assessment
- API: `(input × $15 + output × $75 + cache_read × $1.50 + cache_creation × $18.75) / 1,000,000`

This enables users to:
- Track subscription usage against plan limits
- Assess if subscription tier is appropriate
- Estimate API costs for background agents
- Identify token-heavy sessions for optimization
- Monitor cache efficiency

## Project Structure

```
templates/          # Content copied to new projects
  workflows/        # Development processes (Session-Git-Workflow)
  commands/         # Command implementation guides
  knowledge/        # Framework guides (Next.js, etc.)
  skills/           # Skills (Vercel agent-skills)
  ux-guides/        # UI/UX patterns
  profiles/         # Setup profiles (developer/, etc.)
  tasks/            # One-time setup tasks
inbox/              # Ideas and feedback for improvements
  from-projects/    # Feedback from spawned projects
  ideas/            # Your ideas to discuss
suggestions/        # My proposals (categorized)
  knowledge/        # Proposed new knowledge guides
  commands/         # Proposed command improvements
  workflow/         # Proposed workflow changes
  other/            # Miscellaneous improvements
docs/               # Internal documentation
  style-guide.md    # Writing voice, terminology, formatting rules
  doc-patterns/     # Templates for README, command, knowledge docs
.claude/            # Claude Code configuration
  commands/         # Active commands
.project/           # Local data (gitignored)
  sessions/         # Session logs by date
  tool-intelligence.md  # Learned tool preferences
  token-usage.md    # Cumulative token stats and cost tracking
CLAUDE.md           # My instructions
LEARNINGS.md        # Session insights → feeds suggestions/
```

## Recent Changes

- **2026-01-19:** Added `/sync-docs` command for documentation consistency; created `docs/style-guide.md` (voice, terminology, formatting rules) and `docs/doc-patterns/` (templates for README, command, knowledge docs); enables systematic documentation maintenance across all files
- **2026-01-19:** Integrated Agent Skills ([agentskills.io](https://agentskills.io/home)) - open standard for portable agent capabilities; added `/add-skill` command (default: `anthropics/skills`); documented recommended skills (frontend-design, webapp-testing, mcp-builder, docx, pptx, xlsx, pdf); skills auto-deploy to spawned projects based on knowledge categories; works across Claude Code, Cursor, VS Code, Gemini CLI
- **2026-01-18:** Reorganized knowledge into category folders for mix-and-match selection: `web/nextjs/`, `database/drizzle/`, `auth/better-auth/`, `monorepo/turborepo/`, `patterns/`; enables `/prepare-setup` to ask per-category (Web framework? Database? Auth? Monorepo? Patterns?); split guides can be combined independently for any project type
- **2026-01-18:** Added `docs/template-sync-workflow.md` explaining the "evolve then deploy" pattern; linked from README.md and CLAUDE.md; documents how the master agent acts as a staging environment for command improvements before propagating to spawned projects
- **2026-01-17:** Added `/sync-templates` command for keeping templates in sync with active commands; detects drift between `.claude/commands/` and `templates/commands/`, auto-updates code blocks while preserving prose; integrates with `/start-session` (background audit), `/end-session` and `/complete-feature` (sync prompts); supports `--audit` and `--background` modes
- **2026-01-17:** Added post-setup cleanup step to `/new-idea` workflow - after project is built and verified, setup files (SETUP.md, PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md, commands/, knowledge/, provided-files/) are moved into `agent/setup/` within the project for version control and clean parent directory
- **2026-01-17:** README polish and template README updates - renamed "Creating Setup Packages" to "Agent Packages"; added Token Tracking section after Tools & Integrations; updated templates/commands/README.md with token extraction step in END-SESSION-COMMAND; added Token Tracking component to templates/workflows/README.md Session-Git-Workflow description
- **2026-01-16:** Token tracking in template builder - spawned projects now inherit token tracking by default; updated Session-Git-Workflow.md with Token Tracking section and principle #7; updated developer profile SETUP-INSTRUCTIONS.md to create `.project/token-usage.md` and gitignore full `.project/`; README improvements: added "No cost visibility" to problem statement, token tracking mention under Session Git Workflow, "Bringing the Agent into Existing Projects" section for existing codebases, renamed "What Your Projects Inherit" to "Projects That Follow Your Best Practices"
- **2026-01-16:** Token usage tracking for cost estimation - `/end-session` extracts raw token data from Claude Code session files and logs to `.project/token-usage.md` with billing type (`subscription` vs `api`); `/summary` calculates costs at report time and tracks subscription usage against configurable daily/hourly limits for tier assessment; supports future background agents via API billing type
- **2026-01-16:** Marketing-quality README rewrite - added hero section, problem statement, "What Your Projects Inherit" split, comprehensive Tool Intelligence diagram with session logs and /summary reporting; created `templates/workflows/` folder with Session-Git-Workflow; linked README hierarchy through templates/ folder READMEs; merged docs/templates.md into templates/README.md; added developer profile README
- **2026-01-16:** Added Session Git Workflow template - comprehensive knowledge guide (`templates/knowledge/Session-Git-Workflow.md`) + command guides for start-session, new-feature, complete-feature; updated END-SESSION-COMMAND.md with session note handoff; enables new projects to inherit disciplined git workflow
- **2026-01-16:** Added `/how-to-use`, `/get-feedback`, `/list-tools` commands; renamed `/list` to `/list-tools`; renamed `templates/skills/` to `templates/knowledge/`; created `templates/ux-guides/` for UI patterns; added `docs/workflow.md` and `docs/how-to-use.md`; converted README diagrams to Mermaid
- **2026-01-16:** Implemented Session Git Workflow - `/start-session` replaces `/catch-up` with branch awareness; `/new-feature` creates feature branch or worktree; `/complete-feature` wraps up and creates PR; added Branch Protection Rule to enforce good git habits
- **2026-01-16:** Added Tool Intelligence system - tracks tool usage patterns across sessions; `/end-session` updates `.project/tool-intelligence.md` with learned shortcuts; `/start-session` loads preferences at session start; enables proactive tool selection
- **2026-01-16:** Reorganized folder structure - `templates/` for exportable content, `inbox/` for ideas and feedback, `suggestions/` for agent proposals; renamed `setups/` to `templates/profiles/`
- **2026-01-13:** Added `/summary` command - generates accomplishments summary from git commits and session logs; categorizes by type (features, fixes, refactors, etc.); copy-paste ready output
- **2026-01-13:** Enhanced `/new-idea` to be a consultative discovery conversation - discuss requirements, platform, technical decisions together; generates PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md with full context; supports user-provided files
- **2026-01-13:** Restructured README with minimal approach - Quick Start, workflow diagram, links to docs/; moved details to docs/commands.md, docs/plugins.md, docs/content.md, docs/feedback.md
- **2026-01-13:** Added `/new-idea` command - creates setup package for new app ideas with platform selection, idea description baked into SETUP.md, and command guides; target agent enters plan mode when setup runs
- **2026-01-13:** Added Boris Cherny's Claude Code best practices - PostToolUse hooks for auto-formatting, pre-configured permissions for safe commands, .claude/agents/ pattern, Development Workflow section, Plan Mode and verification emphasis
- **2026-01-12:** Standardized project structure - lowercase folder names (commands/, tasks/), fixed typo in ExistingProject-Investigate.md, added CONTRIBUTING.md, enhanced all READMEs with "How to Extend" sections
- **2026-01-12:** Integrated creator feedback - enhanced Next.js skill with Better Auth gotchas, handoff template, DX checklist; added SETUP.md auto-generation and auto-generated creator feedback to session-end; added Plugins section to README
- **2026-01-12:** Updated README and CLAUDE.md to reflect new purpose as master agent for project bootstrapping
- **2026-01-12:** Auto-organize docs into `docs/` on setup completion; copy-paste friendly creator feedback display
- **2026-01-12:** Enhanced `/prepare-setup` with commands and knowledge selection; added creator feedback loop to `/end-session`
- **2026-01-12:** Added `knowledge/` base with Next.js App Build Guide
- **2026-01-12:** Added `/prepare-setup` command for bootstrapping new projects with setup profiles, commands, and tasks
- **2026-01-12:** Added New Feature Workflow pattern and setups/tasks structure
- **2026-01-11:** Initial project setup - created README.md, configured commands, established documentation structure
