# Setup Instructions

This document guides you through building the Gym Management System.

---

## 1. Read Project Context

Before writing any code, read these files in order:

1. **README.md** — Overview and architecture
2. **PROJECT-BRIEF.md** — Business context and requirements
3. **TECHNICAL-DECISIONS.md** — Stack choices and rationale
4. **docs/plans/2026-01-30-gym-management-design.md** — Full design document

---

## 2. Understand the Architecture

```
apps/
├── api/              # Hono API on Cloudflare Workers
├── admin/            # Admin dashboard (React SPA)
└── member/           # Member portal (React SPA)

packages/
├── db/               # Drizzle schema and client
├── auth/             # Better Auth configuration
└── shared/           # Shared types and utilities
```

**Deployment targets:**
- `apps/api` → Cloudflare Workers
- `apps/admin` → Cloudflare Pages
- `apps/member` → Cloudflare Pages

---

## 3. Initialize the Monorepo

Create the project structure with pnpm workspaces and Turborepo:

```bash
mkdir gym-management && cd gym-management
pnpm init
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Install Turborepo:**
```bash
pnpm add -D turbo
```

---

## 4. Set Up the Database Package

Create `packages/db/` with Drizzle and PlanetScale:

**Dependencies:**
- `drizzle-orm`
- `@planetscale/database` or postgres driver
- `drizzle-kit` (dev)

**Schema:** See data model in design document. Key tables:
- `gyms`, `users`, `members`, `checkIns`
- `classTypes`, `classes`, `classBookings`
- `trainers`, `ptPackages`, `ptSessions`
- `plans`

---

## 5. Set Up the Auth Package

Create `packages/auth/` with Better Auth:

**Configuration:**
- Email/password provider
- Google OAuth provider
- Apple OAuth provider
- Database adapter for session storage

**Hono integration:**
```typescript
import { betterAuth } from 'better-auth'
import { honoHandler } from 'better-auth/hono'
```

---

## 6. Build the API

Create `apps/api/` with Hono on Cloudflare Workers:

**Route groups:**
- `/api/auth/*` — Better Auth handlers
- `/api/gym/*` — Gym settings (owner/manager only)
- `/api/members/*` — Member CRUD
- `/api/checkins/*` — Check-in operations
- `/api/classes/*` — Class types, schedule, bookings
- `/api/trainers/*` — Trainer profiles, PT packages, sessions
- `/api/billing/*` — Plans, Stripe integration
- `/api/webhooks/stripe` — Stripe webhook handler

**Middleware:**
- Auth middleware (verify session)
- Permission middleware (check user.permissions)
- CORS middleware (allow Pages origins)

---

## 7. Build the Admin Dashboard

Create `apps/admin/` as a React SPA:

**Router:** React Router or TanStack Router

**Pages:**
- `/login` — Staff login
- `/` — Dashboard with stats
- `/scan` — QR scanner for check-ins
- `/members` — Member list and management
- `/members/:id` — Member detail
- `/classes` — Class types and schedule
- `/classes/:id/bookings` — Class booking list
- `/trainers` — Trainer management
- `/trainers/:id` — Trainer detail with sessions
- `/billing` — Plans and payment tracking
- `/settings` — Gym settings, staff, permissions

**Key components:**
- QR Scanner (using browser camera API)
- Weekly schedule builder
- Permission-aware navigation

---

## 8. Build the Member Portal

Create `apps/member/` as a React SPA:

**Pages:**
- `/login` — Member login
- `/signup` — Plan selection → Stripe Checkout
- `/` — Dashboard with QR code
- `/classes` — Timetable and booking
- `/classes/my-bookings` — Upcoming bookings
- `/pt` — PT packages and sessions
- `/account` — Profile and subscription

**Key components:**
- Large QR code display
- Class booking with capacity indicator
- Stripe Customer Portal link

---

## 9. Stripe Integration

**Setup:**
1. Create Stripe account and products/prices
2. Add Stripe secret key to Workers environment
3. Configure webhook endpoint

**Checkout flow:**
1. Member selects plan
2. API creates Checkout Session
3. Redirect to Stripe
4. Webhook creates member on success

**Webhook events to handle:**
- `checkout.session.completed`
- `invoice.paid`
- `invoice.payment_failed`
- `customer.subscription.deleted`

---

## 10. Skills to Install

Install these skills for guidance:

```bash
# Better Auth patterns
npx skills add better-auth/skills

# React performance
npx skills add vercel-labs/agent-skills

# UI design review
npx skills add anthropics/skills -s frontend-design
npx skills add anthropics/skills -s webapp-testing
```

---

## 11. Commands Available

These slash commands are available:

| Command | Use When |
|---------|----------|
| `/start-session` | Beginning work |
| `/new-feature` | Starting a new feature |
| `/complete-feature` | Finishing a feature |
| `/end-session` | Ending work session |
| `/commit` | Making commits |
| `/summary` | Generating progress report |

---

## 12. Implementation Order

Follow this sequence:

### Phase 1: Foundation
- [ ] Monorepo setup (pnpm, Turborepo)
- [ ] Database schema and migrations
- [ ] Better Auth configuration
- [ ] Basic Hono API with auth routes
- [ ] Cloudflare Workers deployment

### Phase 2: Core Admin
- [ ] Admin React app scaffold
- [ ] Staff login flow
- [ ] Gym settings CRUD
- [ ] Member CRUD
- [ ] QR code generation
- [ ] Check-in scanner

### Phase 3: Classes
- [ ] Class types management
- [ ] Weekly schedule builder
- [ ] Class booking API
- [ ] Waitlist logic
- [ ] Attendance marking

### Phase 4: Personal Training
- [ ] Trainer profiles
- [ ] PT packages
- [ ] Session scheduling
- [ ] Session tracking

### Phase 5: Billing
- [ ] Plan management
- [ ] Stripe Checkout integration
- [ ] Webhook handlers
- [ ] Payment history

### Phase 6: Member Portal
- [ ] Member React app scaffold
- [ ] Signup → Stripe flow
- [ ] QR code display
- [ ] Class booking
- [ ] Account management

### Phase 7: Polish
- [ ] Role permissions UI
- [ ] Dashboard stats
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Error handling

---

## Verification

After each phase:
1. Run type checking: `pnpm type-check`
2. Test locally with Wrangler: `pnpm dev`
3. Deploy to staging and test
4. Commit with `/commit`

---

## Resources

**Knowledge guides in this package:**
- `knowledge/auth/` — Better Auth patterns
- `knowledge/database/` — Drizzle patterns
- `knowledge/patterns/` — General patterns

**External docs:**
- [Hono](https://hono.dev/) — Web framework
- [Drizzle](https://orm.drizzle.team/) — ORM
- [Better Auth](https://better-auth.com/) — Authentication
- [Stripe](https://stripe.com/docs) — Payments
- [Cloudflare Workers](https://developers.cloudflare.com/workers/) — Deployment
- [PlanetScale](https://planetscale.com/docs) — Database
