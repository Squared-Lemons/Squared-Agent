---
name: new-idea
description: Discovery conversation to design and package a new project
allowed-tools: Read, Glob, Bash, Write, Task
---

# New Idea - Discovery Process

A consultative conversation to understand what the user wants to build, help them make technical decisions, and generate a complete project package for another agent to implement.

**Arguments:** $ARGUMENTS

---

## Overview

This is NOT a form. It's a natural conversation where you:
1. Understand what they want to build
2. Help them think through requirements
3. Guide platform and technology decisions
4. Generate a comprehensive project package

The output is a folder with everything a target agent needs to build version 1.

---

## Step 1: Initial Context

### Check for provided files

If `$ARGUMENTS` contains a path:
1. Read the files at that path using Read or Glob
2. Understand what they contain (designs, specs, existing code, etc.)
3. Summarize what you found to the user

### Start the conversation

Begin by asking about their idea. Don't use AskUserQuestion - just talk naturally:

"Tell me about what you want to build. What's the idea?"

Then follow up based on their response. Good follow-up questions:
- "Who is this for?"
- "What problem does it solve?"
- "What's the most important thing it needs to do?"

---

## Step 2: Discovery Conversation

### Structure the Exploration

Invoke the `superpowers:brainstorming` skill to establish a systematic exploration framework.

The skill ensures user intent is fully explored, requirements are properly extracted, and design options are considered.

Use the skill's structure to guide the discovery conversation below.

### Have a natural back-and-forth to understand:

### The Idea
- What does it do?
- Who uses it?
- What makes it valuable?

### Core vs Nice-to-have
- What MUST version 1 do?
- What can wait for later?

### Scale & Context
- Personal project, startup, or enterprise?
- How many users expected?
- Any timeline pressures?

### Platform Discussion

Based on what you learn, discuss platform options:
- "Given you need X, Y, Z... Next.js would work well because..."
- "If mobile is important, we could consider React Native..."
- "For real-time features, we'd want to think about..."

Let the user make decisions - you guide with options and tradeoffs.

---

## Step 3: Requirements Deep-Dive

Explore specifics naturally as the conversation flows:

### Authentication
- Do users need accounts?
- Social login? Email/password? Magic links?
- Roles and permissions?

### Data
- What needs to be stored?
- Real-time requirements?
- Offline support?

### UI/UX
- Web, mobile, or both?
- Design preferences?
- Existing brand guidelines?

### Integrations
- External APIs?
- Payments?
- Email/notifications?

Don't ask these as a checklist - weave them into natural conversation.

---

## Step 4: Recommend Setup

Once you understand the project, recommend what to include:

### Available Knowledge
Check what platform knowledge exist:
```bash
ls templates/knowledge/*.md 2>/dev/null | grep -v README
```

Recommend relevant ones with reasoning.

### Available Commands
Check what command guides exist:
```bash
ls templates/commands/*.md 2>/dev/null | grep -v README
```

Recommend relevant ones:
- END-SESSION-COMMAND - usually yes, for tracking progress
- New Feature Workflow - for structured development
- Others based on project needs

### Available Skills

