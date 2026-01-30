# Technical Decisions

## Architecture: Separate Frontend and Backend

**Decision:** Hono API on Cloudflare Workers + React SPAs on Cloudflare Pages

**Why not Next.js?**
- User wanted Cloudflare deployment, not Vercel
- Hono on Workers gives full control over the API
- Separate SPAs for admin and member portal avoids mixing concerns
- Better edge performance for API endpoints

**Trade-offs:**
- Two deployments instead of one
- No server components (but SPAs work fine for dashboards)
- Need to handle CORS between Pages and Workers

---

## Database: PlanetScale Postgres + Drizzle

**Decision:** PlanetScale Postgres with Drizzle ORM

**Why PlanetScale Postgres?**
- Database branching for safe migrations
- Serverless-friendly, works with Workers
- Managed service, no DevOps overhead
- User preference

**Why Drizzle over Prisma?**
- Type-safe queries with better inference
- Lighter weight for edge runtimes
- SQL-like syntax, easier to reason about
- Growing ecosystem and community

---

## Authentication: Better Auth

**Decision:** Better Auth with email/password + Google + Apple

**Why Better Auth?**
- Works with Hono (adapter available)
- Handles social login out of the box
- Session management included
- Lighter than Auth.js for non-Next.js setups

**Implementation notes:**
- Store sessions in database (not JWT-only)
- Use secure cookies for auth state
- Apple Sign-In requires Apple Developer account

---

## Payments: Stripe Subscriptions

**Decision:** Stripe with hosted Checkout, webhook-driven

**Why Stripe Checkout (hosted)?**
- No PCI compliance burden
- Stripe handles all payment UI
- Mobile-optimized by default
- Supports Apple Pay, Google Pay automatically

**Webhook strategy:**
- Dedicated endpoint: `POST /api/webhooks/stripe`
- Verify signatures before processing
- Idempotent handlers (webhooks can retry)
- Key events: checkout complete, invoice paid/failed, subscription cancelled

---

## Check-in System: QR Codes

**Decision:** Staff-scanned QR codes at reception

**Why staff-scanned?**
- Works immediately, no hardware needed
- Staff phone/tablet with admin app open
- No turnstile integration complexity
- Can verify member visually

**QR implementation:**
- Generate unique code per member on signup
- Store as string in member record
- Display as QR in member portal
- Scan via browser camera API in admin dashboard

---

## Class Booking: Hybrid Model

**Decision:** Support both book-ahead and drop-in per class type

**Why not just one model?**
- Capacity-limited classes (yoga, spin) need booking
- Open-floor classes (weights) just need attendance tracking
- Toggle per class type gives flexibility

**Waitlist logic:**
- When class is full, offer "Join Waitlist"
- If someone cancels, promote from waitlist (FIFO)
- Notify member via email when promoted

---

## Role-Based Permissions

**Decision:** Permissions as JSON array, roles as presets

**Why not hardcoded roles?**
- Gym owners want to customize (e.g., trainer who can manage members)
- Four default presets cover 90% of cases
- JSON array allows fine-grained control

**Permission format:**
```json
["members:read", "members:write", "classes:read", "checkins:write"]
```

**Middleware checks:**
```typescript
const requirePermission = (permission: string) => {
  // Check user.permissions includes permission
}
```

---

## Deployment: Cloudflare

**Decision:** Workers for API, Pages for frontends

**Why Cloudflare?**
- Global edge network, low latency everywhere
- Workers scale automatically
- Pages has generous free tier
- User preference over Vercel

**Project structure:**
```
/
├── apps/
│   ├── api/          # Hono on Workers
│   ├── admin/        # React SPA on Pages
│   └── member/       # React SPA on Pages
├── packages/
│   ├── db/           # Drizzle schema and client
│   ├── auth/         # Better Auth config
│   └── shared/       # Types, utils
└── ...
```

---

## Monorepo: pnpm + Turborepo

**Decision:** Monorepo with pnpm workspaces and Turborepo

**Why monorepo?**
- Shared types between API and frontends
- Shared auth config
- Coordinated deployments
- One place for all code

**Why Turborepo?**
- Fast builds with caching
- Parallel task execution
- Good Cloudflare integration

---

## MVP Scope Decisions

| Feature | MVP | Later |
|---------|-----|-------|
| Single gym | Yes | Multi-gym hierarchy |
| Staff-scanned QR | Yes | Self-service kiosk |
| Web portal | Yes | Native mobile app |
| Stripe billing | Yes | Alternative payment methods |
| Four role presets | Yes | Fully custom roles UI |
| Email notifications | Basic | Push notifications |
