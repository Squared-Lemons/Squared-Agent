# Gym Management System - Project Specification

A comprehensive guide to the v1 prototype for gym owners to manage their business, locations, and members.

---

## Project Overview

**Purpose:** Admin tool for gym owners to manage their business, gym locations, and members.

**Target Users:** Gym owners and staff (not members - no member portal in v1)

**Approach:** Quick prototype using SQLite, designed for easy migration to PostgreSQL later.

---

## V1 Scope

### Included

| Feature | Description |
|---------|-------------|
| **Onboarding** | New user sign-up → Create organization → Add first gym location |
| **Gym Management** | CRUD operations for gym locations under an organization |
| **Member Management** | Add/edit members, assign to gyms, generate QR codes |
| **Multi-tenancy** | Organization → Gyms → Members hierarchy with data isolation |

### Explicitly Out of Scope (v2+)

- Class scheduling and timetables
- Class bookings and waitlists
- Personal trainer management
- PT session packages and booking
- Payment processing and billing
- Subscription plan management
- Member-facing portal/app
- Mobile app

---

## Technical Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| **Framework** | Next.js 15 (App Router) | Modern React, SSR, API routes, great DX |
| **Authentication** | Better Auth | Email + Google OAuth, session management |
| **Database** | SQLite + Drizzle ORM | Fast prototyping, easy to swap to Postgres |
| **Styling** | Tailwind CSS + shadcn/ui | Rapid UI development, consistent design |
| **QR Codes** | qrcode library | Generate unique member QR codes |
| **Deployment** | Environment-managed | Handled by deployment environments |

---

## Project Structure

```
gym-management/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── register/
│   │   │   └── page.tsx           # Registration page
│   │   └── layout.tsx             # Auth layout (centered, minimal)
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Dashboard layout (sidebar, header)
│   │   ├── page.tsx               # Dashboard home (stats overview)
│   │   │
│   │   ├── onboarding/
│   │   │   └── page.tsx           # New org onboarding wizard
│   │   │
│   │   ├── gyms/
│   │   │   ├── page.tsx           # List all gyms
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Add new gym
│   │   │   └── [gymId]/
│   │   │       ├── page.tsx       # Gym details/edit
│   │   │       └── members/
│   │   │           └── page.tsx   # Members for this gym
│   │   │
│   │   ├── members/
│   │   │   ├── page.tsx           # All members across gyms
│   │   │   ├── new/
│   │   │   │   └── page.tsx       # Add new member
│   │   │   └── [memberId]/
│   │   │       ├── page.tsx       # Member details/edit
│   │   │       └── qr/
│   │   │           └── page.tsx   # Member QR code display
│   │   │
│   │   └── settings/
│   │       └── page.tsx           # Organization settings
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts       # Better Auth API routes
│   │   ├── gyms/
│   │   │   └── route.ts           # Gym CRUD API
│   │   ├── members/
│   │   │   └── route.ts           # Member CRUD API
│   │   └── qr/
│   │       └── [memberId]/
│   │           └── route.ts       # QR code generation
│   │
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page (redirect to login/dashboard)
│
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── forms/
│   │   ├── gym-form.tsx
│   │   └── member-form.tsx
│   ├── tables/
│   │   ├── gyms-table.tsx
│   │   └── members-table.tsx
│   └── layout/
│       ├── sidebar.tsx
│       ├── header.tsx
│       └── nav-links.tsx
│
├── lib/
│   ├── auth.ts                    # Better Auth configuration
│   ├── db.ts                      # Drizzle client + SQLite connection
│   └── utils.ts                   # Utility functions
│
├── db/
│   ├── schema.ts                  # Drizzle schema definitions
│   ├── migrations/                # Generated migrations
│   └── seed.ts                    # Optional seed data
│
├── .env.example                   # Environment variables template
├── drizzle.config.ts              # Drizzle configuration
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Database Schema

### Entity Relationship

```
Organization (tenant)
    │
    ├── Users (staff accounts)
    │
    └── Gyms (locations)
            │
            └── Members
