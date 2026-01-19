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

Have a natural back-and-forth to understand:

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

### Custom Needs
Note anything not covered by existing docs that should be in the project brief.

Ask user to confirm or adjust your recommendations.

---

## Step 5: Generate Package

When the user is ready (they'll say something like "looks good" or "let's do it"):

### Choose save location

First, determine a slugified project name from the discussion (e.g., "habit-tracker", "football-team-manager").

Then ask where to save via macOS folder picker:

```bash
# Ask user where to save via macOS folder picker
SELECTED_FOLDER=$(osascript -e 'tell application "System Events" to choose folder with prompt "Choose where to save the project package:"' 2>/dev/null | sed 's/alias //' | sed 's/:/\//g' | sed 's/^/\//')

if [ -n "$SELECTED_FOLDER" ] && [ "$SELECTED_FOLDER" != "/" ]; then
    echo "SELECTED:$SELECTED_FOLDER"
else
    echo "CANCELLED"
fi
```

Based on the result:
- If **SELECTED**, use: `OUTPUT_DIR="$SELECTED_FOLDER/[project-slug]"` (e.g., `~/Projects/habit-tracker`)
- If **CANCELLED**, fall back to: `OUTPUT_DIR="/tmp/[project-slug]"` (e.g., `/tmp/habit-tracker`)

### Create output folder

```bash
OUTPUT_DIR="[chosen-path]/[project-slug]"
mkdir -p "$OUTPUT_DIR/.claude/commands" "$OUTPUT_DIR/knowledge" "$OUTPUT_DIR/commands" "$OUTPUT_DIR/provided-files"
echo "$OUTPUT_DIR"
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
| `/commit` | Draft commit message and commit changes |
| `/end-session` | Update docs, capture learnings, commit |
| `/summary` | Generate accomplishments report |

## For the Target Agent

Read these files in order:

1. **PROJECT-BRIEF.md** - Understand what we're building and why
2. **TECHNICAL-DECISIONS.md** - Understand the technical approach
3. **knowledge/*.md** - Learn platform patterns and gotchas

Then:

1. Enter plan mode to design the implementation
2. Create the project structure based on platform guide
3. Implement core features from the brief
4. Set up development commands from commands/ guides
5. Create CLAUDE.md documenting the project

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

## Post-Setup Cleanup

After the project has been successfully built and verified, consolidate all setup documentation into the project:

\`\`\`bash
mkdir -p agent/setup
mv ../SETUP.md ../PROJECT-BRIEF.md ../TECHNICAL-DECISIONS.md agent/setup/
mv ../commands ../knowledge ../provided-files agent/setup/ 2>/dev/null || true
\`\`\`

This keeps everything version-controlled with the project:
- **agent/setup/SETUP.md** - Original setup instructions
- **agent/setup/PROJECT-BRIEF.md** - Requirements and decisions
- **agent/setup/TECHNICAL-DECISIONS.md** - Technology choices
- **agent/setup/commands/** - Workflow guides
- **agent/setup/knowledge/** - Platform guidance
- **agent/setup/provided-files/** - Original user files

Benefits:
- Future sessions can reference requirements without external files
- Parent directory stays clean for new projects
- Original intent is documented alongside implementation
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
cp ".claude/commands/end-session.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/commit.md" "$OUTPUT_DIR/.claude/commands/"
cp ".claude/commands/summary.md" "$OUTPUT_DIR/.claude/commands/"
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

Report what was created, noting the save location:

**If user chose a custom location:**
```
Project package created at: [OUTPUT_DIR]

(Saved to your chosen location)
```

**If fell back to /tmp:**
```
Project package created at: [OUTPUT_DIR]

(Saved to temporary folder - move it somewhere permanent before rebooting)
```

Then show the contents:
```
Contents:
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
1. Open with Claude Code: cd [OUTPUT_DIR] && claude .
2. Tell Claude: "Read SETUP.md and build this project"

The commands (/start-session, /new-feature, /commit, etc.)
will be available immediately. Skills are installed during setup.
```

Open the folder:
```bash
open "$OUTPUT_DIR"
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
