# Local Environment Guide

Friendly local domains with trusted HTTPS for development projects.

---

## Overview

This guide sets up local development with:
- **Custom domains** - `myproject.local` instead of `localhost:3000`
- **Trusted HTTPS** - No browser warnings, OAuth works, secure cookies work
- **Multi-project support** - Each project gets its own domain and port

### Before and After

| Before | After |
|--------|-------|
| `http://localhost:3000` | `https://myproject.local` |
| Browser security warnings | Trusted green lock |
| Port conflicts between projects | Each project has unique port |
| OAuth redirect failures | OAuth callbacks work |

---

## Prerequisites

### Required: mkcert

mkcert creates locally-trusted certificates. Install once per machine.

**macOS:**
```bash
brew install mkcert
mkcert -install
```

The `-install` command adds mkcert's root CA to your system trust store. You'll see a prompt for your password.

### Choose Your Proxy

Pick one based on your needs:

| Option | Best For | Install |
|--------|----------|---------|
| **Caddy** | Multiple projects, power users | `brew install caddy` |
| **Node proxy** | Single project, minimal setup | Already have Node |

**Caddy** is recommended if you work on multiple projects - one config file manages all of them.

**Node proxy** is simpler if you just need HTTPS for one project.

---

## One-Time Setup

### 1. Create Certificate Directory

```bash
mkdir -p ~/.squared-agent/certs
cd ~/.squared-agent/certs
```

### 2. Generate Wildcard Certificate

```bash
mkcert "*.local" "localhost" "127.0.0.1" "::1"
```

This creates two files:
- `_wildcard.local+3.pem` - Certificate
- `_wildcard.local+3-key.pem` - Private key

Rename for clarity:
```bash
mv "_wildcard.local+3.pem" "wildcard.local.pem"
mv "_wildcard.local+3-key.pem" "wildcard.local-key.pem"
```

### 3. Create Registry Directory

```bash
mkdir -p ~/.squared-agent
```

---

## Per-Project Setup

### 1. Choose Domain and Port

Pick a domain based on your project name:
- Project: `my-awesome-app` → Domain: `my-awesome-app.local`
- Project: `client-portal` → Domain: `client-portal.local`

Pick a unique port (avoid 3000-3010 which dev servers use):
- First project: `3001`
- Second project: `3002`
- And so on...

### 2. Add to Hosts File

The hosts file maps your domain to localhost. This requires sudo.

**View what will be added:**
```bash
echo "127.0.0.1   myproject.local"
```

**Add to hosts file:**
```bash
echo "127.0.0.1   myproject.local" | sudo tee -a /etc/hosts
```

You'll be prompted for your password.

**Verify:**
```bash
grep myproject.local /etc/hosts
```

### 3. Configure Your Proxy

Choose **one** of the following options:

---

## Option A: Caddy Proxy (Recommended)

Caddy is a modern web server with automatic HTTPS. One instance handles all projects.

### Global Caddyfile

Create `~/.squared-agent/Caddyfile`:

```
{
    auto_https off
}

myproject.local {
    reverse_proxy localhost:3000
    tls ~/.squared-agent/certs/wildcard.local.pem ~/.squared-agent/certs/wildcard.local-key.pem
}

# Add more projects as needed:
# anotherapp.local {
#     reverse_proxy localhost:3002
#     tls ~/.squared-agent/certs/wildcard.local.pem ~/.squared-agent/certs/wildcard.local-key.pem
# }
```

### Start Caddy

**Run in foreground (see logs):**
```bash
caddy run --config ~/.squared-agent/Caddyfile
```

**Run as background service:**
```bash
caddy start --config ~/.squared-agent/Caddyfile
```

**Stop background service:**
```bash
caddy stop
```

**Reload after config changes:**
```bash
caddy reload --config ~/.squared-agent/Caddyfile
```

### Adding New Projects

1. Add hosts entry: `echo "127.0.0.1   newproject.local" | sudo tee -a /etc/hosts`
2. Add block to Caddyfile
3. Reload: `caddy reload --config ~/.squared-agent/Caddyfile`

---

## Option B: Node Proxy (Simpler)

A lightweight Node.js proxy script. Good for single projects or quick setup.

### Create Proxy Script

Create `~/.squared-agent/proxy.mjs`:

