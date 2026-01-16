# New Idea Workflow

A consultative discovery process that helps users design their project and generates a comprehensive package for implementation.

## Overview

`/new-idea` is a conversation, not a form. You discuss the user's idea, help them think through requirements, guide technical decisions, and produce a complete project package.

The output is everything a target agent needs to build version 1.

---

## The Process

```
/new-idea [optional: path to files]
         │
         ▼
┌─────────────────────────────────────┐
│  DISCOVERY CONVERSATION             │
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
│  • Recommend skills/commands        │
│  • Note custom requirements         │
│  • User confirms                    │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  GENERATE PACKAGE                   │
│                                     │
│  ├── PROJECT-BRIEF.md              │
│  ├── TECHNICAL-DECISIONS.md        │
│  ├── SETUP.md                      │
│  ├── skills/                       │
│  ├── commands/                     │
│  └── provided-files/               │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  TARGET AGENT                       │
│                                     │
│  Copy to new folder → claude .      │
│  "Read SETUP.md and build this"    │
│                                     │
│  Agent enters plan mode and builds  │
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

### skills/

Platform-specific guidance copied from Squared Agent.

### commands/

Workflow guides copied from Squared Agent.

### provided-files/

Any files the user provided at the start (designs, specs, etc.).

---

## Example Conversation

```
User: /new-idea

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

        I'll include our Next.js guide and session-end command.
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

### Adding Platform Skills

When a new platform skill is added to `skills/`, it becomes available for recommendation during the conversation.

### Custom Requirements

If a project needs something not covered by existing skills/commands, note it in PROJECT-BRIEF.md under "Open Questions" or "Custom Needs".

### Post-Conversation Improvements

After a project is built, send feedback via `/session-end` to improve the skills and workflows for future projects.
