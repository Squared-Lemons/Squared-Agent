# Gym Management System — Design Document

**Date:** 2026-01-30
**Status:** Approved

---

## Overview

A gym management SaaS for gym owners to manage members, classes, personal training, and billing. MVP targets a single gym with expansion to multi-tenant later.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scope | MVP for one gym | Validate core workflows before multi-tenancy complexity |
| Payments | Stripe subscriptions | Members pay directly, automatic billing |
| Check-ins | Staff-scanned QR | Simple, no hardware dependencies |
| Class bookings | Book-ahead + drop-in | Toggle per class type for flexibility |
| Member experience | Web portal | No app store releases, works everywhere |
| Authentication | Email/password + Google + Apple | Convenience with fallback |
| Permissions | Full role system | Owner, Manager, Trainer, Receptionist with custom permissions |
| Tech stack | Hono + React + Drizzle + Postgres | Separation of concerns, type safety |
| Deployment | Cloudflare Workers/Pages + PlanetScale | Edge performance, serverless Postgres |

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
│  │  /api/auth/*    /api/members/*   /api/classes/*     │   │
│  │  /api/checkins/*  /api/trainers/*  /api/billing/*   │   │
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

**Components:**
- **Hono API** on Cloudflare Workers — single API serving both frontends
- **Admin Dashboard** on Cloudflare Pages — React SPA for gym staff
- **Member Portal** on Cloudflare Pages — React SPA for gym members
- **PlanetScale Postgres** — database with branching for safe migrations
- **Stripe** — subscription billing and payment processing
- **Better Auth** — authentication with social login support

---

## Data Model

### Core Entities

**Gym**
- id, name, address, phone, openingHours (JSON), facilities (JSON), isActive

**User** (staff accounts)
- id, gymId, email, name, role, permissions (JSON)

**Member** (gym customers)
- id, gymId, email, name, phone, emergencyContact, qrCode
- stripeCustomerId, stripeSubscriptionId
- membershipStart, membershipEnd

**CheckIn**
- id, memberId, gymId, checkedInAt, checkedInBy (userId)

### Classes

**ClassType**
- id, gymId, name, description, duration, capacity, requiresBooking

**Class** (scheduled instance)
- id, classTypeId, instructorId (userId), startsAt, room, capacity

**ClassBooking**
- id, classId, memberId, status (booked/attended/no-show/waitlisted)

### Personal Training

**Trainer** (extends User)
- id, gymId, userId, specialities (JSON), hourlyRate, availability (JSON)

**PTPackage**
- id, trainerId, memberId, sessions, sessionsUsed, price, expiresAt

**PTSession**
- id, packageId, scheduledAt, status (scheduled/completed/cancelled), notes

### Billing

**Plan**
- id, gymId, name, price, interval (monthly/annual), features (JSON), stripePriceId

---

## Role-Based Permissions

| Action | Owner | Manager | Trainer | Receptionist |
|--------|:-----:|:-------:|:-------:|:------------:|
| Gym settings | ✓ | ✓ | ✗ | ✗ |
| Manage staff | ✓ | ✗ | ✗ | ✗ |
| View billing | ✓ | ✓ | ✗ | ✗ |
| Manage plans | ✓ | ✓ | ✗ | ✗ |
| Add/edit members | ✓ | ✓ | ✗ | ✓ |
| Check-in members | ✓ | ✓ | ✓ | ✓ |
| Manage classes | ✓ | ✓ | ✗ | ✗ |
| Mark attendance | ✓ | ✓ | ✓ | ✓ |
| Manage trainers | ✓ | ✓ | ✗ | ✗ |
| Own PT sessions | ✓ | ✓ | ✓ | ✗ |

Permissions stored as JSON array on User. Roles are presets, customizable by owner.

---

## Stripe Integration

### Webhook Events

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create member, activate subscription |
| `invoice.paid` | Extend membership end date |
| `invoice.payment_failed` | Flag member, send warning |
| `customer.subscription.deleted` | Deactivate membership |

### Flow
1. Member selects plan in portal
2. API creates Stripe Checkout session
3. Member completes payment on Stripe
4. Webhook creates member record and activates subscription
5. Member redirected back to portal, logged in

---

## Member Portal

**Pages:**
- `/` — Dashboard with QR code prominent
- `/classes` — Weekly timetable, booking
- `/classes/my-bookings` — Upcoming and past bookings
- `/pt` — PT packages and sessions
- `/account` — Profile and subscription management

**Features:**
- Large QR code display for check-in
- Class booking with capacity/waitlist
- Subscription self-management via Stripe Customer Portal

---

## Admin Dashboard

**Sections:**

| Section | Features |
|---------|----------|
| Dashboard | Today's stats, recent check-ins, upcoming classes, alerts |
| Members | List, search, add/edit, view profile, check-in history, QR scanner |
| Classes | Class types setup, weekly schedule builder, booking list, attendance |
| Trainers | Trainer profiles, availability, PT packages, session calendar |
| Billing | Subscription plans, payment history, outstanding balances |
| Settings | Gym details, opening hours, staff management, role permissions |

**QR Scanner:**
- Dedicated `/scan` route with full-screen camera
- Shows member name, photo, subscription status
- One-tap check-in confirmation

---

## Implementation Phases

### Phase 1: Foundation
- Hono API setup with auth routes
- Database schema and Drizzle setup
- Better Auth integration (email + Google + Apple)
- Basic admin auth flow

### Phase 2: Core Admin
- Gym settings
- Member CRUD
- QR code generation
- Check-in scanner

### Phase 3: Classes
- Class types management
- Schedule builder
- Booking system with waitlist

### Phase 4: Personal Training
- Trainer profiles
- PT packages
- Session booking and tracking

### Phase 5: Billing
- Stripe integration
- Plan management
- Webhook handlers
- Payment tracking

### Phase 6: Member Portal
- Member auth flow
- QR display
- Class booking
- Account management

### Phase 7: Polish
- Role permissions UI
- Dashboard stats
- Alerts and notifications
- Mobile responsiveness
