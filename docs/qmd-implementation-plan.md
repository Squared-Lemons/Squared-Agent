# Squared Agent — QMD Semantic Search Implementation Plan

> **Goal:** Add QMD (Quick Markdown Search) semantic indexing to the Squared Agent codebase so that agent sessions can search across templates, knowledge, docs, skills, learnings, and commands rather than relying on exhaustive context loading.

---

## Background

### What QMD Is

QMD is a CLI tool (`bun`-based, installed globally via `bun install -g qmd`) that provides:

- **Full-text search** (BM25 via SQLite FTS5)
- **Vector similarity search** (768-dim embeddings via `embeddinggemma-300M-Q8_0`)
- **Hybrid query** (query expansion + reranking via `qwen3-reranker-0.6b-q8_0`)
- **MCP server mode** (`qmd mcp`) for AI agent integration
- **Collections** — named groups of files with glob patterns, each indexed separately

Data is stored in a SQLite database with FTS5 triggers and `vec0` virtual tables for vector search.

### How OpenClaw Uses QMD

OpenClaw's `openclaw.json` declares a memory backend:

```json
"memory": {
  "backend": "qmd",
  "qmd": {
    "paths": [
      { "path": "knowledge" }
    ]
  }
}
```

The gateway manages QMD collections for the agent. Currently indexed collections:

| Collection | Root Path | Pattern | Content |
|-----------|-----------|---------|---------|
| `workspace` | `~/.openclaw/workspace/` | `*.md` | AGENTS.md, SOUL.md, USER.md, TOOLS.md, etc. |
| `memory` | `~/.openclaw/workspace/memory/` | `**/*.md` | Daily notes, handovers, business model |
| `memory-root` | `~/.openclaw/workspace/` | `MEMORY.md` | Curated long-term memory |
| `custom-1` | `~/.openclaw/workspace/knowledge/` | `**/*.md` | PARA knowledge base (areas, projects, resources) |
| `life` | `~/.openclaw/workspace/life/` | `**/*.md` | Personal knowledge graph |

The agent has `memory_search` and `memory_get` tools that query QMD behind the scenes. This enables recall without loading entire files into context.

### The Problem for Squared Agent

Squared Agent has **204 markdown files** totaling hundreds of KB across:
- 18 command guides in `.claude/commands/`
- 14 template command docs in `templates/commands/`
- Knowledge guides across 5 categories (`web/`, `database/`, `auth/`, `monorepo/`, `patterns/`)
- Skills with references (3 installed skills)
- CLAUDE.md (40KB alone), LEARNINGS.md (21KB)
- Docs (12 files), suggestions, inbox, outbox

Currently, Claude Code loads CLAUDE.md (40KB) into every session as the primary navigation mechanism. There is no search — the agent must already know where to look, or the user must tell it.

**With QMD**, the agent could search across all project knowledge semantically, loading only relevant snippets into context.

---

## What QMD Would Index

### Proposed Collections

| Collection | Path (relative to repo root) | Pattern | Purpose |
|-----------|------------------------------|---------|---------|
| `commands` | `.claude/commands/` | `*.md` | Active slash commands |
| `templates-commands` | `templates/commands/` | `*.md` | Command documentation/guides for spawned projects |
| `templates-knowledge` | `templates/knowledge/` | `**/*.md` | Framework guides (Next.js, Drizzle, Better Auth, etc.) |
| `templates-skills` | `templates/skills/` | `**/*.md` | Skill definitions and references |
| `templates-workflows` | `templates/workflows/` | `**/*.md` | Workflow documentation |
| `templates-ux` | `templates/ux-guides/` | `**/*.md` | UX pattern guides |
| `docs` | `docs/` | `**/*.md` | Internal documentation |
| `skills` | `skills/` | `**/*.md` | Custom skills (canvas-panel-design, etc.) |
| `installed-skills` | `.claude/skills/` | `**/SKILL.md` | Installed agent skills |
| `root` | `.` | `CLAUDE.md,LEARNINGS.md,README.md,CONTRIBUTING.md` | Core project files |
| `knowledge` | `knowledge/` | `**/*.md` | Accumulated learnings/archive |
| `suggestions` | `suggestions/` | `**/*.md` | Improvement proposals |
| `inbox` | `inbox/` | `**/*.md` | Ideas and feedback |

### What NOT to Index

- `node_modules/` — dependencies
- `outbox/` — generated project packages (large, duplicative of templates)
- `.git/` — version control internals
- `pnpm-lock.yaml` — not markdown
- `.changeset/` — changeset metadata
- Binary/build artifacts

---

## Implementation Plan

### Phase 1: QMD Installation & Initial Collections

**Task 1.1: Verify QMD Availability**

QMD is already installed globally (`/home/clawd/.bun/bin/qmd`). For spawned projects or CI, document the install:

