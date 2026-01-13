# New Idea Workflow

Create a setup package for a new app project. This command gathers your platform choice, idea description, and preferred commands, then generates a folder you can copy to a new project.

## Overview

The `/new-idea` command creates a **setup package** (similar to `/prepare-setup`) that contains:

1. **Your idea** baked into SETUP.md
2. **Platform guidance** from the selected skill file
3. **Command guides** you choose to include
4. **Setup instructions** that tell the target agent to enter plan mode

This ensures every new project starts with:
- Clear context about what you're building
- Relevant platform patterns loaded
- A structured path to planning and implementation

---

## How It Works

### In Squared-Agent (this project)

```
/new-idea
    ↓
Ask: Which platform?
    ↓
Ask: Describe your idea
    ↓
Ask: Which commands to include?
    ↓
Create setup package in /tmp
    ↓
Open folder for you to copy
```

### In Your New Project

```
Copy folder contents to new project
    ↓
Tell Claude: "Read SETUP.md and set up this project"
    ↓
Agent reads your idea + platform guide
    ↓
Agent enters plan mode to design implementation
    ↓
Agent sets up commands
    ↓
Ready to build!
```

---

## Step-by-Step Flow

### Step 1: Platform Discovery

The command scans `skills/` for available platform guides:

```bash
ls skills/*.md 2>/dev/null | grep -v README
```

Each skill file represents a platform:
- `Next.js-App-Build-Guide.md` → Next.js
- `Flutter-App-Build-Guide.md` → Flutter

### Step 2: Platform Selection

Choose from:
- **Existing platforms** - Use proven guidance
- **Create new platform guidance** - Start fresh

### Step 3: New Platform Creation (if selected)

If creating new guidance:

1. You provide the platform/stack name
2. A skeleton skill file is created in Squared-Agent's `skills/` folder (persistent)
3. The skeleton is also copied to your setup package

Fill in the guide as you learn during development.

### Step 4: Idea Description

Describe your app idea:
- What does it do?
- Key features
- Target users

This gets baked into SETUP.md so the target agent has full context.

### Step 5: Commands Selection

Choose which command guides to include:
- SESSION-END-COMMAND
- New Feature Workflow
- Canvas-Panel-Navigation-System
- All / None

### Step 6: Package Creation

A folder is created in `/tmp/new-idea-<timestamp>/` containing:

```
new-idea-20260113-123456/
├── SETUP.md                          # Your idea + setup instructions
├── skills/
│   └── <Platform>-App-Build-Guide.md
└── commands/                         # If any selected
    └── *.md
```

---

## The Generated SETUP.md

The key file in the package. It contains:

1. **Your idea** - Full description
2. **Platform reference** - Points to skill file
3. **Setup instructions** that tell the agent to:
   - Initialize git
   - Read the platform guide
   - **Enter plan mode** to design implementation
   - Set up commands
   - Create CLAUDE.md
4. **Verification checklist**

This means the target agent has everything needed to understand and plan your project.

---

## Adding New Platform Skills

To add guidance for a new platform manually in Squared-Agent:

### 1. Create the Skill File

Create `skills/<Platform>-App-Build-Guide.md`:

```markdown
# <Platform> App Build Guide

## Overview

Brief description of the platform and when to use it.

## Project Structure

\`\`\`
project-root/
├── src/
│   └── ...
├── package.json
└── ...
\`\`\`

## Getting Started

\`\`\`bash
# Commands to create a new project
npx create-<platform>-app my-app
\`\`\`

## Key Patterns

### Authentication
How to implement auth on this platform.

### Data Fetching
Patterns for loading and caching data.

### State Management
Recommended approaches for managing state.

## Common Gotchas

- **Gotcha 1**: Description and solution
- **Gotcha 2**: Description and solution

## Resources

- [Official Docs](url)
```

### 2. Key Sections

| Section | Purpose |
|---------|---------|
| Overview | When to choose this platform |
| Project Structure | Standard folder layout |
| Getting Started | Initial setup commands |
| Key Patterns | Common implementation patterns |
| Common Gotchas | Pitfalls and solutions |
| Resources | Links to docs and tutorials |

### 3. Best Practices

- **Be specific** - Include actual code examples
- **Document gotchas** - Things that trip people up
- **Keep it current** - Update when you learn new patterns
- **Link resources** - Point to official docs

---

## Example Session

```
User: /new-idea

Claude: Which platform/stack do you want to build with?
  ○ Next.js
  ○ Create new platform guidance

User: [Selects Next.js]

Claude: Describe your app idea (what it does, key features, target users)

User: A habit tracker app where users can create habits, track daily
      completion, see streaks, and get reminder notifications.

Claude: Which command guides should be included?
  ☑ SESSION-END-COMMAND
  ☑ New Feature Workflow
  ☐ Canvas-Panel-Navigation-System

User: [Confirms selection]

Claude: Setup package created at: /tmp/new-idea-20260113-143052

Idea: Habit tracker with streaks and reminders
Platform: Next.js

Contents:
- SETUP.md (start here)
- skills/Next.js-App-Build-Guide.md
- commands/SESSION-END-COMMAND.md
- commands/New Feature Workflow.md

To use: Copy this folder to your new project and tell Claude Code:
"Read SETUP.md and help me set up this project"

[Finder opens with the folder]
```

---

## Integration with Other Workflows

### After Setup: Plan Mode

When the target agent reads SETUP.md, it will enter plan mode to:
- Design project structure
- Break down features
- Identify data models
- Plan UI/UX approach

### During Development: `/new-feature`

After planning, use `/new-feature` (if included) to implement each feature:

```
/new-feature Add habit creation form with name, frequency, and reminder time
```

### End of Session: `/session-end`

When wrapping up:

```
/session-end
```

This captures learnings that can improve the platform skill file back in Squared-Agent.

---

## Tips

1. **Start with existing guidance** - If a skill file exists, use it. The patterns are proven.

2. **Create guidance early** - If starting with a new platform, create the skeleton now. Fill it in as you learn.

3. **Be descriptive with ideas** - The more context you provide, the better the plan will be.

4. **Include useful commands** - SESSION-END-COMMAND and New Feature Workflow are recommended for most projects.

5. **Update skills after projects** - When you learn new patterns or gotchas, copy feedback back to Squared-Agent to improve the skill file for future projects.