[Agent Skills](https://agentskills.io/home) are portable capabilities that work across Claude Code, Cursor, VS Code, and more.

Check recommended skills:
```bash
cat templates/skills/skill-mapping.json 2>/dev/null
```

Recommend skills based on the chosen stack:

**For web projects (Next.js, React, etc.):**
- **frontend-design** - Production-grade UI without generic AI aesthetics
- **webapp-testing** - End-to-end web application testing
- **web-artifacts-builder** - Build interactive web components
- **theme-factory** - Generate consistent design themes

**For all projects:**
- **mcp-builder** - Create MCP servers for tool integration
- **docx/pptx/xlsx/pdf** - Document creation and editing

Explain that skills are automatically loaded by Claude Code and portable across other AI tools.

### Task Management Tools

Offer optional task management integration:

**VibeKanban** - Kanban board for AI agent orchestration
- Manages coding tasks with isolated git worktrees
- Auto-discovers recent git projects
- Creates PRs via GitHub CLI
- Runs agents autonomously

Ask: "Would you like to use VibeKanban for task management? It helps orchestrate AI agents with isolated worktrees for each task."

If yes, note to include `/vibekanban` command and setup instructions.

### Custom Needs
Note anything not covered by existing docs that should be in the project brief.

Ask user to confirm or adjust your recommendations.

---

## Step 5: Generate Package

When the user is ready (they'll say something like "looks good" or "let's do it"):

### Determine project name

Create a slugified project name from the discussion (e.g., "habit-tracker", "football-team-manager", "gym-management").

### Create output folder

All project packages go in the `outbox/` folder within Squared-Agent:

```bash
PROJECT_SLUG="[project-slug]"
OUTPUT_DIR="outbox/$PROJECT_SLUG"
mkdir -p "$OUTPUT_DIR/.claude/commands" "$OUTPUT_DIR/knowledge" "$OUTPUT_DIR/commands" "$OUTPUT_DIR/provided-files"
echo "$OUTPUT_DIR"
```

### Generate README.md (Project Specification)

Write a comprehensive project specification that serves as the new project's initial README.md. This document should be detailed enough for a target agent to understand and build the project:

```markdown
# [Project Name] - Project Specification

A comprehensive guide to the v1 prototype for [brief description].

---

## Project Overview

**Purpose:** [What the project does]

**Target Users:** [Who uses it]

**Approach:** [Technical approach - e.g., "Quick prototype using SQLite, designed for easy migration to PostgreSQL later"]

---

## V1 Scope

### Included

| Feature | Description |
|---------|-------------|
| **[Feature 1]** | [What it does] |
| **[Feature 2]** | [What it does] |
| **[Feature 3]** | [What it does] |

### Explicitly Out of Scope (v2+)

- [Feature that's NOT in v1]
- [Feature that's NOT in v1]

---

## Technical Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | [X] | [Why] |
| **Authentication** | [X] | [Why] |
| **Database** | [X] | [Why] |
| **Styling** | [X] | [Why] |
| **Deployment** | Environment-managed | Handled by deployment environments |

---

## Project Structure

\`\`\`
[project-name]/
├── [folder structure based on framework]
└── ...
\`\`\`

---

## Database Schema

### Entity Relationship

\`\`\`
[ASCII diagram of entity relationships]
\`\`\`

### Tables

[Detailed table definitions with columns, types, descriptions]

---

## Key Workflows

[Describe the main user workflows with ASCII diagrams where helpful]

---

## Authentication Flow

[Describe auth flow with diagram]

---

## [Other Relevant Sections]

[Add sections specific to this project - multi-tenancy, API structure, etc.]

---

## Package Contents

When generated, the project package includes:

\`\`\`
[project-name]/
├── .claude/
│   └── commands/       # Slash commands for development workflow
├── knowledge/          # Platform-specific guidance
├── commands/           # Workflow documentation
├── provided-files/     # Original files from user
├── PROJECT-BRIEF.md    # Full project context
├── TECHNICAL-DECISIONS.md # Technology choices
└── SETUP.md            # Instructions for target agent
\`\`\`

---

## Available Commands

After setup, these slash commands are available:

| Command | Purpose |
|---------|---------|
| \`/start-session\` | Begin session with branch safety check, load context |
| \`/new-feature\` | Create feature branch for safe development |
| \`/complete-feature\` | Merge branch or create PR when done |
| \`/clean-branches\` | Remove merged or stale branches |
| \`/commit\` | Draft commit message with approval flow |
| \`/end-session\` | Update docs, capture learnings, generate feedback, commit |
| \`/summary\` | Generate accomplishments report for time period |
| \`/local-env\` | Manage local domains and trusted HTTPS |
| \`/vibekanban\` | Launch VibeKanban for AI agent task management |

---

## Skills to Install

The target agent should install these skills:

\`\`\`bash
npx add-skill anthropics/skills -s [skill-name]
\`\`\`

| Skill | Purpose |
|-------|---------|
| **[skill]** | [Why] |

---

## Development Workflow

### Session Flow

\`\`\`
/start-session
    │
    ▼
/new-feature "[description]"
    │
    ▼
[Implement feature]
    │
    ▼
/complete-feature
    │
    ▼
/end-session
\`\`\`

### Git Workflow

- **main** branch is protected
- Create feature branches for all work
- Merge via \`/complete-feature\` (direct merge or PR)
- Clean up with \`/clean-branches\`

---

## Environment Variables

\`\`\`env
[Required environment variables]
\`\`\`

---

## Post-Setup Checklist

After the target agent builds the project:

- [ ] Project structure matches [framework] conventions
- [ ] Database schema created
- [ ] Authentication working
- [ ] [Feature 1] working
- [ ] [Feature 2] working
- [ ] CLAUDE.md created with project docs
- [ ] Build passes without errors
- [ ] Git repository initialized

---

## Future Versions (Roadmap)

### V2: [Theme]
- [Feature]
- [Feature]

### V3: [Theme]
- [Feature]

---

*Generated by Squared Agent for [Project Name].*
```

### Generate PROJECT-BRIEF.md

Write a comprehensive project brief summarizing everything discussed:

```markdown
# Project Brief: [Project Name]

## The Idea

[Detailed description of what we're building]

## Target Users

[Who is this for and what problem does it solve for them]

## Core Features (Version 1)

1. [Feature] - [Why it's essential]
2. [Feature] - [Why it's essential]
3. ...

## Future Features (Later Versions)

- [Feature] - [Why it can wait]
- ...

## Technical Decisions

### Platform: [Choice]
**Rationale:** [Why this platform was chosen]

### Authentication: [Approach]
**Rationale:** [Why this approach]

### Database: [Type/Service]
**Rationale:** [Why this choice]

### Hosting: [Suggestion]
**Rationale:** [Why this fits]

### Key Libraries
- [Library] - for [purpose]
- ...

## Data Requirements

[What data needs to be stored, relationships, etc.]

## UI/UX Notes

[Design preferences, brand guidelines, etc.]

## Integrations

[External services needed]

## Out of Scope

[Explicitly what we're NOT building in v1]

## Open Questions

[Anything that still needs to be decided during implementation]
```

### Generate TECHNICAL-DECISIONS.md

```markdown
# Technical Decisions

Quick reference for implementation decisions.

## Stack

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Platform | [X] | [Why] |
| Auth | [X] | [Why] |
| Database | [X] | [Why] |
| Hosting | [X] | [Why] |
| Styling | [X] | [Why] |

## Key Libraries

| Library | Purpose |
|---------|---------|
| [X] | [What it's for] |
| ... | ... |

## Architecture Notes

[Any important architectural decisions]

## Security Considerations

[Auth approach, data protection, etc.]
```

### Generate SETUP.md

```markdown
# Project Setup

This folder contains everything needed to build [Project Name].

## What's Included

- **README.md** - Comprehensive project specification
- **.claude/commands/** - Slash commands for development workflow
- **PROJECT-BRIEF.md** - Full project context and requirements
- **TECHNICAL-DECISIONS.md** - Technology choices with rationale
- **knowledge/** - Platform-specific guidance and patterns
- **commands/** - Workflow documentation (reference)
- **provided-files/** - Original files from the user

## Skills to Install

[List recommended skills based on project stack, or "None"]

Skills are installed during setup via `npx add-skill anthropics/skills -s [skill-name]`

## Available Commands

After opening in Claude Code, these commands are available:

| Command | Purpose |
|---------|---------|
| `/start-session` | Begin session with branch safety check |
| `/new-feature` | Create feature branch for safe development |
| `/complete-feature` | Merge or create PR when done |
| `/clean-branches` | Remove merged or stale branches |
| `/commit` | Draft commit message and commit changes |
| `/end-session` | Update docs, capture learnings, commit |
| `/summary` | Generate accomplishments report |
| `/local-env` | Manage local domains and HTTPS (init, setup, start, stop) |
| `/vibekanban` | Launch VibeKanban for AI agent task management |

## VibeKanban Integration (Optional)

If you want to use VibeKanban for AI agent task management:

### Quick Start
\`\`\`bash
# Launch VibeKanban (auto-opens in browser)
npx vibe-kanban

# Or with specific port
PORT=8080 npx vibe-kanban
\`\`\`

### What VibeKanban Does
- **Task Management**: Kanban board for coding tasks
- **Isolated Worktrees**: Each task runs in its own git worktree
- **Auto-Discovery**: Finds your recent git projects automatically
- **GitHub Integration**: Create PRs via `gh` CLI

### First Time Setup
1. Run `npx vibe-kanban`
2. Configure your coding agent preferences
3. Your project should appear (auto-discovered from recent git activity)
4. If not visible, click "Create project" to add manually

### Using with Claude Code
- Use `/vibekanban` command to launch from Claude Code
- Tasks created in VibeKanban can be worked on with isolated worktrees
- Each worktree prevents agent interference during parallel work

## For the Target Agent

Read these files in order:

1. **README.md** - Comprehensive project specification (overview, scope, tech stack, workflows)
2. **PROJECT-BRIEF.md** - Full project context and requirements
3. **TECHNICAL-DECISIONS.md** - Understand the technical approach
4. **knowledge/*.md** - Learn platform patterns and gotchas

Then:

1. Enter plan mode to design the implementation
2. Create the project structure based on platform guide
3. Implement core features from the brief
4. Set up development commands from commands/ guides
5. Create CLAUDE.md documenting the project
6. **Run build and fix any errors** until it passes
7. **Run /end-session** to generate creator feedback for the master agent

## CLAUDE.md Requirements

When creating CLAUDE.md, include these sections:

### Browser Automation (required)

\`\`\`markdown
## Browser Automation

**Default:** Use \`claude-in-chrome\` (mcp__claude-in-chrome__*) for all browser testing.

**Key tools:**
- \`tabs_context_mcp\` - Get current tabs (call first)
- \`tabs_create_mcp\` - Create new tab
- \`read_page\` - Get page structure with element refs
- \`computer\` - Click, type, screenshot
- \`navigate\` - Go to URL

**Pattern:**
1. Call \`tabs_context_mcp\` to see existing tabs
2. Create new tab with \`tabs_create_mcp\`
3. Navigate and interact
\`\`\`

## Verification Checklist

After setup, verify:
- [ ] Project structure matches platform conventions
- [ ] Core features from brief are planned
- [ ] Authentication approach implemented (if needed)
- [ ] Database schema designed
- [ ] CLAUDE.md created
- [ ] Git repository initialized
- [ ] Ready to start building features

## Final Build & Feedback

**IMPORTANT:** Before cleanup, run a full build to verify everything works:

\`\`\`bash
# Run build (adjust for your package manager)
pnpm build || npm run build || bun run build
\`\`\`

### If build errors occur

1. Read the error messages carefully
2. Fix each error systematically
3. Re-run the build until it passes
4. Document any gotchas in CLAUDE.md

### Once build passes

Run `/end-session` to generate creator feedback. This feedback helps improve the master agent for future projects by capturing:

- **Knowledge gaps** - What was missing from the guides?
- **Setup issues** - What config was unclear or missing?
- **New patterns** - What reusable code was created?
- **Technical gotchas** - What library issues were discovered?

The feedback will be displayed for you to copy back to the Squared-Agent repository's `inbox/from-projects/` folder.

## Post-Setup Cleanup

**IMPORTANT:** After the project has been successfully built and verified, consolidate all setup documentation:

\`\`\`bash
mkdir -p agent/setup
mv SETUP.md PROJECT-BRIEF.md TECHNICAL-DECISIONS.md agent/setup/
mv commands knowledge provided-files agent/setup/ 2>/dev/null || true
\`\`\`

This keeps everything version-controlled with the project:
- **agent/setup/SETUP.md** - Original setup instructions
- **agent/setup/PROJECT-BRIEF.md** - Requirements and decisions
- **agent/setup/TECHNICAL-DECISIONS.md** - Technology choices
- **agent/setup/commands/** - Workflow guides (documentation)
- **agent/setup/knowledge/** - Platform guidance
- **agent/setup/provided-files/** - Original user files

**Why this matters:**
- Project root stays clean (only CLAUDE.md, README.md, src/, etc.)
- Setup context preserved for future reference
- Original requirements documented alongside implementation

**Do this cleanup before your first commit.**
```

### Copy Files

Copy relevant knowledge:
```bash
cp "templates/knowledge/[Platform]-App-Build-Guide.md" "$OUTPUT_DIR/knowledge/"
```

Copy recommended command guides (documentation):
```bash
cp "templates/commands/[Selected].md" "$OUTPUT_DIR/commands/"
```

Copy user's provided files (if any):
```bash
# If user provided files at start
cp -r "[provided-path]"/* "$OUTPUT_DIR/provided-files/"
```

### Copy Claude Code Commands

Copy the actual command definitions so they work in the new project:
```bash
# Core workflow commands every project needs
cp ".claude/commands/start-session.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/new-feature.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/complete-feature.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/clean-branches.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/end-session.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/commit.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/summary.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/local-env.md" "$OUTPUT_DIR/.claude/commands/"

# Optional: VibeKanban (if user selected it)
cp ".claude/commands/vibekanban.md" "$OUTPUT_DIR/.claude/commands/"
```

**Important:** The start-session.md command contains Squared-Agent-specific content (Getting Started guide). After copying, edit `$OUTPUT_DIR/.claude/commands/start-session.md` to:
1. Remove or replace the "SQUARED AGENT - Getting Started" section with project-appropriate content
2. Keep the branch safety check and git status sections

Remove empty folders:
```bash
rmdir "$OUTPUT_DIR/provided-files" 2>/dev/null || true
rmdir "$OUTPUT_DIR/commands" 2>/dev/null || true
rmdir "$OUTPUT_DIR/knowledge" 2>/dev/null || true
```

---

## Step 6: Handoff

Report what was created:

```
Project package created at: outbox/[project-slug]/

Contents:
├── README.md              # Project specification (comprehensive guide)
├── .claude/
│   └── commands/          # Commands (/start-session, /new-feature, etc.)
├── PROJECT-BRIEF.md       # Full project context
├── TECHNICAL-DECISIONS.md # Technical choices
├── SETUP.md               # Instructions for target agent
├── knowledge/             # Platform guidance
├── commands/              # Workflow documentation
└── provided-files/        # Your original files (if any)

Skills to install: [list recommended skills]

To build this project:
1. Copy the folder to your projects directory
2. Open with Claude Code: cd [project-slug] && claude .
3. Tell Claude: "Read SETUP.md and build this project"

The commands (/start-session, /new-feature, /commit, etc.)
will be available immediately. Skills are installed during setup.
```

Open the folder in Finder:
```bash
open "outbox/$PROJECT_SLUG"
```

---

## Example Conversation Flow

```
User: /new-idea

Claude: Tell me about what you want to build. What's the idea?

User: I want to build a habit tracker app

Claude: Nice! Who is this for - yourself, or are you thinking of making
        it available to others?

User: For others - I want to launch it as a product

Claude: Got it. What's the core thing that makes your habit tracker
        different or valuable? There are a lot of them out there.

User: I want it to focus on streaks and social accountability -
      you can share streaks with friends

Claude: Interesting - the social angle could really help with retention.
        Let me ask a few more questions...

        [conversation continues naturally]

Claude: Based on everything we discussed, I'd recommend:
        - Next.js for the web app (good for SEO, easy deployment)
        - Better Auth for social login
        - PostgreSQL for storing habits and streaks

        I'll include our Next.js guide and the end-session command
        for tracking your progress. Sound good?

User: Yes, let's do it

Claude: [generates package]
```

---

## Key Points

- **Conversational, not transactional** - This is a discovery process
- **Guide, don't dictate** - Help user make informed decisions
- **Capture rationale** - WHY decisions were made matters
- **Comprehensive output** - Target agent should have full context
- **User files included** - Any provided files go in the package
