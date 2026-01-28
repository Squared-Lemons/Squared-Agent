# Spawn Project Workflow

A unified project creation process that offers discovery conversation or template selection.

## Overview

`/spawn-project` provides two paths to create new projects:

1. **Discuss & Design** — Discovery conversation leading to a comprehensive project package
2. **Use Template** — Select from existing profiles, knowledge, and commands

The output is everything a target agent needs to build version 1.

### Two-Stage Ideation

For vague ideas, use the two-stage workflow:

| Stage | Command | Purpose |
|-------|---------|---------|
| 1 | `/discuss` | Explore vague ideas, capture thoughts |
| 2 | `/spawn-project` | Specify and generate project package |

`/spawn-project` automatically detects discussions in `outbox/discussions/` and offers to continue from them.

---

## The Process

```
/spawn-project [optional: path to files]
         │
         ▼
┌─────────────────────────────────────┐
│  CHECK FOR DISCUSSIONS              │
│                                     │
│  • Scan outbox/discussions/         │
│  • List available discussions       │
│  • Offer to continue or start fresh │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  CHOOSE FLOW                        │
│                                     │
│  1. Discuss & Design (discovery)    │
│  2. Use Template (selection)        │
└─────────────────────────────────────┘
         │
         ▼ (if Discuss & Design)
┌─────────────────────────────────────┐
│  DISCOVERY CONVERSATION             │
│  (skips topics from discussion)     │
│                                     │
│  • Understand the idea              │
│  • Who is it for?                   │
│  • What must v1 do?                 │
│  • Platform discussion              │
│  • Technical decisions              │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  RECOMMENDATIONS                    │
│                                     │
│  • Suggest platform                 │
│  • Recommend knowledge/commands     │
│  • Note custom requirements         │
│  • User confirms                    │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  GENERATE PACKAGE                   │
│  (to outbox/[project-slug]/)        │
│                                     │
│  ├── README.md (project spec)      │
│  ├── PROJECT-BRIEF.md              │
│  ├── TECHNICAL-DECISIONS.md        │
│  ├── SETUP.md                      │
│  ├── .claude/commands/             │
│  ├── knowledge/                    │
│  └── provided-files/               │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  OPEN IN FINDER                     │
│                                     │
│  Package folder opens automatically │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  TARGET AGENT                       │
│                                     │
│  Copy to projects → claude .        │
│  "Read SETUP.md and build this"    │
│                                     │
│  Agent enters plan mode and builds  │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  POST-SETUP CLEANUP                 │
│                                     │
│  mv setup files → agent/setup/     │
│  Everything version-controlled      │
│  Parent directory clean             │
└─────────────────────────────────────┘
```

---

## Conversation Topics

The conversation should naturally explore:

### The Idea
- What are you building?
- Who is it for?
- What problem does it solve?
- What makes it valuable/different?

### Scope
- What MUST version 1 do?
- What can wait for later?
- What's explicitly out of scope?

### Context
- Personal project, startup, enterprise?
- Expected scale?
- Timeline pressures?

### Technical
- Web, mobile, or both?
- User accounts needed?
- Real-time requirements?
- External integrations?

### Platform Decision
Based on requirements, discuss options:
- "Given you need X, Y, Z... I'd suggest..."
- Present tradeoffs
- Let user decide with guidance

---

## Output Files

### README.md (Project Specification)

Comprehensive project specification that serves as the initial README:
- Project overview and purpose
- V1 scope (included and explicitly excluded)
- Technical stack with rationale
- Project structure
- Database schema and entity relationships
- Key workflows with ASCII diagrams
- Authentication flow
- Package contents
- Available commands
- Skills to install
- Development workflow
- Environment variables
- Post-setup checklist
- Future roadmap

This becomes the new project's initial README.md.

### PROJECT-BRIEF.md

