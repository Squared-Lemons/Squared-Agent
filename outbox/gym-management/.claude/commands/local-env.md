---
description: Manage local development environment (domains, HTTPS, proxy)
allowed-tools: Bash, Read, Write, AskUserQuestion
---

# Local Environment Manager

Manage friendly local domains with trusted HTTPS for development.

**Arguments**: `$ARGUMENTS` - Subcommand: init, setup, start, stop, status, list, or help

---

## Parse Subcommand

Check `$ARGUMENTS` for the subcommand and route accordingly:

| Subcommand | Action |
|------------|--------|
| `init` | First-time machine setup |
| `setup` | Configure this project |
| `start` | Start the proxy |
| `stop` | Stop the proxy |
| `status` | Show current config |
| `list` | List all registered projects |
| Empty/`help` | Show help |

---

## Subcommand: help (default)

If `$ARGUMENTS` is empty or "help":

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Local Environment Commands
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/local-env init    First-time machine setup (mkcert, certs, proxy)
/local-env setup   Configure this project's domain and port
/local-env start   Start the proxy server
/local-env stop    Stop the proxy server
/local-env status  Show current configuration
/local-env list    List all registered projects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Subcommand: init

First-time machine setup. Run once per machine.

### Step 1: Check mkcert

```bash
which mkcert || echo "MKCERT_NOT_FOUND"
```

If not found:
```
mkcert is required for trusted local HTTPS.

Install with: brew install mkcert

Then run /local-env init again.
```
Stop execution.

### Step 2: Check if Already Initialized

```bash
ls ~/.squared-agent/certs/wildcard.local.pem 2>/dev/null && echo "ALREADY_INITIALIZED" || echo "NOT_INITIALIZED"
```

If already initialized, ask:
- **Reinitialize** - Start fresh
- **Cancel** - Keep existing setup

### Step 3: Install mkcert CA

Show what will happen:
```
Installing mkcert's certificate authority.
This adds a root CA to your system trust store so browsers trust local certs.
You'll be prompted for your password.
```

```bash
mkcert -install
```

### Step 4: Create Directory Structure

```bash
mkdir -p ~/.squared-agent/certs
```

### Step 5: Generate Wildcard Certificate

```bash
cd ~/.squared-agent/certs && mkcert "*.local" "localhost" "127.0.0.1" "::1"
```

Rename for clarity:
```bash
cd ~/.squared-agent/certs && mv "_wildcard.local+3.pem" "wildcard.local.pem" 2>/dev/null; mv "_wildcard.local+3-key.pem" "wildcard.local-key.pem" 2>/dev/null
```

### Step 6: Ask Proxy Preference

Use AskUserQuestion:
- **Caddy** (Recommended) - Best for multiple projects, simple config
- **Node proxy** - No extra install needed, lighter weight

### Step 7: Setup Chosen Proxy

**If Caddy:**

Check if installed:
```bash
which caddy || echo "CADDY_NOT_FOUND"
```

If not found:
```
Caddy is not installed.

Install with: brew install caddy

Then run /local-env init again, or choose Node proxy instead.
```

Create Caddyfile:
```bash
cat > ~/.squared-agent/Caddyfile << 'EOF'
{
    auto_https off
}

# Projects will be added here by /local-env setup
EOF
```

**If Node:**

Create proxy script and install dependency:
```bash
cd ~/.squared-agent && npm init -y 2>/dev/null
npm install http-proxy 2>/dev/null
```

Create `~/.squared-agent/proxy.mjs` with the proxy script content.

### Step 8: Create Config File

