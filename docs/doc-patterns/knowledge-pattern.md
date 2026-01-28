# Knowledge Pattern

Template and guidelines for knowledge guide documentation.

---

## Knowledge Guide Template

```markdown
# Topic Name

[← Back to Category](../README.md) · [← Back to Knowledge](../../README.md)

---

Brief description (1-2 sentences) of what this guide covers and when to use it.

## Quick Reference

| Item | Value |
|------|-------|
| **Primary Use** | What it's for |
| **Prerequisites** | What you need first |
| **Install** | `npm install package` |

---

## Overview

2-3 paragraphs explaining:
- What this technology/pattern does
- Why you'd choose it
- Key concepts to understand

---

## Setup

### Step 1: Installation

\`\`\`bash
npm install package
\`\`\`

### Step 2: Configuration

\`\`\`typescript
// config.ts
export const config = {
  option: value
}
\`\`\`

---

## Core Concepts

### Concept 1

Explanation with code example:

\`\`\`typescript
// Example code
\`\`\`

### Concept 2

Explanation with code example:

\`\`\`typescript
// Example code
\`\`\`

---

## Common Patterns

### Pattern Name

When to use this pattern and how:

\`\`\`typescript
// Implementation
\`\`\`

---

## Gotchas

Common issues and how to avoid them:

| Issue | Solution |
|-------|----------|
| **Problem 1** | How to fix it |
| **Problem 2** | How to fix it |

---

## Related

- [Related Guide 1](link) — Description
- [Related Guide 2](link) — Description

## Related Skills

| Skill | Purpose |
|-------|---------|
| **skill-name** | What it helps with |

Install: `npx skills add anthropics/skills -s skill-name`
```

---

## Section Guidelines

### Quick Reference Table
- Always include: Primary Use, Prerequisites, Install command
- Keep values concise (1 line each)
- Use code formatting for commands

### Code Examples
- Use TypeScript with proper syntax highlighting
- Include comments explaining non-obvious parts
- Keep examples minimal but complete
- Show file paths in comments when relevant

### Gotchas Section
- Table format for scanability
- Lead with the problem, follow with solution
- Include only real issues you've encountered

### Related Skills
- Only include if skills are mapped to this knowledge category
- Check `templates/skills/skill-mapping.json` for mappings

---

## Category-Specific Notes

### Web Framework Guides (`templates/knowledge/web/`)
- Include routing patterns
- Show data fetching approaches
- Document SSR/CSR considerations

### Database Guides (`templates/knowledge/database/`)
- Schema definition examples
- Migration patterns
- Query patterns

### Auth Guides (`templates/knowledge/auth/`)
- Session handling
- Protected routes
- Provider configuration

### Monorepo Guides (`templates/knowledge/monorepo/`)
- Workspace configuration
- Shared package patterns
- Build orchestration

### Pattern Guides (`templates/knowledge/patterns/`)
- Framework-agnostic approaches
- Can reference multiple technologies
- Focus on the "why" not just "how"

---

## Checklist

- [ ] Navigation links at top
- [ ] Brief description after title
- [ ] Quick reference table
- [ ] Setup section with runnable commands
- [ ] Code examples with syntax highlighting
- [ ] Gotchas section with real issues
- [ ] Related section linking to other guides
- [ ] Related Skills section (if applicable)
