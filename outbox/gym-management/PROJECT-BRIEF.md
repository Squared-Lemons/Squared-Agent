# Project Brief: Gym Management System

## The Idea

A SaaS platform for gym owners to manage their entire operation — members, check-ins, classes, personal training, and billing — from a single dashboard. Members get a web portal to book classes and manage their subscriptions.

## Who It's For

**Primary users:**
- Independent gym owners running 1-3 locations
- Boutique fitness studios (yoga, CrossFit, spin)
- Personal training studios

**Secondary users:**
- Gym members who book classes and manage subscriptions
- Gym staff (receptionists, trainers, managers)

## The Problem

Gym owners juggle multiple systems:
- Paper sign-in sheets or basic spreadsheets for attendance
- Separate payment processing (cash, bank transfers, GoCardless)
- WhatsApp groups for class bookings
- Calendars for PT sessions

This is error-prone, time-consuming, and gives no visibility into business health.

## The Solution

One system that handles:
1. **Member management** — profiles, subscriptions, check-in history
2. **QR check-ins** — fast entry, no manual logging
3. **Class bookings** — timetables, capacity limits, waitlists
4. **PT sessions** — packages, scheduling, tracking
5. **Billing** — Stripe subscriptions, automatic renewals

## MVP Scope

Start with a **single gym** to validate the core experience:
- One gym, one set of staff, one pool of members
- No multi-tenant complexity yet
- Focus on getting the daily workflows right

Multi-gym/business hierarchy comes after MVP validation.

## Core Workflows

### Gym Owner's Day

1. **Morning** — Check dashboard for today's check-ins, classes, PT sessions
2. **Front desk** — Staff scan member QR codes on entry
3. **Classes** — View who's booked, mark attendance after class
4. **PT sessions** — Trainers log completed sessions
5. **End of day** — Review stats, check for failed payments

### Member Journey

1. **Sign up** — Choose plan, pay via Stripe Checkout
2. **Get started** — Receive QR code, book first class
3. **Daily visit** — Show QR at reception, attend class
4. **Ongoing** — Book classes, manage subscription, buy PT packages

## Success Criteria

- Gym owner can onboard in under 10 minutes
- Check-in takes under 5 seconds (scan → confirm)
- Members can book a class in 3 taps
- Zero manual intervention for subscription renewals

## Out of Scope (MVP)

- Mobile native apps (web portal works on phone)
- Multiple gym locations
- Inventory/equipment tracking
- Marketing/email campaigns
- Custom branding per gym
- API for third-party integrations

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Stripe integration complexity | Use Stripe Checkout (hosted), not custom forms |
| QR scanning on cheap devices | Test on budget Android phones early |
| Staff resistance to new system | Keep UI dead simple, minimal training needed |
| Data migration from existing systems | Offer CSV import for members |

## Timeline Considerations

MVP should be usable within weeks, not months. The architecture (Hono + React + Cloudflare) supports rapid iteration with type safety.
