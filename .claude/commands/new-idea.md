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

### Custom Needs
Note anything not covered by existing docs that should be in the project brief.

Ask user to confirm or adjust your recommendations.

---

## Step 5: Generate Package

When the user is ready (they'll say something like "looks good" or "let's do it"):

### Create output folder

```bash
OUTPUT_DIR="/tmp/new-idea-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR/knowledge" "$OUTPUT_DIR/commands" "$OUTPUT_DIR/provided-files"
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

- **PROJECT-BRIEF.md** - Full project context and requirements
- **TECHNICAL-DECISIONS.md** - Technology choices with rationale
- **knowledge/** - Platform-specific guidance and patterns
- **commands/** - Development workflow guides
- **provided-files/** - Original files from the user

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

## Verification Checklist

After setup, verify:
- [ ] Project structure matches platform conventions
- [ ] Core features from brief are planned
- [ ] Authentication approach implemented (if needed)
- [ ] Database schema designed
- [ ] CLAUDE.md created
- [ ] Git repository initialized
- [ ] Ready to start building features
```

### Copy Files

Copy relevant knowledge:
```bash
cp "templates/knowledge/[Platform]-App-Build-Guide.md" "$OUTPUT_DIR/knowledge/"
```

Copy recommended commands:
```bash
cp "templates/commands/[Selected].md" "$OUTPUT_DIR/commands/"
```

Copy user's provided files (if any):
```bash
# If user provided files at start
cp -r "[provided-path]"/* "$OUTPUT_DIR/provided-files/"
```

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
Project package created at: [OUTPUT_DIR]

Contents:
├── PROJECT-BRIEF.md       # Full project context
├── TECHNICAL-DECISIONS.md # Technical choices
├── SETUP.md               # Instructions for target agent
├── knowledge/                # Platform guidance
├── commands/              # Workflow guides
└── provided-files/        # Your original files (if any)

To build this project:
1. Copy this folder to a new project directory
2. Open with Claude Code: claude .
3. Tell Claude: "Read SETUP.md and build this project"

The target agent will read all context, enter plan mode,
and build version 1 following our practices.
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
