# Proposal: Local Environment Setup System

A system for spawned projects to manage local development environments with friendly domains, trusted HTTPS, and automatic port allocation.

---

## Problem Statement

When working with multiple spawned projects simultaneously:

1. **Port collisions** - Every Next.js app defaults to 3000, causing conflicts
2. **No trusted HTTPS** - Browser warnings, OAuth callbacks fail, secure cookie issues
3. **Ugly URLs** - `localhost:3000` vs `myproject.local`
4. **Manual setup** - Each project requires individual environment configuration
5. **No coordination** - Projects don't know about each other's port usage

## Proposed Solution

A coordinated local environment system with three components:

```
┌─────────────────────────────────────────────────────────────┐
│                    Master Agent                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  templates/knowledge/local-env/                     │   │
│  │  - Local-Environment-Guide.md (mkcert + Caddy)      │   │
│  │  - Port-Registry.md (port allocation rules)         │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  templates/commands/                                │   │
│  │  - local-env.md (manage local environment)          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Spawned Project                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  .project/local-env.json                            │   │
│  │  {                                                  │   │
│  │    "domain": "myproject.local",                     │   │
│  │    "port": 3001,                                    │   │
│  │    "https": true                                    │   │
│  │  }                                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  .claude/commands/local-env.md                      │   │
│  │  - /local-env setup   → Configure domain + port     │   │
│  │  - /local-env start   → Start Caddy proxy           │   │
│  │  - /local-env status  → Show current config         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 Global Registry (User's Machine)            │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ~/.squared-agent/                                  │   │
│  │  ├── Caddyfile           (all project proxies)      │   │
│  │  ├── certs/              (mkcert certificates)      │   │
│  │  │   ├── _wildcard.local.pem                        │   │
│  │  │   └── _wildcard.local-key.pem                    │   │
│  │  └── registry.json       (port allocations)         │   │
│  │      {                                              │   │
│  │        "myproject.local": { "port": 3001, "path": "..." },│
│  │        "otherapp.local": { "port": 3002, "path": "..." } │
│  │      }                                              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Components to Create

### 1. Knowledge Guide: `templates/knowledge/local-env/Local-Environment-Guide.md`

Comprehensive guide covering:

- **Prerequisites**: mkcert installation, Caddy installation
- **One-time setup**: `mkcert -install`, wildcard cert generation
- **How it works**: mkcert CA, Caddy reverse proxy, hosts file
- **Troubleshooting**: Browser trust issues, port conflicts, DNS resolution

### 2. Command: `templates/commands/Local-Env-Command.md`

Command guide for `/local-env` with subcommands:

| Subcommand | Action |
|------------|--------|
| `/local-env setup` | Configure domain and port for this project |
| `/local-env start` | Start Caddy proxy (if not running) |
| `/local-env stop` | Stop Caddy proxy |
| `/local-env status` | Show current config and running state |
| `/local-env list` | Show all registered projects |

### 3. Project Config: `.project/local-env.json`

Per-project configuration (gitignored):

```json
{
  "domain": "myproject.local",
  "port": 3001,
  "https": true,
  "devCommand": "pnpm dev",
  "devPort": 3000
}
```

Fields:
- `domain`: Custom local domain (e.g., `myproject.local`)
- `port`: External port Caddy listens on (unique per project)
- `https`: Whether to use HTTPS (default: true)
- `devCommand`: Command to start dev server
- `devPort`: Port the dev server runs on (Caddy proxies to this)

### 4. Global Registry: `~/.squared-agent/registry.json`

Central registry of all projects:

```json
{
  "projects": {
    "myproject.local": {
      "port": 3001,
      "path": "/Users/me/projects/myproject",
      "devPort": 3000,
      "lastUsed": "2026-01-19T10:00:00Z"
    }
  },
  "nextPort": 3002,
  "portRange": [3001, 3099]
}
```

### 5. Global Caddyfile: `~/.squared-agent/Caddyfile`

Auto-generated from registry:

```
{
    auto_https off
}

myproject.local {
    reverse_proxy localhost:3000
    tls ~/.squared-agent/certs/_wildcard.local.pem ~/.squared-agent/certs/_wildcard.local-key.pem
}

