---
name: discuss
description: Exploratory conversation to work through a vague idea
allowed-tools: Read, Glob, Bash, Write, Task, Skill
---

# Discuss - Exploratory Ideation

An open-ended conversation to help users think through vague ideas using the agent's knowledge base. The output is a discussion document that can be used to start a `/new-feature` in the current project or continue into `/spawn-project` for a child project.

**Arguments:** $ARGUMENTS

---

## Overview

This is an exploratory conversation, not a structured discovery process. Use it when:
- The user has a vague idea but isn't ready to commit to building something
- They want to explore possibilities before making decisions
- They need help thinking through options and tradeoffs

The output is a discussion document that can:
- Feed into `/new-feature` to build in the current project
- Continue into `/spawn-project` to create a child project

---

## Step 1: Start the Conversation

Begin with an open invitation:

"What's on your mind? Tell me about the idea you're exploring."

If `$ARGUMENTS` contains context, read and acknowledge it first.

---

## Step 2: Structured Exploration

Invoke the `superpowers:brainstorming` skill to establish a systematic exploration framework.

The skill ensures:
- User intent is fully explored
- Requirements are properly extracted
- Design options are considered
- Nothing important is missed

Present the exploration **conversationally**, not as a checklist. The skill provides structure; you provide natural dialogue.

---

## Step 3: Explore Topics Naturally

As the conversation flows, cover these areas (don't ask as a checklist):

### Core Idea
- What is it, in essence?
- Why does it matter?
- What problem does it solve?

### Who It's For
- Who would use this?
- What's their situation?
- Why would they care?

### Scale & Context
- Personal project, startup, or enterprise?
- Just exploring, or planning to build?
- Any constraints (time, budget, skills)?

### Platform Direction
- Web, mobile, desktop, API, or something else?
- Any technology preferences or requirements?
- Integrations needed?

### Known Requirements
- What MUST it do?
- What would be nice but optional?
- What's definitely out of scope?

### Open Questions
- What's still unclear?
- What needs more thought?
- What decisions are being deferred?

Let the conversation go where it needs to. Not every topic needs to be covered.

---

## Step 4: Check Direction Periodically

Every few exchanges, offer a natural checkpoint:

- "Want to keep exploring, or should we capture what we have so far?"
- "This is shaping up. Should we save this discussion, or dig deeper?"
- "Sounds like you're getting clearer. Ready to move to /spawn-project, or still exploring?"

### User Options

1. **Keep exploring** - Continue the conversation
2. **Save for later** - Write discussion document, end session
3. **Move to /spawn-project** - Save discussion, then the user can run `/spawn-project` to continue

---

## Step 5: Save Discussion Document

When the user is ready to save (or explicitly asks to wrap up):

### Generate slug
Create a topic slug from the discussion (e.g., "habit-tracker", "ai-writing-tool", "team-dashboard").

### Write discussion document

```bash
TOPIC_SLUG="[topic-slug]"
DATE=$(date +%Y-%m-%d)
DISCUSSION_FILE="outbox/discussions/${TOPIC_SLUG}-${DATE}.md"
```

Write the document:

```markdown
# Discussion: [Topic Name]

*Captured: YYYY-MM-DD*
*Status: Open*

## Summary

[One paragraph capturing the essence of what was discussed]

## The Idea

### What We're Exploring

[Description of the core idea]

### Why It Matters

[The problem it solves or value it provides]

### Who It's For

[Target users and their situation]

## Key Decisions Made

| Topic | Decision | Rationale |
|-------|----------|-----------|
| [Topic] | [What was decided] | [Why] |

## Open Questions

- [ ] [Unresolved question]
- [ ] [Another question]

## Explored Topics

### Platform & Delivery
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

### Users & Scale
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

### Core Features
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

### Authentication
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

### Data & Storage
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

### Integrations
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

### UI/UX
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed, if anything]

## Next Steps

[What should happen next - "Ready to build" or "Needs more exploration on X, Y, Z"]
```

### Report what was saved

```
Discussion saved: outbox/discussions/[topic-slug]-YYYY-MM-DD.md

Status: [Open | Ready to build]

What's next?
- /new-feature "[description]" - Build this in the current project
- /spawn-project - Create a new child project
- /discuss - Continue exploring

Open questions remaining:
- [List any unresolved questions]
```

---

## Key Principles

### Exploratory, Not Prescriptive
This is thinking out loud together. Don't push toward decisions the user isn't ready to make.

### Capture, Don't Lose
Even vague ideas have value. Capture the essence so nothing is lost.

### Natural Checkpoints
Periodically offer to save or continue. Don't let conversations go on forever without acknowledgment.

### Seamless Handoff
The discussion document captures decisions that inform either `/new-feature` or `/spawn-project`. Decisions made here become context for building.

---

## Status Values

Discussion documents can have these statuses:

| Status | Meaning |
|--------|---------|
| **Open** | Still exploring, not ready to build |
| **Ready to build** | Core idea is clear, ready for `/new-feature` or `/spawn-project` |
| **Archived** | No longer pursuing this idea |

---

## Example Flow

```
User: /discuss

Claude: What's on your mind? Tell me about the idea you're exploring.

User: I've been thinking about some kind of tool for tracking habits,
      but I'm not sure if it's worth building

Claude: Habit tracking is interesting - there are a lot of apps out there.
        What's making you think about building one? Is there something
        missing from what exists?

User: Yeah, I find most of them are too complicated. I just want
      something dead simple

Claude: Simple is hard to do well, but it's a real gap. When you say
        "dead simple" - what does that look like to you?

[conversation continues naturally]

Claude: We've covered a lot of ground. Want to keep exploring, or
        should I capture what we have so far?

User: Let's save it - I want to think about it more

Claude: [saves discussion document]

        Discussion saved: outbox/discussions/simple-habit-tracker-2026-01-24.md

        Status: Open (still exploring)

        Key decisions so far:
        - Focus on simplicity over features
        - Mobile-first, maybe web later
        - No social features in v1

        Open questions:
        - What makes a habit "complete"?
        - Daily only, or flexible schedules?

        What's next?
        - /new-feature "habit tracker" - Build here
        - /spawn-project - Create new project
        - /discuss - Keep exploring
```