```

### Tables

#### organizations
| Column | Type | Description |
|--------|------|-------------|
| id | text (uuid) | Primary key |
| name | text | Business name |
| slug | text | URL-friendly identifier |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |

#### users
| Column | Type | Description |
|--------|------|-------------|
| id | text (uuid) | Primary key |
| email | text | Email address |
| name | text | Full name |
| organization_id | text | FK to organizations |
| role | text | 'owner' \| 'admin' \| 'staff' |
| created_at | timestamp | Creation date |

#### gyms
| Column | Type | Description |
|--------|------|-------------|
| id | text (uuid) | Primary key |
| organization_id | text | FK to organizations |
| name | text | Gym name |
| address | text | Full address |
| phone | text | Contact number |
| email | text | Contact email |
| opening_hours | json | Opening hours by day |
| facilities | json | List of facilities |
| is_active | boolean | Active/inactive status |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |

#### members
| Column | Type | Description |
|--------|------|-------------|
| id | text (uuid) | Primary key |
| organization_id | text | FK to organizations |
| gym_id | text | FK to gyms (primary gym) |
| first_name | text | First name |
| last_name | text | Last name |
| email | text | Email address |
| phone | text | Phone number |
| emergency_contact_name | text | Emergency contact |
| emergency_contact_phone | text | Emergency phone |
| qr_code | text | Unique QR code identifier |
| membership_start | date | Membership start date |
| membership_end | date | Membership end date |
| is_active | boolean | Active/inactive status |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update |

#### check_ins (for QR code scanning - optional in v1)
| Column | Type | Description |
|--------|------|-------------|
| id | text (uuid) | Primary key |
| member_id | text | FK to members |
| gym_id | text | FK to gyms |
| checked_in_at | timestamp | Check-in time |

---

## Key Workflows

### 1. Onboarding Flow

```
┌─────────────────┐
│   User Signs Up │
│  (email/Google) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create Org     │
│  - Business name│
│  - Slug         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Add First Gym  │
│  - Name         │
│  - Address      │
│  - Contact info │
│  - Hours        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Dashboard     │
│   (Ready to go) │
└─────────────────┘
```

**Implementation Notes:**
- After sign-up, check if user has an organization
- If not, redirect to `/onboarding`
- Onboarding is a multi-step wizard (org → gym)
- Mark onboarding complete in user record
- Redirect to dashboard when done

### 2. Gym Management

**Add Gym:**
1. Navigate to Gyms → Add New
2. Fill form: name, address, phone, email
3. Set opening hours (per day)
4. List facilities (checkboxes or tags)
5. Save → redirects to gym list

**Edit Gym:**
1. Click gym in list
2. Edit any field
3. Toggle active/inactive
4. Save changes

**View Gym:**
- See gym details
- Quick stats (member count)
- Link to gym's members

### 3. Member Management

**Add Member:**
1. Navigate to Members → Add New
2. Fill form: name, email, phone
3. Emergency contact details
4. Assign to a gym
5. Set membership dates
6. Save → auto-generates QR code

**QR Code Generation:**
- Generate unique identifier on member creation
- QR encodes: `{orgId}/{memberId}/{uniqueCode}`
- Display QR on member detail page
- Option to print or download QR

**Edit Member:**
1. Click member in list
2. Edit details
3. Change gym assignment
4. Update membership dates
5. Activate/deactivate
6. Save changes

**Member List:**
- Filter by gym
- Search by name/email
- Sort by name, join date
- Quick actions: view, edit, QR

---

## Authentication Flow

```
┌─────────────────┐     ┌─────────────────┐
│  Login Page     │     │  Register Page  │
│  - Email/Pass   │     │  - Email/Pass   │
│  - Google OAuth │     │  - Google OAuth │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
              ┌──────────────┐
              │ Better Auth  │
              │ - Session    │
              │ - JWT token  │
              └──────┬───────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Has Organization?     │
         └───────────┬───────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
    ┌──────────┐         ┌──────────┐
    │ No: Go   │         │ Yes: Go  │
    │ Onboard  │         │ Dashboard│
    └──────────┘         └──────────┘