otherapp.local {
    reverse_proxy localhost:3002
    tls ~/.squared-agent/certs/_wildcard.local.pem ~/.squared-agent/certs/_wildcard.local-key.pem
}
```

---

## User Workflow

### First-Time Setup (Once per machine)

```
/local-env init
```

1. Checks for mkcert → prompts to install if missing
2. Runs `mkcert -install` to set up local CA
3. Generates wildcard cert: `mkcert "*.local" localhost 127.0.0.1`
4. Creates `~/.squared-agent/` directory structure
5. Adds hosts file entry reminder (requires sudo)

### Per-Project Setup

```
/local-env setup
```

1. Asks for preferred domain (suggests based on project name)
2. Allocates unique port from registry
3. Creates `.project/local-env.json`
4. Updates global `registry.json`
5. Regenerates `Caddyfile`
6. Adds hosts file entry (with sudo prompt)

### Daily Development

```
/local-env start
```

1. Ensures Caddy is running
2. Starts the dev server (`pnpm dev`)
3. Opens browser to `https://myproject.local`

Or just run your dev server normally - Caddy is already configured.

---

## Integration Points

### With `/prepare-setup`

When preparing a setup package, include:
- `local-env.md` command in commands/
- Reference to Local-Environment-Guide.md in knowledge/
- Note in SETUP.md about running `/local-env setup`

### With `/start-session`

Check if `.project/local-env.json` exists:
- If yes, show the configured URL: `https://myproject.local`
- If no, suggest: "Run `/local-env setup` for friendly local domain"

### With `/new-idea`

During project design, ask:
- "Would you like a custom local domain? (e.g., projectname.local)"
- Include preference in PROJECT-BRIEF.md

---

## Implementation Phases

### Phase 1: Knowledge Foundation
- Create `Local-Environment-Guide.md` with mkcert + Caddy setup
- Document manual process thoroughly
- Test on macOS (primary target)

### Phase 2: Command Automation
- Create `/local-env` command with setup/start/status
- Implement global registry
- Auto-generate Caddyfile

### Phase 3: Integration
- Integrate with `/prepare-setup` and `/start-session`
- Add to developer profile
- Update README with local env section

### Phase 4: Polish
- Add Windows support
- Add Linux support
- Handle edge cases (port conflicts, stale entries)

---

## Considerations

### Hosts File Editing
- Requires sudo on macOS/Linux
- Requires admin on Windows
- Options:
  1. Prompt user to run command manually
  2. Use dnsmasq for wildcard resolution (more complex)
  3. Use `lvh.me` or `sslip.io` (no hosts edit, but less pretty)

### Caddy as Dependency
- Not installed by default
- Could use nginx instead (more common but harder config)
- Could use Node-based proxy (no extra install, but more code)

**Recommendation**: Caddy is worth the install - simple config, auto-HTTPS, low resource usage.

### Port Allocation Strategy
- Reserve range 3001-3099 for spawned projects
- Each project gets unique port at setup time
- Stale entries cleaned up periodically

### Browser Trust
- mkcert handles this well on Chrome/Firefox/Safari
- Brave may need manual trust
- Document workarounds for each browser

---

## Alternative Approaches Considered

### 1. Use `localhost:PORT` only
- **Pro**: No setup required
- **Con**: No friendly URLs, no HTTPS, port collisions

### 2. Use `sslip.io` (e.g., `myproject.127.0.0.1.sslip.io`)
- **Pro**: No hosts file edit
- **Con**: Ugly URLs, self-signed certs

### 3. Per-project Caddy/mkcert
- **Pro**: Self-contained
- **Con**: Duplicate setup, multiple Caddy instances

### 4. Docker-based solution
- **Pro**: Isolated environments
- **Con**: Heavy, slow startup, overkill for dev

**Chosen approach**: Shared mkcert CA + single Caddy instance + global registry

---

## Files to Create

| File | Location | Purpose |
|------|----------|---------|
| Local-Environment-Guide.md | templates/knowledge/local-env/ | Setup guide |
| Local-Env-Command.md | templates/commands/ | Command implementation |
| local-env.md | Active command (.claude/commands/) | Working command |
| SETUP-INSTRUCTIONS update | templates/profiles/developer/ | Include local-env in setup |

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Default TLD | `.local` - intuitive and familiar |
| Hosts file | Automate with sudo, showing user what we're doing and requesting permission |
| Platform scope | macOS first, then expand |
| Proxy options | Offer both Caddy and Node-based proxy - user chooses during setup |

---

## Implementation Status

- [x] Proposal created and approved
- [x] Knowledge guide (Phase 1) - `templates/knowledge/local-env/Local-Environment-Guide.md`
- [x] Command template (Phase 2) - `templates/commands/Local-Env-Command.md`
- [x] Active command (Phase 2) - `.claude/commands/local-env.md`
- [x] Machine initialization tested (mkcert CA, Caddy, certs, registry)
- [ ] Integration with existing commands (Phase 3)
- [ ] Full testing on spawned project
