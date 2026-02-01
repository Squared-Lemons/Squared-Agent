# Squared Agent Dashboard - Deployment Guide

Deploy the dashboard and API to your own Cloudflare account.

## Prerequisites

- Cloudflare account with Workers/Pages enabled
- Wrangler CLI (`npm install -g wrangler`)
- Node.js 18+

## 1. Create D1 Database

```bash
wrangler d1 create squared-agent-sessions
```

Copy the `database_id` from the output.

## 2. Initialize Database Schema

```bash
wrangler d1 execute squared-agent-sessions --remote --file=../api/dashboard/schema.sql
```

## 3. Deploy API Worker

```bash
cd apps/api/dashboard

# Update wrangler.toml with your database_id
# Edit: database_id = "your-id-here"

# Deploy
wrangler deploy
```

Note the deployed URL (e.g., `squared-agent-dashboard-api.your-subdomain.workers.dev`)

## 4. Configure Dashboard

Create `.env.production`:

```
VITE_API_BASE=https://your-api-worker-url.workers.dev
```

## 5. Deploy Dashboard

```bash
cd apps/web/dashboard
npm install
npm run build
wrangler pages deploy dist --project-name squared-agent-dashboard
```

## Custom Domain (Optional)

1. Add your domain in Cloudflare DNS
2. Update `wrangler.toml` with routes
3. Set `CORS_ORIGIN` in API worker to match your dashboard URL

## Environment Variables

### API Worker (`apps/api/dashboard/wrangler.toml`)
- `CORS_ORIGIN` - Dashboard URL for CORS (or `*` for dev)

### Dashboard (`apps/web/dashboard/.env.production`)
- `VITE_API_BASE` - API worker URL
