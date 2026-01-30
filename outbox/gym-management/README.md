# Gym Management System

A complete SaaS solution for gym owners to manage their business, members, classes, and personal training services.

---

## What This Project Does

**For Gym Owners (Admin Dashboard)**
- Set up gym profile with hours, facilities, and contact info
- Manage staff with role-based permissions (owner, manager, trainer, receptionist)
- Track members with QR code check-ins
- Schedule classes and manage bookings with waitlist support
- Manage personal trainers, packages, and sessions
- Handle Stripe subscription billing

**For Members (Member Portal)**
- Sign up and pay for membership via Stripe
- View QR code for gym check-in
- Book classes and join waitlists
- View PT packages and book sessions
- Manage account and subscription

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   Admin Dashboard   │  │   Member Portal     │          │
│  │   (React SPA)       │  │   (React SPA)       │          │
│  └──────────┬──────────┘  └──────────┬──────────┘          │
└─────────────┼────────────────────────┼──────────────────────┘
              │                        │
              ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  Cloudflare Workers                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Hono API                                │   │
│  └──────────────────────┬──────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
     ┌────────────────┐      ┌────────────────┐
     │  PlanetScale   │      │    Stripe      │
     │  (Postgres)    │      │   (Payments)   │
     └────────────────┘      └────────────────┘
```

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| **API** | Hono on Cloudflare Workers |
| **Frontend** | React SPAs on Cloudflare Pages |
| **Database** | PlanetScale Postgres + Drizzle ORM |
| **Auth** | Better Auth (email/password + Google + Apple) |
| **Payments** | Stripe Subscriptions |
| **Deployment** | Cloudflare Workers + Pages |

---

## Key Features

### QR Check-ins
- Each member gets a unique QR code
- Staff scan at reception using admin dashboard
- Check-in history tracked per member

### Class System
- Class types with configurable capacity
- Weekly schedule builder
- Book-ahead or drop-in per class type
- Waitlist management for full classes
- Attendance tracking

### Personal Training
- Trainer profiles with specialties and rates
- Session packages (5, 10, etc.)
- Session booking and tracking
- Package expiration handling

### Stripe Billing
- Subscription plans (monthly/annual)
- Stripe Checkout for payments
- Webhook handlers for lifecycle events
- Customer portal for self-management

### Role Permissions
- Owner: Full access
- Manager: Everything except staff management
- Trainer: Check-ins, own PT sessions, class attendance
- Receptionist: Check-ins, member management
- Customizable permissions per user

---

## Implementation Phases

1. **Foundation** — API setup, auth, database schema
2. **Core Admin** — Gym settings, members, QR scanner
3. **Classes** — Class types, scheduling, booking
4. **Personal Training** — Trainers, packages, sessions
5. **Billing** — Stripe integration, plans, webhooks
6. **Member Portal** — QR display, class booking, account
7. **Polish** — Permissions UI, dashboard, mobile

---

## Getting Started

See `SETUP.md` for build instructions.

---

## Commands Available

| Command | Purpose |
|---------|---------|
| `/start-session` | Begin work with context loading |
| `/new-feature` | Create feature branch for safe development |
| `/complete-feature` | Finish branch via merge or PR |
| `/end-session` | Update docs, commit changes |
| `/commit` | Draft and execute commits |
| `/clean-branches` | Remove merged branches |
| `/summary` | Generate accomplishments report |

---

## Project Files

```
.claude/commands/     # Slash commands for Claude Code
knowledge/            # Platform and pattern guides
docs/plans/           # Design documents
PROJECT-BRIEF.md      # Full project context
TECHNICAL-DECISIONS.md # Stack choices with rationale
SETUP.md              # Build instructions
```
