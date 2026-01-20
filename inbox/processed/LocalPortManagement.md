To replicate something similar to **Drizzle Studio's** `https://local.drizzle.studio` trick (a friendly custom domain + automatic local HTTPS with trusted certs, no browser warnings) for your **Next.js** app (or any other web app/server), you need two main pieces:

1. **Map a custom domain/subdomain to localhost** (e.g., `myapp.local`, `project.dev`, etc.).
2. **Provide trusted HTTPS** (valid local SSL certs that your browser trusts automatically).

Drizzle Kit does this internally with a self-signed cert + a special domain alias (likely hardcoded in their frontend + local resolution tricks), but you can achieve the same (or better) with free, open tools.

The **best modern workflow** (widely used in 2026 for Next.js/Vite/React/etc. devs) combines **mkcert** (for trusted local certs) + a **reverse proxy** like **Caddy** (auto-HTTPS + super simple config) + `/etc/hosts` edits.

### Step-by-Step Setup (Recommended: mkcert + Caddy)

#### 1. Install mkcert (once, globally)
mkcert creates a local CA (Certificate Authority) and installs it in your system's trust store → no "Not Secure" warnings ever.

- macOS: `brew install mkcert`
- Linux: Follow https://github.com/FiloSottile/mkcert (usually `sudo apt install libnss3-tools` then download binary)
- Windows: Use Chocolatey `choco install mkcert` or Scoop

Then initialize (run once):
```bash
mkcert -install
```
This adds the root CA to your browser/OS trust store.

#### 2. Generate a wildcard cert for your custom domains
Choose a TLD like `.local`, `.dev`, `.test` (`.localhost` works too but subdomains are trickier).

Run this in your project root (or a shared certs folder):
```bash
mkcert "*.local" "local" "localhost" "127.0.0.1" "::1"
```
→ Creates `local.pem` (cert) + `local-key.pem` (key). The wildcard covers `anything.local` (e.g., `nextapp.local`, `api.local`).

#### 3. Edit your hosts file (map domains to localhost)
Add lines like:
```bash
# /etc/hosts (macOS/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows, admin mode)
127.0.0.1   my-next-app.local
127.0.0.1   api.local
127.0.0.1   admin.local
```
Now `https://my-next-app.local` resolves to your machine.

#### 4. Use Caddy as your local reverse proxy (easiest HTTPS + domain magic)
Caddy auto-handles HTTPS with your mkcert certs, reverse-proxies to your app's port (e.g., Next.js on 3000), and supports multiple projects easily.

Install Caddy:
- macOS: `brew install caddy`
- Or download binary from https://caddyserver.com/

Create a `Caddyfile` in your project root (or global ~/.caddy/):
```
# Simple single-app example
my-next-app.local {
    reverse_proxy localhost:3000
    tls /path/to/local.pem /path/to/local-key.pem   # optional if using auto, but explicit for wildcard
}

# Multi-project example (recommended!)
{
    # Optional: email for public certs if ever needed
}

my-next-app.local {
    reverse_proxy localhost:3000   # your Next.js dev server
}

api.local {
    reverse_proxy localhost:4000   # e.g. your backend
}

admin.local {
    reverse_proxy localhost:5173   # e.g. another Vite app
}
```

Run Caddy:
```bash
caddy run --config Caddyfile
# Or daemon: caddy start
```

Now:
- Start your Next.js dev server normally: `npm run dev` (on port 3000)
- Visit **https://my-next-app.local** → secure, no warnings, pretty URL!

Caddy handles:
- Auto-HTTPS (using your mkcert certs if configured)
- HTTP → HTTPS redirects
- Multiple domains in one process (scales great for 5–10+ projects)

#### Alternative Simpler Options (No Proxy Needed)

- **Pure Next.js built-in experimental HTTPS** (Next.js 13+):
  ```bash
  next dev --experimental-https
  ```
  → Runs on https://localhost:3000 with self-signed cert (browser may warn; trust manually).

- **With custom domain (no proxy)**:
  Use `next dev -H my-next-app.local -p 3000` + hosts file edit + mkcert-generated cert, but you'd need a custom server.js to load the certs (more code).

- **Quick & dirty with tools like local-ssl-proxy** or **devcert**:
  ```bash
  npx local-ssl-proxy --source 3001 --target 3000 --domain myapp.local
  ```
  But Caddy is cleaner long-term.

### Quick Comparison (2026 Devs' Favorites)

| Method                  | Effort | Custom Domain + HTTPS | Multi-Project | Browser Trust | Best For                  |
|-------------------------|--------|-----------------------|---------------|---------------|---------------------------|
| mkcert + Caddy          | Medium | Yes (wildcard)        | Excellent     | Automatic     | Pro workflow, many apps   |
| Next.js --experimental-https | Low   | localhost only        | OK            | Manual trust  | Quick single app          |
| mkcert + custom server  | High   | Yes                   | Manual        | Automatic     | Minimal extra tools       |
| lvh.me / sslip.io trick | Zero   | Yes (e.g. app.127-0-0-1.sslip.io) | Good     | Self-signed   | Zero setup, but ugly URLs |

**Caddy + mkcert** is the closest to Drizzle's polished feel — friendly domains, auto-HTTPS, no fuss — and it's free/open-source.

If you're on macOS/Linux, this takes ~10 mins to set up forever. Hit any snags (e.g., cert trust on Brave/Safari)? Let me know your OS/stack and I can refine! 🚀