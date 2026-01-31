# Skills & MCP Servers

Two systems extend the agent's capabilities: **Agent Skills** (portable capabilities) and **MCP Servers** (external service integrations).

---

## Agent Skills

[Agent Skills](https://agentskills.io/home) is an open standard for giving AI agents new capabilities. Skills are portable across Claude Code, Cursor, VS Code, Gemini CLI, and more.

### How Skills Work

- Skills install to `.claude/skills/` and are auto-loaded
- Each skill is a markdown file with instructions the agent follows
- Skills are different from Claude Code plugins — they're portable across tools

### Installing Skills

```bash
# Install from default repository (anthropics/skills)
npx skills add anthropics/skills -s frontend-design

# Install from other repositories
npx skills add vercel-labs/agent-skills
npx skills add better-auth/skills
npx skills add https://github.com/vercel/turborepo --skill turborepo
```

Or use the `/add-skill` command which also catalogues skills for spawned projects.

### Recommended Skills by Category

#### Web Development

| Skill | Source | Purpose |
|-------|--------|---------|
| **frontend-design** | anthropics/skills | Production-grade UI without generic AI aesthetics |
| **webapp-testing** | anthropics/skills | End-to-end web application testing |
| **web-artifacts-builder** | anthropics/skills | Build interactive web components |
| **theme-factory** | anthropics/skills | Generate consistent design themes |
| **vercel-react-best-practices** | vercel-labs/agent-skills | React/Next.js performance optimization (45 rules) |
| **web-design-guidelines** | vercel-labs/agent-skills | UI code review for accessibility, UX, design |

#### Authentication

| Skill | Source | Purpose |
|-------|--------|---------|
| **create-auth** | better-auth/skills | Guide for adding Better Auth to apps |
| **better-auth-best-practices** | better-auth/skills | Integration patterns for Better Auth |

#### Monorepo

| Skill | Source | Purpose |
|-------|--------|---------|
| **turborepo** | vercel/turborepo | Turborepo patterns, caching, CI/CD (900+ lines) |

#### AI Development

| Skill | Source | Purpose |
|-------|--------|---------|
| **ai-sdk** | vercel/ai | Vercel AI SDK for agents, chatbots, streaming |

#### Documents & Office

| Skill | Source | Purpose |
|-------|--------|---------|
| **docx** | anthropics/skills | Word document creation and editing |
| **pptx** | anthropics/skills | PowerPoint presentation creation |
| **xlsx** | anthropics/skills | Excel spreadsheet manipulation |
| **pdf** | anthropics/skills | PDF document handling |

#### Development Tools

| Skill | Source | Purpose |
|-------|--------|---------|
| **mcp-builder** | anthropics/skills | Create MCP servers for tool integration |
| **skill-creator** | anthropics/skills | Create new agent skills |

### Skills in Spawned Projects

The master agent tracks installed skills in `templates/skills/skill-mapping.json`. When you run `/spawn-project`, it recommends skills based on the project's knowledge categories.

Spawned projects install skills fresh via `npx skills add` — they're not copied from the master agent. This ensures spawned projects get the latest skill versions.

---

## MCP Servers (via Toolhive)

[Toolhive](https://toolhive.ai) manages MCP (Model Context Protocol) servers that connect Claude to external services.

### What is MCP?

MCP is a protocol that lets Claude interact with external tools and services. Each MCP server exposes a set of tools the agent can call.

### Available MCP Servers

| Server | What it provides |
|--------|------------------|
| **GitHub** | Full repo, PR, and issue management |
| **Perplexity** | AI-powered search with reasoning |
| **FireCrawl** | Web scraping at scale |
| **DataForSeo** | SEO and keyword research |
| **n8n** | Workflow automation |
| **ShadCN** | UI component lookup |
| **Context7** | Library documentation lookup |

### How Toolhive Works

Toolhive is a plugin (`toolhive-mcp-optimizer@claude-plugins-official`) that manages MCP servers. It:

1. Starts MCP servers on demand
2. Routes tool calls to the appropriate server
3. Handles authentication and credentials
4. Optimizes which servers to load based on context

### Configuring MCP Servers

MCP servers are configured globally (not per-project). Configuration typically lives in:

- `~/.toolhive/` — Toolhive configuration
- Environment variables for API keys (Perplexity, FireCrawl, etc.)

### When to Use MCP vs Skills

| Use Case | MCP | Skills |
|----------|-----|--------|
| External API access (GitHub, search) | Yes | No |
| Patterns and best practices | No | Yes |
| Requires credentials | Yes | No |
| Portable across tools | No | Yes |
| Real-time data | Yes | No |

**MCP** = Connect to external services
**Skills** = Teach the agent new patterns

---

## Tool Intelligence

The agent learns which tools work best for which tasks over time.

**Location:** `.project/tool-intelligence.md` (gitignored)

**What gets tracked:**
- Toolhive MCP shortcuts (which servers for which tasks)
- Plugin usage patterns
- Browser automation tips
- Core tool efficiency

`/end-session` updates this file with patterns learned during the session. `/start-session` loads it at the start of each session.

---

## Quick Reference

### Install a skill
```bash
npx skills add anthropics/skills -s frontend-design
```

### Catalogue a skill for spawned projects
```
/add-skill anthropics/skills -s frontend-design
```

### Check installed skills
```bash
ls .claude/skills/
```

### See available MCP servers
```
/list-tools
```

---

## Further Reading

- [Agent Skills website](https://agentskills.io/home)
- [Toolhive website](https://toolhive.ai)
- [MCP specification](https://modelcontextprotocol.io)
- [Plugins & Configuration](plugins.md) — Claude Code plugins (different from skills)