```bash
bun install -g qmd
```

**Task 1.2: Create Indexing Script**

Create `scripts/qmd-index.sh` at the repo root:

```bash
#!/usr/bin/env bash
# scripts/qmd-index.sh - Index squared-agent for semantic search
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "📚 Indexing Squared Agent for semantic search..."

# Core project files
qmd collection add . --name root --mask "CLAUDE.md,LEARNINGS.md,README.md,CONTRIBUTING.md"

# Active commands
qmd collection add .claude/commands --name commands --mask "*.md"

# Template commands (guides for spawned projects)
qmd collection add templates/commands --name templates-commands --mask "*.md"

# Template knowledge (framework guides)
qmd collection add templates/knowledge --name templates-knowledge --mask "**/*.md"

# Template skills
qmd collection add templates/skills --name templates-skills --mask "**/*.md"

# Template workflows
qmd collection add templates/workflows --name templates-workflows --mask "**/*.md"

# UX guides
qmd collection add templates/ux-guides --name templates-ux --mask "**/*.md"

# Docs
qmd collection add docs --name docs --mask "**/*.md"

# Custom skills
qmd collection add skills --name skills --mask "**/*.md"

# Installed agent skills (SKILL.md files)
qmd collection add .claude/skills --name installed-skills --mask "**/SKILL.md"

# Accumulated knowledge
qmd collection add knowledge --name knowledge --mask "**/*.md"

# Suggestions
qmd collection add suggestions --name suggestions --mask "**/*.md"

# Inbox
qmd collection add inbox --name inbox --mask "**/*.md"

# Update the index
qmd update

echo "🧠 Creating vector embeddings..."
qmd embed

echo "✅ Indexing complete!"
qmd status
```

**Task 1.3: Add Collection Contexts**

QMD supports context annotations per path. Add descriptions so the agent understands what each collection contains:

```bash
qmd context add ".claude/commands" "Active slash commands for Claude Code. These define the agent's interactive workflow commands like /start-session, /end-session, /spawn-project, etc."

qmd context add "templates/commands" "Command documentation and guides that get copied to spawned projects. Reference docs, not executable commands."

qmd context add "templates/knowledge" "Framework and technology guides organized by category: web/nextjs, database/drizzle, auth/better-auth, monorepo/turborepo, patterns. These are copied to spawned projects based on their tech stack."

qmd context add "templates/skills" "Agent Skills (agentskills.io standard) that can be installed in spawned projects. Includes skill-mapping.json for category mapping."

qmd context add "docs" "Internal project documentation: detailed README, commands reference, style guide, workflow, feedback system, plugins, template sync."

qmd context add "skills" "Custom-built skills specific to this agent (e.g. canvas-panel-design)."

qmd context add "CLAUDE.md" "Master project instructions - monorepo structure, all commands, development workflow, branch protection, publishing, recent changes log."

qmd context add "LEARNINGS.md" "Session insights and lessons learned from coding sessions. Organized chronologically with what worked, what didn't, and patterns established."
```

**Task 1.4: Add to package.json Scripts**

```json
{
  "scripts": {
    "qmd:index": "bash scripts/qmd-index.sh",
    "qmd:update": "qmd update && qmd embed",
    "qmd:search": "qmd query",
    "qmd:status": "qmd status"
  }
}
```

---

### Phase 2: Integration with Agent Session Commands

**Task 2.1: Update `/start-session` to Use QMD Search**

Instead of relying solely on CLAUDE.md being loaded in full, `/start-session` could search for relevant context based on the current branch name or recent work:

Add to `.claude/commands/start-session.md`:

```markdown
## Context Loading (QMD)

If QMD is available (`qmd status` succeeds), use semantic search to load relevant context:

1. Search for context related to current branch: `qmd query "<branch-name>" -n 5`
2. Check for handover documents: `qmd search "handover" -c docs -n 3`
3. Load relevant template knowledge if on a feature branch
```

**Task 2.2: Update `/discuss` to Search Knowledge**

When the user starts a discovery conversation, search existing knowledge:

```markdown
## Pre-Discussion Research

Before starting the discussion, search existing knowledge:
1. `qmd query "<topic>" -n 5` — find existing templates, guides, or learnings
2. `qmd query "<topic>" -c templates-knowledge -n 3` — check if we have framework guides
3. Summarize existing knowledge to avoid retreading covered ground
```

**Task 2.3: Update `/spawn-project` to Search Templates**

When selecting templates for a new project, use QMD to find relevant content:

```markdown
## Template Discovery

Use QMD to find relevant templates based on project requirements:
1. `qmd query "<tech-stack>" -c templates-knowledge` — matching framework guides
2. `qmd query "<project-type>" -c templates-commands` — relevant command guides
3. `qmd query "<feature-type>" -c templates-skills` — matching skills
```

