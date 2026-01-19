# README Pattern

Template and guidelines for README files throughout the project.

---

## Root README (README.md)

```markdown
# Project Name

**Tagline — one sentence value proposition.**

Longer description (2-3 sentences) explaining what the project does and who it's for.

\`\`\`mermaid
flowchart LR
    A["Input"] --> B["Process"]
    B --> C["Output"]
\`\`\`

---

## The Problem

| Problem | What Happens |
|---------|--------------|
| **Problem 1** | Consequence |
| **Problem 2** | Consequence |

[Project Name] solves all of these.

---

## Quick Start

### 1. First Step
\`\`\`bash
command
\`\`\`

### 2. Second Step
\`\`\`bash
command
\`\`\`

---

## Key Features

### Feature Category 1

Description of category.

| Feature | Purpose |
|---------|---------|
| **feature-name** | What it does |

### Feature Category 2

...

---

## Commands Reference

| Command | Description |
|---------|-------------|
| \`/command\` | What it does |

---

## Project Structure

\`\`\`
folder/
  subfolder/    # Description
  file.md       # Description
\`\`\`

---

## Documentation

| Document | What's Inside |
|----------|---------------|
| [doc.md](link) | Description |

---

## License

License info
```

---

## Nested README (templates/*/README.md)

```markdown
# Folder Name

[← Back to Parent](../README.md) · [← Back to README](../../README.md)

---

One-line description of what this folder contains.

## Quick Reference

| Item | Purpose | Description |
|------|---------|-------------|
| **item-name** | Category | What it does |

---

## Section 1

Content...

---

## Section 2

Content...

---

## Adding New Items

1. Step one
2. Step two
3. Update this README

**[View all items →](subfolder/)**
```

---

## Checklist

- [ ] Navigation links at top (for nested READMEs)
- [ ] One-line description after title
- [ ] Quick reference table for scanability
- [ ] Clear section organization
- [ ] Links to related docs
- [ ] "Adding New" section if applicable
