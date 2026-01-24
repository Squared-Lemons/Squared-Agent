# Discuss Command - Implementation Guide

A Claude Code command for exploratory conversations about vague ideas. Saves discussion documents that can be picked up later by `/spawn-project`.

---

## Overview

The `/discuss` command is for exploring ideas before committing to build something. Unlike `/spawn-project` which produces a full project package, `/discuss` captures thoughts for later consideration.

### What It Does

| Step | Action |
|------|--------|
| 1 | Opens exploratory conversation |
| 2 | Uses `superpowers:brainstorming` for structured exploration |
| 3 | Explores topics naturally (not as checklist) |
| 4 | Periodically offers to save or continue |
| 5 | Writes discussion document to `outbox/discussions/` |

### When to Use

| Scenario | Command |
|----------|---------|
| Vague idea, still exploring | `/discuss` |
| Clear concept, ready to specify | `/spawn-project` |
| Previous discussion exists, ready to build | `/spawn-project` (auto-detects) |

---

## Files to Create

### Folder: `outbox/discussions/`

Create this folder to store discussion documents:

```bash
mkdir -p outbox/discussions
```

### Main Command: `.claude/commands/discuss.md`

```markdown
---
name: discuss
description: Exploratory conversation to work through a vague idea
allowed-tools: Read, Glob, Bash, Write, Task, Skill
---

# Discuss - Exploratory Ideation

An open-ended conversation to help users think through vague ideas. Unlike `/spawn-project` which produces a full project package, `/discuss` is for exploring possibilities and capturing thoughts for later.

**Arguments:** $ARGUMENTS

---

## Overview

This is an exploratory conversation, not a structured discovery process. Use it when:
- The user has a vague idea but isn't ready to commit to building something
- They want to explore possibilities before making decisions
- They need help thinking through options and tradeoffs

The output is a discussion document that can later be picked up by `/spawn-project`.

---

## Step 1: Start the Conversation

Begin with an open invitation:

"What's on your mind? Tell me about the idea you're exploring."

If `$ARGUMENTS` contains context, read and acknowledge it first.

---

## Step 2: Structured Exploration

Invoke the `superpowers:brainstorming` skill to establish a systematic exploration framework.

Present the exploration **conversationally**, not as a checklist.

---

## Step 3: Explore Topics Naturally

As the conversation flows, cover these areas:

### Core Idea
- What is it, in essence?
- Why does it matter?

### Who It's For
- Who would use this?
- What's their situation?

### Scale & Context
- Personal project, startup, or enterprise?
- Any constraints?

### Platform Direction
- Web, mobile, desktop, API?
- Technology preferences?

### Known Requirements
- What MUST it do?
- What's out of scope?

### Open Questions
- What's still unclear?
- What needs more thought?

---

## Step 4: Check Direction Periodically

Every few exchanges, offer a checkpoint:

- "Want to keep exploring, or should we capture what we have?"
- "Ready to move to /spawn-project, or still exploring?"

---

## Step 5: Save Discussion Document

When ready to save:

\```bash
TOPIC_SLUG="[topic-slug]"
DATE=$(date +%Y-%m-%d)
DISCUSSION_FILE="outbox/discussions/${TOPIC_SLUG}-${DATE}.md"
\```

Write the document with this structure:

\```markdown
# Discussion: [Topic Name]

*Captured: YYYY-MM-DD*
*Status: Open*

## Summary
[One paragraph essence]

## The Idea
### What We're Exploring
### Why It Matters
### Who It's For

## Key Decisions Made
| Topic | Decision | Rationale |
|-------|----------|-----------|

## Open Questions
- [ ] [Unresolved question]

## Explored Topics
### Platform & Delivery
- **Discussed:** yes | no | partially
- **Notes:** [What was discussed]

### Users & Scale
- **Discussed:** yes | no | partially
- **Notes:**

### Core Features
- **Discussed:** yes | no | partially
- **Notes:**

### Authentication
- **Discussed:** yes | no | partially
- **Notes:**

### Data & Storage
- **Discussed:** yes | no | partially
- **Notes:**

### Integrations
- **Discussed:** yes | no | partially
- **Notes:**

### UI/UX
- **Discussed:** yes | no | partially
- **Notes:**

## Next Steps
[Ready for /spawn-project or needs more exploration]
\```
```

---

## Discussion Document Format

Discussion documents use a structured format that `/spawn-project` can parse:

### Status Values

| Status | Meaning |
|--------|---------|
| **Open** | Still exploring |
| **Ready for /spawn-project** | Core idea clear, ready to specify |
| **Archived** | No longer pursuing |

### Explored Topics Section

The "Explored Topics" section tracks what was covered:

- **yes** - Topic fully discussed, decisions made
- **partially** - Topic touched on, needs more work
- **no** - Topic not discussed

When `/spawn-project` picks up a discussion:
- **yes** topics → Skip or quickly confirm
- **partially** topics → Ask follow-up questions
- **no** topics → Explore fully

---

## Integration with /spawn-project

The `/spawn-project` command checks for existing discussions:

```bash
ls outbox/discussions/*.md 2>/dev/null | head -10
```

If found, it offers to continue from a discussion. Key Decisions become pre-filled choices, and only unexplored topics are asked about.

---

## Key Principles

### Exploratory, Not Prescriptive
This is thinking out loud together. Don't push toward decisions.

### Capture, Don't Lose
Even vague ideas have value. Capture the essence.

### Natural Checkpoints
Periodically offer to save or continue.

### Seamless Handoff
Discussion documents are designed for `/spawn-project` pickup.

---

## Example Flow

```
User: /discuss

Claude: What's on your mind? Tell me about the idea you're exploring.

User: I've been thinking about some kind of habit tracking tool

Claude: Habit tracking is interesting. What's making you think about
        building one? Is there something missing from what exists?

User: Most apps are too complicated. I want something simple.

Claude: Simple is hard to do well. When you say "dead simple" -
        what does that look like to you?

[conversation continues]

Claude: We've covered good ground. Want to keep exploring, or
        should I capture what we have?

User: Let's save it

Claude: [saves discussion]

        Discussion saved: outbox/discussions/simple-habit-tracker-2026-01-24.md

        When ready, run /spawn-project to continue building.
```