**Task 2.4: Update `/get-feedback` to Search Learnings**

When processing feedback, search for related past learnings:

```markdown
## Context for Feedback

Before implementing feedback, search for related history:
1. `qmd query "<feedback-topic>" -c knowledge` — existing learnings
2. `qmd query "<feedback-topic>" -c root` — check LEARNINGS.md and CLAUDE.md
```

---

### Phase 3: MCP Server Integration

**Task 3.1: Configure QMD MCP Server**

QMD can run as an MCP server that Claude Code can query directly. This is the most powerful integration.

Add to `.claude/settings.json` (or `.claude/settings.local.json` for local dev):

```json
{
  "mcpServers": {
    "qmd": {
      "command": "qmd",
      "args": ["mcp"],
      "cwd": "/path/to/squared-agent"
    }
  }
}
```

This gives the agent direct access to `qmd_search`, `qmd_get`, and `qmd_query` tools without needing shell commands.

**Task 3.2: Document MCP Usage in CLAUDE.md**

Add a section to CLAUDE.md:

```markdown
## Semantic Search (QMD)

This project is indexed with QMD for semantic search. Use the QMD MCP tools:

- **qmd_query** — Hybrid search (BM25 + vector + reranking). Use for natural language questions.
- **qmd_search** — Full-text BM25 search. Use for keyword/exact-phrase lookups.
- **qmd_get** — Retrieve specific document by path. Use after search identifies a file.

### When to Search

| Scenario | Tool | Example |
|----------|------|---------|
| Find relevant template | qmd_query | "Next.js authentication setup" |
| Check if guide exists | qmd_search | "Better Auth" |
| Load specific file | qmd_get | "qmd://templates-knowledge/auth/better-auth/Better-Auth-Guide.md" |
| Find related learnings | qmd_query | "session workflow improvements" |

### Collections

| Collection | Content |
|-----------|---------|
| `commands` | Active slash commands |
| `templates-commands` | Command guides for spawned projects |
| `templates-knowledge` | Framework & tech guides |
| `templates-skills` | Agent skill definitions |
| `docs` | Internal documentation |
| `root` | CLAUDE.md, LEARNINGS.md, README.md |
| `knowledge` | Accumulated learnings |

**Search first, then load.** Don't read entire guide files when you only need a specific section.
```

---

### Phase 4: CLAUDE.md Optimization

**Task 4.1: Slim Down CLAUDE.md**

With QMD available, CLAUDE.md doesn't need to contain everything. The 40KB file can be reduced to:

1. **Keep:** Project overview, quick commands, key principles, branch protection rule
2. **Move to searchable docs:** Recent Changes log (→ `docs/changelog.md`), full command documentation, detailed template listings, app/package tables
3. **Replace with search instructions:** Instead of listing all commands with descriptions, point to QMD search

Estimated reduction: 40KB → ~15KB, with the rest discoverable via search.

**Task 4.2: Create `docs/changelog.md`**

Move the "Recent Changes" section (currently ~60% of CLAUDE.md) to a dedicated changelog file that QMD indexes. The agent can search for recent changes when needed rather than loading them every session.

---

### Phase 5: Automated Re-indexing

**Task 5.1: Git Hook for Re-indexing**

Create `.githooks/post-commit`:

```bash
#!/usr/bin/env bash
# Re-index QMD after commits that change markdown files
if git diff --name-only HEAD~1 HEAD 2>/dev/null | grep -q '\.md$'; then
  qmd update &>/dev/null &
fi
```

**Task 5.2: Integration with `/end-session`**

Add to the end-session workflow:

```markdown
## Re-index (if QMD available)

If QMD is set up, re-index after session changes:
1. `qmd update` — re-index changed files
2. `qmd embed` — update vector embeddings for new/changed content
```

**Task 5.3: Integration with `/sync-templates`**

After template sync, trigger re-index so search reflects latest templates.

---

### Phase 6: Spawned Project Inheritance

**Task 6.1: Add QMD Setup to Developer Profile**

Update `templates/profiles/developer/SETUP-INSTRUCTIONS.md` to include QMD setup:

```markdown
## Semantic Search (Optional)

For large projects, set up QMD for semantic search across project knowledge:

1. Install: `bun install -g qmd`
2. Index: `pnpm qmd:index`
3. Search: `qmd query "your question"`

The agent can search templates, knowledge, and docs instead of loading everything into context.
```

**Task 6.2: Update `/spawn-project` Template Generation**

When generating projects, include a minimal QMD setup script that indexes:
- Inherited knowledge guides
- Inherited command guides
- Project-specific docs
- The project's CLAUDE.md

---

## Dependency & Config Changes

### Dependencies

- **QMD** (`bun install -g qmd`) — already installed, no new deps needed
- **Bun** — already available (`/home/clawd/.bun/bin/bun`)
- No changes to `package.json` dependencies (QMD is a global CLI tool, not a package dep)