Comprehensive summary of everything discussed:
- The idea in detail
- Target users and their problems
- Core features for v1 (with rationale)
- Future features (why they can wait)
- Technical decisions (with rationale)
- Data requirements
- UI/UX notes
- Integrations needed
- Out of scope items
- Open questions

### TECHNICAL-DECISIONS.md

Quick reference for implementation:
- Stack choices table
- Key libraries
- Architecture notes
- Security considerations

### SETUP.md

Instructions for the target agent:
- What's included in the package
- Order to read files
- Steps to take
- Verification checklist

### knowledge/

Platform-specific guidance copied from Squared Agent.

### commands/

Workflow guides copied from Squared Agent.

### provided-files/

Any files the user provided at the start (designs, specs, etc.).

---

## Example Conversation

```
User: /spawn-project

Claude: How would you like to create this project?
        1. Discuss & Design (Recommended)
        2. Use Template

User: [selects Discuss & Design]

Claude: Tell me about what you want to build. What's the idea?

User: A habit tracker app

Claude: Nice! Who is this for - yourself, or thinking of launching it?

User: I want to launch it as a product

Claude: What's the core thing that makes your habit tracker different?

User: Streaks and social accountability - share progress with friends

Claude: The social angle could help retention. A few more questions:
        - Web app, mobile, or both?
        - How will people sign up?

User: Web first, maybe mobile later. Google/email sign up.

Claude: Makes sense. For data, you'll need habits, completions,
        streaks, and friend connections. Any premium features?

User: Maybe later - keep v1 free

Claude: Good scope control. Based on this, I'd recommend:
        - Next.js (web, good SEO, easy deploy)
        - Better Auth (Google + email)
        - PostgreSQL (habits, streaks, social graph)

        I'll include our Next.js guide and end-session command.
        Sound good?

User: Let's do it

Claude: [generates package with full context]
```

---

## Key Principles

### Conversational
This is a discussion, not a questionnaire. Ask follow-ups based on responses. Let the conversation flow naturally.

### Guide, Don't Dictate
Present options and tradeoffs. Help users make informed decisions. Don't force a particular approach.

### Capture Rationale
Document WHY decisions were made, not just what was decided. This helps the target agent make good implementation choices.

### Comprehensive Output
The target agent should have everything needed to build v1 without coming back to ask questions.

### Include User Context
If the user provides files (designs, specs, existing code), include them in the package.

---

## Extending This Workflow

### Adding Platform Knowledge

When a new platform skill is added to `knowledge/`, it becomes available for recommendation during the conversation.

### Custom Requirements

If a project needs something not covered by existing knowledge/commands, note it in PROJECT-BRIEF.md under "Open Questions" or "Custom Needs".

### Output Location

Packages are saved to `outbox/[project-slug]/` within Squared Agent. The folder opens automatically in Finder when generation completes.

### Discussion Integration

`/spawn-project` checks `outbox/discussions/` for previous `/discuss` sessions:

```bash
ls outbox/discussions/*.md 2>/dev/null | head -10
```

If discussions exist, the user can:
1. **Continue from a discussion** - Pre-fills decisions, skips covered topics
2. **Start fresh** - Ignore discussions, begin new discovery

When continuing from a discussion:
- **Key Decisions Made** → Pre-filled, skip those questions
- **Explored Topics (yes)** → Quickly confirm or skip
- **Explored Topics (partially)** → Ask follow-up questions
- **Explored Topics (no)** → Explore fully
- **Open Questions** → Address during discovery

This creates a seamless handoff from exploratory ideation to project specification.

### Post-Setup Cleanup

After the project is built and verified, the target agent consolidates setup files:

```bash
mkdir -p agent/setup
mv SETUP.md PROJECT-BRIEF.md TECHNICAL-DECISIONS.md agent/setup/
mv commands knowledge provided-files agent/setup/ 2>/dev/null || true
```

This keeps everything version-controlled with the project. README.md stays at root.

### Post-Conversation Improvements

After a project is built, send feedback via `/end-session` to improve the knowledge and workflows for future projects.
