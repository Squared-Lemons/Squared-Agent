# Skills

Knowledge base that informs how agents build things. These are reference guides and documentation that agents consult when implementing specific technologies or patterns.

## Purpose

Skills are **not** step-by-step setup instructions (those live in `setups/`). Instead, they are comprehensive guides that document:

- Architecture patterns and best practices
- Common pitfalls and solutions
- Code examples and templates
- Configuration requirements

Agents reference these skills when building features that use the documented technologies.

## Available Skills

| Skill | Description |
|-------|-------------|
| [Next.js-App-Build-Guide](./Next.js-App-Build-Guide.md) | Building Next.js apps with Better Auth, Drizzle ORM, and Turborepo monorepo |

## How Skills Are Used

1. **During feature development** - Agents consult relevant skills for implementation guidance
2. **In setup profiles** - Setup instructions may reference skills for detailed context
3. **For troubleshooting** - Skills document common pitfalls and solutions

## How to Extend

### Adding a New Skill

1. **Create the skill file**
   ```
   skills/[Technology]-[Pattern]-Guide.md
   ```
   Examples: `React-Testing-Guide.md`, `PostgreSQL-Optimization-Guide.md`

2. **Structure your skill with these sections:**
   - Overview - What technology/pattern this covers
   - Architecture - How components fit together
   - Setup - Configuration requirements
   - Code Examples - Working implementation samples
   - Common Pitfalls - Known issues and solutions
   - Checklist - Quick reference for implementation

3. **Update this README** - Add entry to the Available Skills table

4. **Update CLAUDE.md** - Add to Available Content section

5. **Include in relevant setups** - Reference in setup profiles that use this technology

### Naming Convention

- Use `[Technology]-[Pattern]-Guide.md` format
- Technology: Main tech (Next.js, React, Django, etc.)
- Pattern: What aspect (Build, Testing, Deployment, etc.)
- Always end with `-Guide.md`

### Template Structure

```markdown
# [Technology] [Pattern] Guide

Brief description of what this skill covers.

## Overview

When and why to use this technology/pattern.

## Architecture

How components fit together, diagrams if helpful.

## Setup

### Prerequisites
- Required dependencies
- Environment requirements

### Configuration
[Config examples]

## Implementation

### [Component 1]
[Code examples and explanation]

### [Component 2]
[Code examples and explanation]

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| ... | ... |

## Checklist

- [ ] Step 1
- [ ] Step 2
- [ ] ...
```

### Best Practices

- Include real, working code examples
- Document gotchas learned from actual projects
- Keep examples focused and minimal
- Update when receiving feedback from projects