```javascript
import { createServer } from 'https';
import { createProxyServer } from 'http-proxy';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const certsDir = join(homedir(), '.squared-agent', 'certs');

const ssl = {
  key: readFileSync(join(certsDir, 'wildcard.local-key.pem')),
  cert: readFileSync(join(certsDir, 'wildcard.local.pem')),
};

// Configure your projects here
const routes = {
  'myproject.local': 'http://localhost:3000',
  // 'anotherapp.local': 'http://localhost:3002',
};

const proxy = createProxyServer({});

const server = createServer(ssl, (req, res) => {
  const host = req.headers.host?.split(':')[0];
  const target = routes[host];

  if (target) {
    proxy.web(req, res, { target }, (err) => {
      console.error(`Proxy error for ${host}:`, err.message);
      res.writeHead(502);
      res.end('Bad Gateway');
    });
  } else {
    res.writeHead(404);
    res.end(`Unknown host: ${host}`);
  }
});

// Handle WebSocket upgrades (for HMR)
server.on('upgrade', (req, socket, head) => {
  const host = req.headers.host?.split(':')[0];
  const target = routes[host];

  if (target) {
    proxy.ws(req, socket, head, { target });
  }
});

const PORT = 443;
server.listen(PORT, () => {
  console.log(`HTTPS proxy running on port ${PORT}`);
  console.log('Routes:', Object.keys(routes).map(h => `https://${h}`).join(', '));
});
```

### Install Dependency

```bash
cd ~/.squared-agent
npm init -y
npm install http-proxy
```

### Run Proxy

Port 443 requires sudo:
```bash
sudo node ~/.squared-agent/proxy.mjs
```

Or use a higher port (e.g., 8443) and access via `https://myproject.local:8443`.

### Adding New Projects

1. Add hosts entry
2. Add route to `routes` object in proxy.mjs
3. Restart proxy

---

## Daily Workflow

### Start Development

1. **Start your proxy** (if not already running):
   - Caddy: `caddy start --config ~/.squared-agent/Caddyfile`
   - Node: `sudo node ~/.squared-agent/proxy.mjs`

2. **Start your dev server** (in project directory):
   ```bash
   pnpm dev
   ```

3. **Open browser**:
   ```
   https://myproject.local
   ```

### Multiple Projects

With Caddy, you can run multiple dev servers simultaneously:

| Project | Dev Server | Domain |
|---------|------------|--------|
| Frontend | `localhost:3000` | `https://frontend.local` |
| Backend | `localhost:4000` | `https://api.local` |
| Admin | `localhost:5173` | `https://admin.local` |

Each gets its own hosts entry and Caddyfile block.

---

## Environment Variables

Update your `.env` or `.env.local`:

```bash
# Before
APP_URL=http://localhost:3000

# After
APP_URL=https://myproject.local
```

For OAuth providers, update callback URLs:
```bash
GOOGLE_CALLBACK_URL=https://myproject.local/api/auth/callback/google
GITHUB_CALLBACK_URL=https://myproject.local/api/auth/callback/github
```

---

## Troubleshooting

### Browser Shows "Not Secure"

**Cause**: mkcert CA not trusted

**Fix**:
```bash
mkcert -install
```
Then restart your browser.

### ERR_NAME_NOT_RESOLVED

**Cause**: Domain not in hosts file

**Fix**:
```bash
cat /etc/hosts | grep myproject.local
# If missing:
echo "127.0.0.1   myproject.local" | sudo tee -a /etc/hosts
```

### Connection Refused

**Cause**: Proxy not running or dev server not running

**Fix**:
1. Check proxy is running: `pgrep caddy` or `pgrep node`
2. Check dev server is running on expected port
3. Verify Caddyfile points to correct port

### Certificate Errors in Brave

Brave has stricter certificate handling.

**Fix**:
1. Open `brave://settings/security`
2. Click "Manage certificates"
3. Find "mkcert" in list and ensure it's trusted

### Port Already in Use

**Cause**: Another process using the port

**Fix**:
```bash
# Find what's using port 443
sudo lsof -i :443

# Kill if needed
sudo kill -9 <PID>
```

### Hosts File Permission Denied

**Cause**: Need sudo for /etc/hosts

**Fix**: Always use `sudo tee -a` to append:
```bash
echo "127.0.0.1   myproject.local" | sudo tee -a /etc/hosts
```

---

## Quick Reference

### Commands

| Task | Command |
|------|---------|
| Install mkcert CA | `mkcert -install` |
| Generate certs | `mkcert "*.local" localhost 127.0.0.1` |
| Add hosts entry | `echo "127.0.0.1 domain.local" \| sudo tee -a /etc/hosts` |
| Start Caddy | `caddy start --config ~/.squared-agent/Caddyfile` |
| Stop Caddy | `caddy stop` |
| Reload Caddy | `caddy reload --config ~/.squared-agent/Caddyfile` |
| Start Node proxy | `sudo node ~/.squared-agent/proxy.mjs` |

### File Locations

| File | Location |
|------|----------|
| Certificates | `~/.squared-agent/certs/` |
| Caddyfile | `~/.squared-agent/Caddyfile` |
| Node proxy | `~/.squared-agent/proxy.mjs` |
| Hosts file | `/etc/hosts` |

### Port Conventions

| Range | Purpose |
|-------|---------|
| 3000-3010 | Dev servers (Next.js, Vite, etc.) |
| 3011-3099 | Reserved for future use |
| 4000-4010 | Backend APIs |
| 5173 | Vite default |
| 443 | HTTPS proxy |