### New Files

| File | Purpose |
|------|---------|
| `scripts/qmd-index.sh` | Collection setup and initial indexing |
| `.githooks/post-commit` | Auto re-index on markdown changes |
| `docs/changelog.md` | Moved from CLAUDE.md Recent Changes section |

### Modified Files

| File | Change |
|------|--------|
| `package.json` | Add `qmd:*` scripts |
| `CLAUDE.md` | Add QMD section, slim down content |
| `.claude/commands/start-session.md` | Add QMD context loading |
| `.claude/commands/end-session.md` | Add QMD re-indexing step |
| `.claude/commands/discuss.md` | Add knowledge search before discussion |
| `.claude/commands/spawn-project.md` | Add template discovery via search |
| `.claude/commands/get-feedback.md` | Add learnings search |
| `.claude/commands/sync-templates.md` | Add re-index after sync |
| `.claude/settings.json` or `.claude/settings.local.json` | Add QMD MCP server |
| `templates/profiles/developer/SETUP-INSTRUCTIONS.md` | Add QMD setup instructions |
| `.gitignore` | Add `.qmd-cache/` or equivalent if local cache |

---

## Task Checklist (Ordered)

### Phase 1 — Foundation (~1 session)
- [ ] Create `scripts/qmd-index.sh` with all collection definitions
- [ ] Run initial indexing and verify all 204 files are captured
- [ ] Add collection context annotations
- [ ] Add `qmd:*` scripts to `package.json`
- [ ] Test searches across collections: `qmd query "Next.js authentication"`, `qmd search "spawn project" -c commands`, etc.
- [ ] Verify vector search works: `qmd vsearch "how to create a new project"`

### Phase 2 — Command Integration (~1 session)
- [ ] Update `/start-session` with QMD context loading
- [ ] Update `/discuss` with knowledge pre-search
- [ ] Update `/spawn-project` with template discovery
- [ ] Update `/get-feedback` with learnings search
- [ ] Test each command with QMD available and unavailable (graceful fallback)

### Phase 3 — MCP Server (~0.5 session)
- [ ] Configure QMD MCP in `.claude/settings.json`
- [ ] Document QMD tools in CLAUDE.md
- [ ] Test MCP integration with Claude Code
- [ ] Verify tool availability in agent sessions

### Phase 4 — CLAUDE.md Optimization (~0.5 session)
- [ ] Create `docs/changelog.md` from Recent Changes
- [ ] Slim CLAUDE.md (remove duplicate info now searchable)
- [ ] Update cross-references
- [ ] Verify agent can still find everything via search that was previously in CLAUDE.md

### Phase 5 — Automation (~0.5 session)
- [ ] Create `.githooks/post-commit` for auto re-index
- [ ] Update `/end-session` with re-indexing step
- [ ] Update `/sync-templates` with re-indexing
- [ ] Test full workflow: edit → commit → verify index updated

### Phase 6 — Spawned Projects (~0.5 session)
- [ ] Update developer profile SETUP-INSTRUCTIONS.md
- [ ] Update `/spawn-project` to include QMD setup script in generated projects
- [ ] Test spawning a project and verifying QMD works in the child

---

## Success Criteria

1. **Agent can find any template/guide/command via natural language search** without the user specifying file paths
2. **CLAUDE.md is ≤15KB** (down from 40KB), reducing base context cost per session
3. **All 204+ markdown files are indexed** across 13 collections
4. **Search latency <500ms** for BM25, <2s for hybrid query
5. **Graceful fallback** — commands work without QMD (just less efficiently)
6. **Spawned projects can optionally inherit QMD** with minimal setup

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| QMD not available in spawned projects | All command changes include graceful fallback (`if qmd status...`) |
| Vector embedding takes too long | Run `qmd embed` asynchronously; BM25 search works without vectors |
| CLAUDE.md too slim for new users | Keep essential quick-start info in CLAUDE.md; only move reference material to searchable docs |
| Index gets stale | Git hooks + end-session re-index; `qmd update` is fast for incremental changes |
| MCP server not supported in all environments | Shell-based `qmd query` as universal fallback |

---

## Notes

- QMD stores its index at `~/.cache/qmd/index.sqlite` by default (can be overridden with `--index`)
- Models are auto-downloaded from HuggingFace on first use: `embeddinggemma-300M-Q8_0` (embedding), `qwen3-reranker-0.6b-q8_0` (reranking), `Qwen3-0.6B-Q8_0` (query expansion)
- The OpenClaw gateway manages a separate QMD index per agent at `~/.openclaw/agents/<id>/qmd/xdg-cache/qmd/index.sqlite`
- For Squared Agent, QMD would use its own index (not shared with OpenClaw's agent memory)
- Collection paths in QMD are relative to where `qmd collection add` is run from
