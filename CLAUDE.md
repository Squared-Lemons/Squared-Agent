# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Squared Agent** is a master agent for bootstrapping new projects with Claude Code. It contains reusable setup profiles, development patterns, and a knowledge base that improves through feedback from spawned projects.

## Purpose

- **Bootstrap new projects** via `/prepare-setup` and `/new-idea` commands
- **Capture development patterns** in `templates/commands/` as implementation guides
- **Build knowledge base** in `templates/knowledge/` for reference during development
- **Improve continuously** through feedback in `inbox/` → proposals in `suggestions/`
- **Build and publish tools** via npm packages in `packages/`

## Monorepo Development

This is a hybrid documentation hub + development monorepo. Publishable npm packages live in `packages/`, applications in `apps/`.

### Quick Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm dev              # Watch mode for all packages
pnpm type-check       # Type check all packages
pnpm changeset        # Create a changeset for publishing
pnpm version-packages # Version based on changesets
pnpm publish-packages # Publish to npm
```

### Working with Specific Packages

```bash
pnpm --filter @squared-agent/core build    # Build specific package
pnpm --filter @squared-agent/cli dev       # Dev mode for CLI
```

### Packages

| Package | npm Name | Purpose |
|---------|----------|---------|
| `packages/core/` | `@squared-agent/core` | Shared utilities, types, constants |
| `packages/cli/` | `@squared-agent/cli` | CLI tool for project bootstrapping |
| `packages/create-project/` | `create-squared-agent` | `npm create squared-agent` scaffolding |

### Apps

| App | Location | Purpose |
|-----|----------|---------|
| **Dashboard** | `apps/web/dashboard/` | View work summaries and session costs across projects |

Run with: `pnpm --filter @squared-agent/dashboard dev`

### App Categories

| Folder | Purpose |
|--------|---------|
| `apps/web/` | Web applications (dashboards, admin panels, docs sites) |
| `apps/api/` | API services (REST, GraphQL, tRPC) |
| `apps/workers/` | Background workers (queues, cron, event handlers) |
| `apps/ai/` | AI applications (agents, pipelines, model runners) |

### Publishing Workflow

1. Make changes to packages
2. Run `pnpm changeset` to create a changeset describing changes
3. Commit the changeset with your changes
4. Run `pnpm version-packages` to bump versions
5. Run `pnpm publish-packages` to publish to npm

## Commands

### `/start-session`
Begin session with branch awareness and context loading. Checks for protected branches (main/master/develop/release/*) and warns if on one. Shows git status, loads tool intelligence, checks for updates from master agent (spawned projects), and displays session note or getting started guide.

### `/new-feature`
Create feature branch (or worktree) for safe development. Accepts a description, generates a branch name, and offers regular branch or worktree mode for parallel work.

### `/complete-feature`
Wrap up feature branch - merge or create PR. Reviews changes, suggests squashing if many commits, then offers two options: merge directly to main (solo workflow) or create a pull request (team workflow).

### `/clean-branches`
Remove merged or stale feature branches. Finds branches merged into main and branches whose remote tracking is gone, previews them, and safely deletes selected branches. Protects main, master, develop, release/*, current branch, and worktree branches.

### `/prepare-setup`
Prepare a setup package for a new project. Asks for profile, commands, tasks, and knowledge to include, then creates a temp folder with all files and a SETUP.md guide.

### `/end-session`
End coding session - updates docs, captures learnings, generates SETUP.md handoff document, auto-generates creator feedback for user to copy back to master agent, exports update package for spawned projects (master agent only), and commits changes with approval.

### `/commit`
Draft a commit message, get approval, then commit changes.

### `/summary`
Generate an accomplishments summary for a time period. Analyzes git commits and session logs, categorizes by type (features, fixes, refactors, etc.), and produces a copy-paste ready report.

### `/new-idea`
Consultative discovery conversation to design a new project. Discuss requirements, platform, and technical decisions together, then generate a comprehensive package to `outbox/[project-slug]/` including README.md (project specification), PROJECT-BRIEF.md, TECHNICAL-DECISIONS.md, SETUP.md, and workflow commands. The folder opens automatically in Finder when complete.

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

### `/local-env`
Manage local development environment with friendly domains and trusted HTTPS. Subcommands: `init` (first-time machine setup with mkcert, certs, proxy), `setup` (configure project domain and port range), `start`/`stop` (proxy control), `status` (show config), `list` (all registered projects). Uses mkcert for trusted certificates and Caddy or Node proxy for reverse proxying. Stores config in `~/.squared-agent/` with per-project settings in `.project/local-env.json`.

### `/creator-feedback`
Generate feedback to send back to the master agent. Analyzes the current session to identify knowledge gaps, setup issues, new patterns, and technical gotchas. Writes structured feedback to `outbox/creator-feedback-YYYY-MM-DD.md`. If file exists, offers append/replace/skip options.

### `/vibekanban`
Launch VibeKanban for AI agent task management. VibeKanban is a kanban board designed for orchestrating autonomous AI coding agents with isolated git worktrees. Auto-discovers recent git projects, supports GitHub CLI for PR creation, and runs agents with autonomous permissions. Accepts optional port argument (e.g., `/vibekanban 8080`).

## Available Content

### Templates (`templates/`)

Content that gets copied to new projects:

#### Command Guides (`templates/commands/`)
- **Start-Session-Command.md** - Branch-aware session entry with context loading
- **New-Feature-Command.md** - Safe feature branch or worktree creation
- **Complete-Feature-Command.md** - Branch completion via merge or PR
- **Clean-Branches-Command.md** - Remove merged or stale branches
- **END-SESSION-COMMAND.md** - End-session workflow with creator feedback loop
- **Summary-Command.md** - Accomplishments summary from git history and session logs
- **Local-Env-Command.md** - Local environment management (domains, HTTPS, proxy)
- **Creator-Feedback-Command.md** - Generate feedback to send to master agent
- **VibeKanban-Command.md** - AI agent task management with isolated worktrees
- **New Feature Workflow.md** - Feature development with Feature-Dev and Ralph Loop
- **New-Idea-Workflow.md** - Consultative discovery process for new projects

#### Workflows (`templates/workflows/`)
- **Session-Git-Workflow.md** - The core git workflow this agent uses and passes to spawned projects

#### UX Guides (`templates/ux-guides/`)
- **Canvas-Panel-Navigation-System.md** - React UI pattern for horizontal navigation

#### Knowledge (`templates/knowledge/`)
- **Next.js-App-Build-Guide.md** - Next.js + Better Auth + Drizzle + Turborepo patterns
- **local-env/** - Local development environment setup (mkcert, Caddy, domains)

#### Skills (`templates/skills/`)
[Agent Skills](https://agentskills.io/home) - an open standard (originally by Anthropic) for portable agent capabilities. Skills work across Claude Code, Cursor, VS Code, Gemini CLI, and more.
- **skill-mapping.json** - Maps skills to knowledge categories and lists recommended skills
- **[skill-name]/SKILL.md** - Individual skill definitions (installed via `/add-skill`)

Recommended skills (frontend-design, webapp-testing, turborepo, mcp-builder, docx, pptx, xlsx, pdf) are automatically included in spawned projects based on selected knowledge categories.

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

### Adding New Commands

When adding a command that spawned projects should inherit, follow this checklist:

| Step | File(s) to Update | Purpose |
|------|-------------------|---------|
| 1. Create command | `.claude/commands/[name].md` | The actual executable command |
| 2. Create template guide | `templates/commands/[Name]-Command.md` | Documentation for `/prepare-setup` |
| 3. Update `/new-idea` | `.claude/commands/new-idea.md` | Add to copy list so spawned projects get it |
| 4. Update setup instructions | `templates/profiles/developer/SETUP-INSTRUCTIONS.md` | List in commands table |
| 5. Add knowledge (if relevant) | `templates/knowledge/[category]/` | Reference docs for the feature |
| 6. Update CLAUDE.md | `CLAUDE.md` | Document the new command |

**Why this matters:** Commands created in this agent but not added to the propagation paths won't reach spawned projects. The `/local-env` command was missing from steps 3-4, causing it not to appear in new projects.

**Propagation paths:**
- `/new-idea` → copies `.claude/commands/*.md` files directly to spawned projects
- `/prepare-setup` → copies `templates/commands/*.md` guides, target agent creates commands from guides

### Update Propagation Workflow

Updates to commands and knowledge can be pushed to spawned projects through the integrated session workflow:

```
MASTER AGENT                          SPAWNED PROJECT
────────────                          ───────────────

/start-session                        /start-session
  └─ Shows git status                   └─ Checks inbox/updates/
  └─ Loads context                      └─ Offers to apply updates
                                        └─ Shows git status
     │
     ▼

  WORK ON FEATURE
  - Edit .claude/commands/
  - Edit templates/knowledge/
  - Test locally

     │
     ▼

/end-session                          /end-session
  └─ Update docs                        └─ Generate feedback
  └─ Sync templates (auto)              └─ Commit
  └─ Export update package
  └─ Commit
```

**How it works:**

1. **Master agent creates updates**: When `/end-session` detects changes to commands or knowledge, it offers to export an update package to `/tmp/squared-agent-update-YYYY-MM-DD.md`

2. **User delivers updates**: Copy the update file to the spawned project's `inbox/updates/` folder

3. **Spawned project applies updates**: When `/start-session` runs, it detects the update file and offers to apply it automatically

**Update package contents:**
- What's new (commands, knowledge, skills)
- Full file contents in collapsible sections
- Step-by-step application instructions

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

**Known Issues:**
- Intermittent "Cannot access chrome-extension:// URL" errors during click/screenshot actions
- Form inputs and navigation work reliably
- Workaround: Retry failed actions or use alternative interaction methods (e.g., `form_input` instead of click + type)

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
apps/               # Full applications
  web/
    dashboard/      # Work summary & session costs viewer
  api/              # API services (placeholder)
  workers/          # Background workers (placeholder)
  ai/               # AI apps (placeholder)
packages/           # Publishable npm packages
  core/             # @squared-agent/core - shared utilities
  cli/              # @squared-agent/cli - CLI tool
  create-project/   # create-squared-agent - npm create
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
outbox/             # Generated project packages (from /new-idea)
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

- **2026-01-24:** Lean into community skills for spawned projects - added Turborepo skill to `skill-mapping.json` with monorepo category; slimmed `Turborepo-Monorepo-Setup.md` from 256→146 lines (quick-start format); fixed factual issues (turbo run, per-package .env instead of root symlinks); updated `/prepare-setup` and `/new-idea` to recommend turborepo skill for monorepo projects; added Step 4 (Install Recommended Skills) to developer profile SETUP-INSTRUCTIONS.md; aligned all documentation (README, CLAUDE.md, templates/README, knowledge/README, skills/README) with new skill structure; added "Release reporting pain" to README problem statement
- **2026-01-23:** Added work summary dashboard - `apps/web/dashboard/` with Vite + React + Tremor for viewing session costs and work summaries across multiple projects; reads `.project/token-usage.md` and `.project/sessions/` files; local Hono API server for file parsing; added monorepo structure with pnpm + Turborepo + Changesets; created `packages/core`, `packages/cli`, `packages/create-project`; updated pnpm-workspace.yaml to support nested apps
- **2026-01-22:** Integrated community skills into 7 commands - `/new-feature` uses `superpowers:using-git-worktrees`; `/complete-feature` uses `superpowers:finishing-a-development-branch`; `/new-idea` uses `superpowers:brainstorming`; `/get-feedback` uses `superpowers:brainstorming` + `superpowers:writing-plans`; `/end-session` uses `claude-md-management:revise-claude-md` + `superpowers:verification-before-completion`; `/commit` simplified to use `commit-commands:commit`; `/clean-branches` uses `commit-commands:clean_gone` for gone branch detection
- **2026-01-20:** Added VibeKanban integration - `/vibekanban` command for launching VibeKanban AI agent task management; added to `/new-idea` as optional tool for spawned projects; created VibeKanban-Command.md template; synced Start-Session template with "(spawned projects only)" clarification
- **2026-01-20:** Gym Master feedback part 2 - Added .env.example template to developer profile; useSearchParams Suspense gotcha in Next.js guide; session helper pattern (getSessionWithOrg); MVP patterns (QR code as data URL); bidirectional agent communication (inbox/outbox); `/creator-feedback` command for generating feedback to master agent
- **2026-01-20:** Processed Gym Master feedback - Next.js 16 proxy migration (middleware.ts→proxy.ts), Better Auth navigation gotcha (use window.location.href after auth changes), Turbopack default docs, browser automation known issues
- **2026-01-20:** Enhanced `/new-idea` output - now generates README.md as comprehensive project specification; outputs to `outbox/[project-slug]/` instead of folder picker; auto-opens folder in Finder; updated New-Idea-Workflow.md template; generated gym-management project package as first example
- **2026-01-20:** Integrated update propagation workflow - `/start-session` checks `inbox/updates/` for updates from master agent (spawned projects); `/end-session` exports update packages for spawned projects (master agent); fixed post-setup cleanup paths in `/new-idea`; added project structure diagrams to README Agent Packages section
- **2026-01-19:** Enhanced Next.js App Build Guide with performance patterns from installed skills - added Performance Patterns (Critical) section covering waterfalls, bundle size, server-side caching, Suspense boundaries; added UI/UX Checklist with accessibility, forms, performance, responsive checks; added Skills for Deeper Learning section referencing vercel-react-best-practices, web-design-guidelines, frontend-design
- **2026-01-19:** Added `/local-env` command for local development environments - friendly domains (`*.local`), trusted HTTPS via mkcert, automatic port range allocation (50 ports per project), Caddy or Node reverse proxy; stores config in `~/.squared-agent/` (global registry, certs, Caddyfile) and `.project/local-env.json` (per-project); subcommands: init, setup, start, stop, status, list
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
