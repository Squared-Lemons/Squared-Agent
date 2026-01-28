# Skills

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

[Agent Skills](https://agentskills.io/home) is an open standard for giving AI agents new capabilities. Originally developed by Anthropic, skills are portable across Claude Code, Cursor, VS Code, Gemini CLI, and more.

## How Skills Work

```
MASTER AGENT                          SPAWNED PROJECT
─────────────                         ───────────────
/add-skill                            SETUP.md lists recommended skills
    │                                      │
    ├─→ Installs locally                   │
    │                                      ▼
    └─→ Updates skill-mapping.json    npx skills add anthropics/skills -s [skill]
             │                             │
             ▼                             ▼
        Recommends skills ──────────→ Installs fresh
        in SETUP.md                   Auto-loaded by agent
```

**Key insight:** Spawned projects install skills fresh — they're not copied. This ensures the latest versions.

---

## Recommended Skills

### Web Development

| Skill | Purpose | Install |
|-------|---------|---------|
| **frontend-design** | Production-grade UI without generic AI aesthetics | `npx skills add anthropics/skills -s frontend-design` |
| **webapp-testing** | End-to-end web application testing | `npx skills add anthropics/skills -s webapp-testing` |
| **web-artifacts-builder** | Build interactive web components | `npx skills add anthropics/skills -s web-artifacts-builder` |
| **theme-factory** | Generate consistent design themes | `npx skills add anthropics/skills -s theme-factory` |
| **canvas-design** | Canvas-based designs and graphics | `npx skills add anthropics/skills -s canvas-design` |

### Documents & Office

| Skill | Purpose | Install |
|-------|---------|---------|
| **docx** | Word document creation and editing | `npx skills add anthropics/skills -s docx` |
| **pptx** | PowerPoint presentation creation | `npx skills add anthropics/skills -s pptx` |
| **xlsx** | Excel spreadsheet manipulation | `npx skills add anthropics/skills -s xlsx` |
| **pdf** | PDF document handling | `npx skills add anthropics/skills -s pdf` |

### Monorepo

| Skill | Purpose | Install |
|-------|---------|---------|
| **turborepo** | Comprehensive patterns, caching, CI/CD, and anti-patterns | `npx skills add https://github.com/vercel/turborepo --skill turborepo` |

### Development Tools

| Skill | Purpose | Install |
|-------|---------|---------|
| **mcp-builder** | Create MCP servers for tool integration | `npx skills add anthropics/skills -s mcp-builder` |
| **skill-creator** | Create new skills | `npx skills add anthropics/skills -s skill-creator` |

### Creative & Communication

| Skill | Purpose | Install |
|-------|---------|---------|
| **algorithmic-art** | Algorithmic and generative art | `npx skills add anthropics/skills -s algorithmic-art` |
| **brand-guidelines** | Brand guidelines creation | `npx skills add anthropics/skills -s brand-guidelines` |
| **internal-comms** | Internal communications | `npx skills add anthropics/skills -s internal-comms` |
| **doc-coauthoring** | Collaborative document editing | `npx skills add anthropics/skills -s doc-coauthoring` |
| **slack-gif-creator** | Create GIFs for Slack | `npx skills add anthropics/skills -s slack-gif-creator` |

---

## Category Mapping

Skills are mapped to knowledge categories for automatic recommendation:

| Category | Knowledge Path | Recommended Skills |
|----------|----------------|-------------------|
| `web` | `templates/knowledge/web/` | frontend-design, webapp-testing, web-artifacts-builder, theme-factory |
| `database` | `templates/knowledge/database/` | — |
| `auth` | `templates/knowledge/auth/` | — |
| `monorepo` | `templates/knowledge/monorepo/` | turborepo |
| `patterns` | `templates/knowledge/patterns/` | mcp-builder, docx, pptx, xlsx, pdf, skill-creator |

When you select knowledge during `/spawn-project`, skills from matching categories are recommended.

---

## Installing Skills

### On Master Agent (this repo)

```
/add-skill
```

This installs skills locally and updates `skill-mapping.json` so they're recommended to spawned projects.

### On Spawned Projects

Follow the SETUP.md instructions:

```bash
npx skills add anthropics/skills -s frontend-design
npx skills add anthropics/skills -s webapp-testing
```

### Install All Skills

```bash
npx skills add anthropics/skills
```

### Install Specific Skill

```bash
npx skills add anthropics/skills -s frontend-design
```

---

## File Structure

```
templates/skills/
├── README.md              # This file
└── skill-mapping.json     # Category mappings + recommended skills
```

Note: Actual skill files live in `.claude/skills/` after installation — not in this templates folder.

---

## skill-mapping.json

Tracks which skills to recommend for each category:

```json
{
  "source": "https://agentskills.io/home",
  "defaultRepo": "anthropics/skills",
  "skills": {
    "frontend-design": {
      "categories": ["web"],
      "description": "Production-grade UI",
      "source": "anthropics/skills"
    },
    "turborepo": {
      "categories": ["monorepo"],
      "description": "Comprehensive Turborepo patterns",
      "source": "vercel/turborepo"
    }
  },
  "recommended": {
    "web": ["frontend-design", "webapp-testing", ...],
    "monorepo": ["turborepo"],
    "patterns": ["mcp-builder", "docx", ...]
  },
  "categories": {
    "web": { "description": "...", "knowledgePath": "..." },
    "monorepo": { "description": "...", "knowledgePath": "..." },
    ...
  }
}
```

---

## Sources

- [agentskills.io](https://agentskills.io/home) — Official platform and specification
- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic's skill repository
- [agentskills/agentskills](https://github.com/agentskills/agentskills) — Specification and SDK
