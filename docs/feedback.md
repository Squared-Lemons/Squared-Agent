# Creator Feedback Loop

How projects created from Squared Agent can send feedback back to improve future setups.

---

## The Feedback Loop

```
┌─────────────────┐                         ┌──────────────────┐
│  Squared Agent  │ ──── setup package ───► │   Your Project   │
│                 │                         │                  │
│  inbox/         │ ◄─── feedback file ──── │   /end-session   │
│  from-projects/ │                         │                  │
└─────────────────┘                         └──────────────────┘
```

1. You create a project from a Squared Agent setup package
2. During development, you discover issues, patterns, or improvements
3. At session end, feedback is auto-generated from your session
4. Save the feedback as a file in Squared Agent's `inbox/from-projects/`
5. Squared Agent reviews and creates proposals in `suggestions/`

---

## How Feedback is Generated

When you run `/end-session` in a project created from Squared Agent, it analyzes your session for:

### Skills Gaps
- Missing information in skill docs
- Errors or outdated patterns
- New patterns worth documenting

### Setup Issues
- Missing or unclear configuration
- Gotchas encountered during development
- Things that should be pre-configured

### New Patterns
- Reusable code patterns created
- Commands or workflows worth standardizing
- UI components that could be shared

### Technical Gotchas
- Library issues discovered
- Config settings that weren't documented
- Error messages with non-obvious solutions

---

## Feedback Format

Feedback is displayed in a copy-paste friendly format:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY THE FOLLOWING TO SQUARED-AGENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Feedback from [Project Name] - YYYY-MM-DD

### Skills Gaps
- [Specific missing info that would have helped]
- [Patterns worth adding to skills docs]

### Setup Issues
- [Config that should be pre-configured]
- [Gotchas to document for future projects]

### New Patterns
- [Reusable patterns created this session]
- [Code worth extracting to templates]

### Technical Gotchas
- [Library issues and solutions]
- [Config requirements discovered]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Sending Feedback

### Step 1: Run /end-session in your project

```
/end-session
```

### Step 2: Copy the feedback block

Select everything between the `━━━` delimiters and copy.

### Step 3: Save to Squared Agent

Save the feedback as a markdown file:

```
inbox/from-projects/YYYY-MM-DD-[project-name].md
```

For example: `inbox/from-projects/2026-01-16-habit-tracker.md`

### Step 4: Let Claude process it

Next time you work with Squared Agent, I'll review the inbox and create proposals in `suggestions/` for improvements we can discuss and implement together.

---

## What Gets Improved

Based on feedback, Squared Agent may update:

| Content Type | Example Improvements |
|--------------|----------------------|
| **Skills** | Add missing patterns, fix outdated info, add gotchas |
| **Setups** | Add pre-configuration, improve instructions |
| **Commands** | Add new commands, improve existing workflows |
| **Tasks** | Add new setup tasks |

---

## Feedback Best Practices

### Be Specific
Instead of "auth was confusing", say "Better Auth requires `serverExternalPackages` in next.config.js but this wasn't documented".

### Include Solutions
If you figured something out, include the solution so others don't have to.

### Note Library Versions
If a gotcha is version-specific, note which version you were using.

### Skip Routine Sessions
Only send feedback if you discovered something worth sharing. Routine sessions without issues don't need feedback.