```

**Session Data Includes:**
- User ID
- Organization ID
- User role
- Organization slug (for URLs)

---

## Multi-Tenancy Implementation

### Data Isolation

Every query includes organization_id filter:

```typescript
// Example: Get gyms for current org
const gyms = await db.query.gyms.findMany({
  where: eq(gyms.organizationId, session.user.organizationId)
});
```

### Middleware

```typescript
// Protect dashboard routes
export async function middleware(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return redirect('/login');
  }

  if (!session.user.organizationId && !request.url.includes('/onboarding')) {
    return redirect('/onboarding');
  }
}
```

### URL Structure

```
/dashboard              → Org dashboard
/gyms                   → List org's gyms
/gyms/[gymId]           → Gym details (verify org ownership)
/members                → List org's members
/members/[memberId]     → Member details (verify org ownership)
```

---

## Package Contents

When generated, the project package includes:

```
gym-management/
├── .claude/
│   └── commands/
│       ├── start-session.md      # Begin session safely
│       ├── new-feature.md        # Create feature branches
│       ├── complete-feature.md   # Finish and merge
│       ├── clean-branches.md     # Clean up old branches
│       ├── end-session.md        # Wrap up with feedback
│       ├── commit.md             # Commit with approval
│       ├── summary.md            # Generate reports
│       └── local-env.md          # Local dev environment
│
├── knowledge/
│   └── Next.js-App-Build-Guide.md  # Patterns for Next.js + Better Auth + Drizzle
│
├── commands/
│   └── [workflow documentation]
│
├── provided-files/
│   └── Project-Scope.md          # Original scope document
│
├── PROJECT-BRIEF.md              # Full project context
├── TECHNICAL-DECISIONS.md        # Stack decisions with rationale
└── SETUP.md                      # Instructions for target agent
```

---

## Available Commands

After setup, these slash commands are available:

| Command | Purpose |
|---------|---------|
| `/start-session` | Begin session with branch safety check, load context |
| `/new-feature` | Create feature branch for safe development |
| `/complete-feature` | Merge branch or create PR when done |
| `/clean-branches` | Remove merged or stale branches |
| `/commit` | Draft commit message with approval flow |
| `/end-session` | Update docs, capture learnings, generate feedback, commit |
| `/summary` | Generate accomplishments report for time period |
| `/local-env` | Manage local domains and trusted HTTPS |

---

## Skills to Install

The target agent should install these skills:

```bash
npx add-skill anthropics/skills -s frontend-design
npx add-skill anthropics/skills -s vercel-react-best-practices
```

| Skill | Purpose |
|-------|---------|
| **frontend-design** | Production-grade UI without generic AI aesthetics |
| **vercel-react-best-practices** | React/Next.js performance patterns |

---

## Development Workflow

### Session Flow

```
/start-session
    │
    ▼
/new-feature "add-member-management"
    │
    ▼
[Implement feature]
    │
    ▼
/complete-feature
    │
    ▼
/end-session
```

### Git Workflow

- **main** branch is protected
- Create feature branches for all work
- Merge via `/complete-feature` (direct merge or PR)
- Clean up with `/clean-branches`

---

## Environment Variables

```env
# Database
DATABASE_URL=file:./db.sqlite

# Auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Post-Setup Checklist

After the target agent builds the project:

- [ ] Project structure matches Next.js conventions
- [ ] Database schema created with Drizzle
- [ ] Authentication working (email + Google optional)
- [ ] Onboarding flow complete
- [ ] Gym CRUD working
- [ ] Member CRUD working
- [ ] QR code generation working
- [ ] Multi-tenancy enforced on all queries
- [ ] CLAUDE.md created with project docs
- [ ] Build passes without errors
- [ ] Git repository initialized

---

## Future Versions (Roadmap)

### V2: Classes & Scheduling
- Class types management
- Weekly timetables
- Member bookings
- Waitlist management
- Instructor assignment

### V3: Personal Training
- Trainer profiles
- PT packages
- Session booking
- Usage tracking

### V4: Payments & Billing
- Subscription plans
- Stripe integration
- Invoice generation
- Payment tracking

### V5: Member Portal
- Member login
- View own QR code
- Book classes
- View PT sessions
- Payment history

---

*Generated by Squared Agent for the Gym Management System prototype.*