```bash
cat > ~/.squared-agent/config.json << EOF
{
  "proxyType": "[caddy|node]",
  "initialized": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

### Step 9: Create Empty Registry

```bash
cat > ~/.squared-agent/registry.json << 'EOF'
{
  "projects": {},
  "nextRangeStart": 3100,
  "rangeSize": 50,
  "reservedPorts": [3000, 4000, 5173, 8080, 8000, 8888]
}
EOF
```

Port allocation strategy:
- Each project gets a range of 50 ports (e.g., 3100-3149)
- Ranges starting at 3100, 3150, 3200, etc.
- Reserved ports (common dev defaults) are skipped
- Primary port is first in range, additional ports available for services

### Step 10: Confirm

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Local Environment Initialized
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- mkcert CA installed (browsers will trust local certs)
- Wildcard certificate generated for *.local
- [Caddy/Node] proxy configured

Next: Run /local-env setup in your project to configure its domain.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Subcommand: setup

Configure local environment for the current project.

### Step 1: Check Initialization

```bash
ls ~/.squared-agent/certs/wildcard.local.pem 2>/dev/null || echo "NOT_INITIALIZED"
```

If not initialized:
```
Local environment not initialized.
Run /local-env init first.
```
Stop execution.

### Step 2: Check if Already Configured

```bash
cat .project/local-env.json 2>/dev/null || echo "NOT_CONFIGURED"
```

If already configured, show current config and ask:
- **Reconfigure** - Change settings
- **Cancel** - Keep existing

### Step 3: Get Project Name

```bash
basename "$(pwd)"
```

Use this to suggest domain name.

### Step 4: Ask Domain

Use AskUserQuestion with options:
- **[projectname].local** (Recommended)
- **Custom** - Let user type custom domain

If custom, ask for the domain name.

### Step 5: Auto-Allocate Port Range

Read registry:
```bash
cat ~/.squared-agent/registry.json
```

Get `nextRangeStart` value. This project gets ports `nextRangeStart` to `nextRangeStart + 49`.

Display allocated range:
```
Port range allocated: [start]-[start+49]
Primary port: [start] (configure your dev server to use this)
Additional ports available for backend services, databases, etc.
```

### Step 6: Show Hosts File Change

Display what will be added:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Hosts File Update Required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

I need to add this line to /etc/hosts:

    127.0.0.1   [domain].local

This maps your custom domain to localhost.
Requires sudo (your password).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use AskUserQuestion:
- **Proceed** - Add to hosts file (requires password)
- **Skip** - I'll add it manually later

If proceed, tell user to run in terminal:
```bash
echo "127.0.0.1   [domain].local" | sudo tee -a /etc/hosts
```

### Step 7: Update Registry

Read current registry, add new project with port range, increment nextRangeStart:

```json
{
  "projects": {
    "[domain].local": {
      "portRange": [3100, 3149],
      "primaryPort": 3100,
      "path": "/full/path/to/project",
      "configured": "2026-01-19T10:00:00Z"
    }
  },
  "nextRangeStart": 3150
}
```

### Step 8: Update Proxy Config

Read `~/.squared-agent/config.json` for proxyType.

**If Caddy:**

Append to Caddyfile:
```
[domain].local {
    reverse_proxy localhost:[primaryPort]
    tls ~/.squared-agent/certs/wildcard.local.pem ~/.squared-agent/certs/wildcard.local-key.pem
}
```

Reload if running:
```bash
pgrep -x caddy && caddy reload --config ~/.squared-agent/Caddyfile
```

**If Node:**

Update routes object in `~/.squared-agent/proxy.mjs`.

### Step 9: Create Project Config

```bash
mkdir -p .project
cat > .project/local-env.json << EOF
{
  "domain": "[domain].local",
  "portRange": [[start], [end]],
  "primaryPort": [start],
  "https": true,
  "configured": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
```

### Step 10: Confirm

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Project Configured
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Domain:      https://[domain].local
Port range:  [start]-[end] (50 ports reserved)
Primary:     [start] (Caddy proxies HTTPS → this port)

To start developing:
1. Configure dev server to use port [start]
   Example: next dev -p [start]
2. Start the proxy:  /local-env start
3. Open browser:     https://[domain].local

Additional ports [start+1]-[end] available for:
- Backend API servers
- Database admin UIs
- Other services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Subcommand: start

Start the proxy server.

### Step 1: Check Config

```bash
cat ~/.squared-agent/config.json 2>/dev/null || echo "NOT_INITIALIZED"
```

If not initialized, prompt to run `/local-env init`.

### Step 2: Get Proxy Type

Read `proxyType` from config.

### Step 3: Start Proxy

**If Caddy:**

```bash
pgrep -x caddy && echo "ALREADY_RUNNING" || caddy start --config ~/.squared-agent/Caddyfile
```

**If Node:**

```bash
pgrep -f "proxy.mjs" && echo "ALREADY_RUNNING" || echo "START_NEEDED"
```

If start needed:
```
The Node proxy needs to run on port 443 (HTTPS).
This requires sudo. You'll be prompted for your password.
```

```bash
sudo node ~/.squared-agent/proxy.mjs &
```

### Step 4: Confirm

```
✓ Proxy started

Your projects are available at their configured domains.
Run /local-env list to see all registered domains.
```

---

## Subcommand: stop

Stop the proxy server.

### Step 1: Get Proxy Type

```bash
cat ~/.squared-agent/config.json | grep proxyType
```

### Step 2: Stop Proxy

**If Caddy:**
```bash
caddy stop 2>/dev/null || echo "NOT_RUNNING"
```

**If Node:**
```bash
sudo pkill -f "proxy.mjs" 2>/dev/null || echo "NOT_RUNNING"
```

### Step 3: Confirm

```
✓ Proxy stopped
```

---

## Subcommand: status

Show current configuration.

### Step 1: Check Project Config

```bash
cat .project/local-env.json 2>/dev/null || echo "NOT_CONFIGURED"
```

### Step 2: Check Proxy Status

```bash
pgrep -x caddy || pgrep -f "proxy.mjs" || echo "NOT_RUNNING"
```

### Step 3: Display Status

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Local Environment Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Project:     [current directory name]
Domain:      https://[domain].local
Port range:  [start]-[end]
Primary:     [primaryPort]

Proxy:       [Caddy/Node] - [Running ✓ / Stopped ✗]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If not configured:
```
This project is not configured for local environment.
Run /local-env setup to configure.
```

---

## Subcommand: list

List all registered projects.

### Step 1: Read Registry

```bash
cat ~/.squared-agent/registry.json 2>/dev/null || echo "NO_REGISTRY"
```

### Step 2: Display Projects

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Registered Projects
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

| Domain              | Port Range  | Primary | Path                    |
|---------------------|-------------|---------|-------------------------|
| myproject.local     | 3100-3149   | 3100    | /Users/me/dev/myproject |
| otherapp.local      | 3150-3199   | 3150    | /Users/me/dev/otherapp  |

Proxy: [Caddy/Node] - [Running/Stopped]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

If no projects:
```
No projects registered yet.
Run /local-env setup in a project to register it.
```

---

## Execution Instructions

1. Parse `$ARGUMENTS` for subcommand
2. If empty or "help", show help message
3. Route to appropriate subcommand section
4. For privileged operations:
   - Show exactly what will happen
   - Request explicit permission via AskUserQuestion
   - Provide option to skip and do manually
5. Always show clear confirmation messages
