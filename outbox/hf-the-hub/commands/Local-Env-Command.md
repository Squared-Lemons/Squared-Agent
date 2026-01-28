# Local-Env Command - Implementation Guide

A Claude Code command for managing local development environments with friendly domains and trusted HTTPS.

---

## Overview

The `/local-env` command manages local development setup including:
- Custom `.local` domains
- Trusted HTTPS via mkcert
- Reverse proxy (Caddy or Node-based)
- Automatic port allocation
- Hosts file management

### Subcommands

| Subcommand | Action |
|------------|--------|
| `/local-env init` | First-time machine setup |
| `/local-env setup` | Configure this project |
| `/local-env start` | Start the proxy |
| `/local-env stop` | Stop the proxy |
| `/local-env status` | Show current config |
| `/local-env list` | List all registered projects |

---

## Files to Create

### Main Command: `.claude/commands/local-env.md`

```markdown
---
description: Manage local development environment (domains, HTTPS, proxy)
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Local Environment Manager

Manage friendly local domains with trusted HTTPS for development.

**Arguments**: Subcommand - init, setup, start, stop, status, or list

---

## Parse Subcommand

Check `$ARGUMENTS` for the subcommand:
- `init` → First-time setup
- `setup` → Project setup
- `start` → Start proxy
- `stop` → Stop proxy
- `status` → Show status
- `list` → List projects
- Empty → Show help

---

## Subcommand: init

First-time machine setup. Run once per machine.

### Step 1: Check Prerequisites

\```bash
which mkcert || echo "MKCERT_NOT_FOUND"
\```

If mkcert not found:
\```
mkcert is required for trusted local HTTPS.

Install with: brew install mkcert

Then run /local-env init again.
\```

### Step 2: Install mkcert CA

\```bash
mkcert -install 2>&1
\```

This adds mkcert's root CA to your system. Requires password.

### Step 3: Create Directory Structure

\```bash
mkdir -p ~/.squared-agent/certs
\```

### Step 4: Generate Wildcard Certificate

\```bash
cd ~/.squared-agent/certs && mkcert "*.local" "localhost" "127.0.0.1" "::1"
\```

Rename for clarity:
\```bash
cd ~/.squared-agent/certs
mv "_wildcard.local+3.pem" "wildcard.local.pem" 2>/dev/null || true
mv "_wildcard.local+3-key.pem" "wildcard.local-key.pem" 2>/dev/null || true
\```

### Step 5: Ask Proxy Preference

Use AskUserQuestion:
- **Caddy** (Recommended) - Best for multiple projects
- **Node proxy** - Simpler, no extra install

Save preference to `~/.squared-agent/config.json`:
\```json
{
  "proxyType": "caddy"
}
\```

### Step 6: Setup Proxy

**If Caddy:**
\```bash
which caddy || echo "CADDY_NOT_FOUND"
\```

If not found, prompt to install: `brew install caddy`

Create empty Caddyfile:
\```
# ~/.squared-agent/Caddyfile
{
    auto_https off
}

# Projects will be added here by /local-env setup
\```

**If Node:**
Create proxy script at `~/.squared-agent/proxy.mjs` (see knowledge guide for content).

Install dependency:
\```bash
cd ~/.squared-agent && npm init -y && npm install http-proxy
\```

### Step 7: Confirm

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Local Environment Initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- mkcert CA installed
- Wildcard certificate generated
- [Caddy/Node] proxy configured

Next: Run /local-env setup in your project to configure its domain.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Subcommand: setup

Configure local environment for the current project.

### Step 1: Check Init

\```bash
ls ~/.squared-agent/certs/wildcard.local.pem 2>/dev/null || echo "NOT_INITIALIZED"
\```

If not initialized:
\```
Local environment not initialized.
Run /local-env init first.
\```

### Step 2: Get Project Info

\```bash
basename $(pwd)
\```

Use this to suggest domain name.

### Step 3: Ask Domain

Use AskUserQuestion with suggested domain:
- **[projectname].local** (Recommended)
- **Custom domain** - Enter your own

### Step 4: Allocate Port

Read registry:
\```bash
cat ~/.squared-agent/registry.json 2>/dev/null || echo '{"projects":{},"nextPort":3001}'
\```

Get next available port from registry.

### Step 5: Ask Dev Server Port

Use AskUserQuestion:
- **3000** (Next.js default)
- **5173** (Vite default)
- **Custom** - Enter port

### Step 6: Show Hosts File Change

Display what will be added:
\```
I need to add this line to /etc/hosts:
127.0.0.1   [domain].local

This requires your password (sudo).
\```

Use AskUserQuestion:
- **Proceed** - Add to hosts file
- **Skip** - I'll add it manually

If proceed:
\```bash
echo "127.0.0.1   [domain].local" | sudo tee -a /etc/hosts
\```

### Step 7: Update Registry

Add project to `~/.squared-agent/registry.json`:
\```json
{
  "projects": {
    "[domain].local": {
      "port": 3001,
      "path": "/full/path/to/project",
      "devPort": 3000,
      "lastUsed": "2026-01-19T10:00:00Z"
    }
  },
  "nextPort": 3002
}
\```

### Step 8: Update Proxy Config

**If Caddy:**
Add block to `~/.squared-agent/Caddyfile`:
\```
[domain].local {
    reverse_proxy localhost:[devPort]
    tls ~/.squared-agent/certs/wildcard.local.pem ~/.squared-agent/certs/wildcard.local-key.pem
}
\```

Reload if running:
\```bash
caddy reload --config ~/.squared-agent/Caddyfile 2>/dev/null || true
\```

**If Node:**
Update routes in `~/.squared-agent/proxy.mjs`.

### Step 9: Save Project Config

Create `.project/local-env.json`:
\```json
{
  "domain": "[domain].local",
  "devPort": 3000,
  "https": true
}
\```

### Step 10: Confirm

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Project Configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Domain: https://[domain].local
Dev server: localhost:[devPort]

To start:
1. Run your dev server: pnpm dev
2. Start proxy: /local-env start
3. Open: https://[domain].local

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Subcommand: start

Start the proxy server.

### Check Proxy Type

\```bash
cat ~/.squared-agent/config.json | grep proxyType
\```

### If Caddy

\```bash
# Check if already running
pgrep -x caddy && echo "ALREADY_RUNNING" || caddy start --config ~/.squared-agent/Caddyfile
\```

### If Node

\```bash
# Check if already running
pgrep -f "proxy.mjs" && echo "ALREADY_RUNNING" || echo "START_NEEDED"
\```

If needs start:
\```
The Node proxy requires sudo for port 443.

Starting: sudo node ~/.squared-agent/proxy.mjs

You'll be prompted for your password.
\```

\```bash
sudo node ~/.squared-agent/proxy.mjs &
\```

### Confirm

\```
✓ Proxy started

Your project is available at: https://[domain].local
\```

---

## Subcommand: stop

Stop the proxy server.

### If Caddy

\```bash
caddy stop
\```

### If Node

\```bash
sudo pkill -f "proxy.mjs"
\```

### Confirm

\```
✓ Proxy stopped
\```

---

## Subcommand: status

Show current configuration.

### Read Project Config

\```bash
cat .project/local-env.json 2>/dev/null || echo "NOT_CONFIGURED"
\```

### Check Proxy Status

\```bash
pgrep -x caddy || pgrep -f "proxy.mjs" || echo "NOT_RUNNING"
\```

### Display

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Local Environment Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project: [project name]
Domain:  https://[domain].local
Dev port: [devPort]

Proxy:   [Caddy/Node] - [Running/Stopped]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Subcommand: list

List all registered projects.

### Read Registry

\```bash
cat ~/.squared-agent/registry.json
\```

### Display

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Registered Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Domain | Dev Port | Path |
|--------|----------|------|
| myproject.local | 3000 | /path/to/project |
| otherapp.local | 3002 | /path/to/other |

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Subcommand: help (default)

If no subcommand provided:

\```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Local Environment Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/local-env init    First-time machine setup
/local-env setup   Configure this project
/local-env start   Start the proxy
/local-env stop    Stop the proxy
/local-env status  Show current config
/local-env list    List all projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\```

---

## Execution Instructions

1. Parse `$ARGUMENTS` for subcommand
2. If empty, show help
3. Route to appropriate subcommand handler
4. For privileged operations (hosts file, port 443), explain and request permission
5. Always show clear success/error messages
```

---

## Integration with Other Commands

### /start-session

Add check for local-env config:

```markdown
## Step X: Check Local Environment

\```bash
cat .project/local-env.json 2>/dev/null || echo "NO_LOCAL_ENV"
\```

If configured, display:
\```
Local URL: https://[domain].local
\```
```

### /spawn-project

Include local-env command when packaging:

```markdown
## Optional: Local Environment

Ask: "Include local environment setup?"

If yes:
- Copy local-env.md to commands/
- Copy Local-Environment-Guide.md to knowledge/
- Add note to SETUP.md
```

---

## Setup Requirements

### Directory Structure

```
~/.squared-agent/
├── config.json          # Proxy preference
├── registry.json        # Project registry
├── Caddyfile            # Caddy config (if using Caddy)
├── proxy.mjs            # Node proxy (if using Node)
├── package.json         # For Node proxy deps
└── certs/
    ├── wildcard.local.pem
    └── wildcard.local-key.pem

project/
└── .project/
    └── local-env.json   # Project-specific config
```

### Gitignore

`.project/` should already be gitignored. If not:

```gitignore
.project/
```
