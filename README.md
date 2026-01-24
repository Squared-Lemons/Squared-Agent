# Squared Agent: The Whole Story

*A project where the deliverable isn't code—it's intelligence.*

---

## The Big Idea (Or: Why This Exists)

Imagine you're a chef who's spent years perfecting your recipes, techniques, and kitchen workflows. Every time you train a new cook, you repeat the same lessons: "This is how we chop onions here," "Never add cold butter to hot sauce," "Always taste before serving."

Now imagine you could clone yourself—not your body, but your *expertise*. A version of you that already knows every recipe, remembers every lesson learned from every burnt sauce and undercooked steak, and can adapt to any kitchen it walks into.

**That's Squared Agent.**

It's a "master agent" system that captures your development practices, technical patterns, and accumulated wisdom—then deploys copies of that intelligence to client projects. The deliverable isn't static code. It's a working AI that already knows how you think.

---

## The Architecture: Three Generations of Knowledge

Think of it like a family business with a specific structure:

```
MASTER AGENT (The Grandparent)
Your accumulated expertise, workflows, and best practices.
Everything you've learned from every project.
    │
    └── spawns ──┬──→ CLIENT PROJECT A (The Parent)
                 │    Inherits the master, plus adds its own project-specific knowledge
                 │        │
                 │        └── spawns ──→ MICROSITE FOR CLIENT A
                 │                       A focused subset—just what's needed
                 │
                 └──→ CLIENT PROJECT B (Another Parent)
                      Different project, same inherited wisdom
```

Each layer **inherits from its parent**, then evolves independently. It's pass-through inheritance—when a spawned project spawns its own child, it copies *its own* commands and knowledge, not the original master's. This enables specialization chains that get progressively more focused.

The analogy: A franchise restaurant. Corporate headquarters (the master) has all the recipes and training manuals. Each franchise (client project) inherits those, then adapts to local tastes. A franchise might even open a food truck (microsite) with a focused menu.

---

## The Monorepo Structure: Organized Chaos

This is a hybrid—part documentation hub, part npm package factory:

```
packages/              ← Things you publish to npm
  core/               ← Shared utilities (the "utils" every project copies)
  cli/                ← The command-line tool for bootstrapping
  create-project/     ← The "npm create squared-agent" magic
  dev-server/         ← Automatic port allocation (we'll get to this)

apps/
  web/dashboard/      ← Visual cost tracking and session management

templates/             ← The knowledge library (gets copied to spawned projects)
  commands/           ← "Here's how to run /end-session"
  knowledge/          ← Framework guides organized by topic
  profiles/           ← Pre-built configurations
  skills/             ← Portable agent capabilities
  workflows/          ← Development processes

.claude/commands/      ← The actual executable commands
```

**The key insight:** Templates are *documentation about how to create commands*. Active commands are *the actual commands*. The master agent runs the active commands, then copies the templates to spawned projects so they can create their own.

It's like the difference between a recipe book and the meal itself.

---

## The Clever Bits: Technical Decisions That Actually Matter

### 1. The Result Type (Or: Why Exceptions Are The Enemy)

In `@squared-agent/core`, there's this pattern:

```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }
```

Instead of code that might throw exceptions anywhere:
```typescript
// Old way: pray nothing breaks
const user = await getUser(id)  // Might throw. Might not. Who knows?
```

You get explicit success or failure:
```typescript
// New way: errors are values, not surprises
const result = await getUser(id)
if (!result.success) {
  // Handle the error—you KNOW it might happen
  return { error: result.error }
}
// TypeScript now knows result.data exists
```

**Why this matters:** No more "I forgot to wrap this in try-catch." Errors become normal data flow, not exceptional bombs that blow up your call stack. Every function signature tells you "yes, this can fail" or "no, this always works."

*The lesson:* Make impossible states unrepresentable. If your code can fail, make that explicit in the types.

---

### 2. Dynamic Port Allocation (Or: The Worktree Wars)

Here's a war story.

Git worktrees are amazing—you can have multiple branches checked out simultaneously, work on a hotfix while your feature branch compiles, review code without stashing. But they have a fatal flaw: **every worktree wants port 3000.**

Run `pnpm dev` in worktree A. It grabs port 3000. Run `pnpm dev` in worktree B. Crash. Port already in use.

The naive fix: "Just configure different ports!" Sure, until you forget. Or someone new joins. Or you have six worktrees and can't remember which port goes where.

The `dev-server` package solves this elegantly:

1. **Scan for available ports** at runtime (skipping common ones like 5432 for Postgres)
2. **Find a contiguous range** (10 ports by default—room for frontend, backend, database, etc.)
3. **Inject environment variables** via Turborepo: `PORT_DASHBOARD=3847`, `DASHBOARD_URL=http://localhost:3847`
4. **Each app reads its assigned port** automatically

Now every worktree runs `pnpm dev` and Just Works™. No configuration. No conflicts. No thinking.

*The lesson:* Don't make developers configure things they shouldn't have to think about. Auto-detect, then get out of the way.

---

### 3. Token Tracking (Or: Where Did My Money Go?)

Claude API isn't free. And if you're running autonomous agents, costs can spiral fast without visibility.

Every session captures raw token data:
- **Input tokens:** What you sent to the model
- **Output tokens:** What the model generated
- **Cache tokens:** Previously-seen context (cheaper)
- **Billing type:** Subscription (flat monthly) vs API (pay-per-token)

This flows into `.project/token-usage.md`, which the Dashboard reads and visualizes.

But here's the clever part: **costs are calculated at report time, not capture time.**

Why? Pricing changes. What cost $15/million tokens last month might cost $10/million next month. If you baked prices into the data, you'd need to retroactively update everything. Instead, you store raw tokens and multiply by current prices when you need the number.

*The lesson:* Separate raw data from derived calculations. Store facts, compute interpretations.

---

### 4. Protected Branch Safety (Or: Teaching Git Discipline)

Every developer has done it: committed directly to `main` by accident, then scrambled to undo it.

Squared Agent enforces branch discipline through its commands:

```
[You're on main]
↓
Check: Is this a protected branch? (main, master, develop, release/*)
↓
Yes → STOP. Check inbox first (maybe there's feedback to process)
       Then: "You need to be on a feature branch. Run /new-feature"
↓
No → Proceed to work. Check for handovers from last session.
```

The agent literally won't let you commit to protected branches through its workflows. You have to create a feature branch first.

*The lesson:* Don't rely on developer discipline—build guardrails into the system. Make the right thing easy and the wrong thing hard.

---

### 5. Handover Documents (Or: Solving "Where Was I?")

You're deep in a feature. You've loaded context—which files need changes, what the edge cases are, why that workaround exists. Then you close the laptop.

Tomorrow, you sit down and... blank. Where were you? What was next?

Handover documents solve this:

```markdown
# Feature: Add payment processing

## Status
70% complete. Stripe integration working. Webhook handler pending.

## Recent Changes
- Added StripeClient wrapper (src/lib/stripe.ts)
- Created checkout session endpoint (src/app/api/checkout/route.ts)

## Next Steps
1. Implement webhook signature verification
2. Handle "checkout.session.completed" event
3. Update user subscription status in database
```

`/end-session` creates this. `/start-session` displays it when you return to that branch.

*The lesson:* Session continuity is a product feature. Design for context switching, not just the happy path.

---

## The Template System: How Spawning Actually Works

When you run `/spawn-project`, two things can happen:

**Discovery Flow ("Discuss & Design"):**
You have a vague idea. The agent asks questions—What problem are you solving? Who's it for? How big is it? What technologies make sense? By the end, you have a full project package: brief, technical decisions, and setup instructions.

**Template Flow ("Use Template"):**
You know what you want. Select a profile (developer), pick knowledge categories (web framework + auth + database), and the agent assembles a package from pre-built components.

Both flows output to `outbox/[project-slug]/`:

```
outbox/
  gym-management/
    .claude/commands/      ← Active commands for this project
    knowledge/             ← Selected guides
    SETUP.md              ← Run this to bootstrap
    PROJECT-BRIEF.md      ← What we're building
    README.md             ← The project spec
```

Then you copy this to wherever the new project lives, and the agent there runs SETUP.md.

**The magic of pass-through inheritance:**

When a spawned project spawns *its own* child, it doesn't reach back to the master's templates. It copies its own `.claude/commands/` and `knowledge/`. This means each generation can add its own commands and guides, and those propagate forward.

Think of it like genetic inheritance—you get your parents' DNA, not your grandparents' directly.

---

## The Dashboard: Making Invisible Things Visible

The Dashboard (`apps/web/dashboard/`) is a React + Tremor app that shows you:

1. **Cost trends** over time—are you spending more or less?
2. **Per-project breakdown**—which project is eating your budget?
3. **Session details**—exactly where the tokens went
4. **Subscription utilization**—are you hitting your limits?

The architecture is simple:
- **Hono server** reads `.project/token-usage.md` from registered projects
- **Aggregates data** across all projects
- **React frontend** visualizes trends

*The lesson:* Build visibility into your systems from day one. You can't optimize what you can't see.

---

## Bugs We Hit and How We Fixed Them

### The Intermittent Chrome Extension Error

**The bug:** Using `claude-in-chrome` for browser automation, sometimes actions would fail with "Cannot access chrome-extension:// URL."

**What was happening:** Between clicking an element and capturing a screenshot, something in Chrome's extension architecture would hiccup.

**The fix:** We documented it as a known issue and added retry logic. Some bugs you fix, some you work around. Knowing which is which is wisdom.

### The Port Race Condition

**The bug:** Two processes check if port 3000 is available. Both get "yes." Both try to bind. One fails.

**The fix:** Check for a *range* of ports at once. If you need 10 ports starting at 3000, check all 10 before claiming any. Also, maintain a process-local lock during the check-and-bind operation.

### The Stale Template Problem

**The bug:** Commands in the master agent would evolve, but spawned projects had the old versions.

**The fix:** Created `/sync-templates` to detect drift between active commands (`.claude/commands/`) and template guides (`templates/commands/`). Run it before spawning to ensure templates are current.

*Broader lesson:* When you have two sources of truth, they *will* diverge. Build reconciliation into your workflow.

---

## Lessons for Good Engineers

### 1. Make the Pit of Success Wide

Every default should be the right choice. `pnpm dev` should Just Work. Branch protection should be automatic. Token tracking should happen silently.

Configuration is an admission of design failure. The fewer knobs, the better.

### 2. Design for the Second User

The first user of your system is you. You understand everything. The second user is confused.

Squared Agent's commands are designed for someone who doesn't know the project. `/start-session` explains what's happening. Handovers capture context. Error messages suggest solutions.

### 3. Explicit Over Implicit

The Result type makes failure explicit. Protected branches make safety explicit. Handovers make context explicit.

Implicit knowledge gets lost. Explicit knowledge survives.

### 4. Compound Your Learnings

The master agent has a `knowledge/archive/` folder. Every piece of feedback processed, every bug fixed, every pattern discovered—it's captured and folded back in.

A year from now, this agent will be dramatically smarter than it is today. Not because of some magical AI advance, but because every session deposits a little more wisdom.

### 5. Separate Facts from Interpretations

Store raw tokens, not dollar amounts. Store git commits, not summaries. Store session timestamps, not "last modified."

Facts don't change. Interpretations might need to be recalculated later.

### 6. Build for Offline-First

All data lives in local files. No external services required. No API keys to manage (except for Claude itself).

This means:
- Fast—no network latency for operations
- Private—data never leaves your machine
- Resilient—works on a plane, in a bunker, anywhere

---

## The Philosophy: Intelligence as a Deliverable

Traditional software development delivers code. You hand over a repository, some documentation, maybe a runbook. The client maintains it going forward.

Squared Agent delivers *capability*.

When you spawn a project for a client, they don't just get React components and API routes. They get an AI that understands their architecture, knows the gotchas, can explain why decisions were made, and can extend the system following established patterns.

This changes the economics:
- **Scaling:** Your expertise scales to unlimited concurrent projects
- **Consistency:** Every project follows your best practices automatically
- **Evolution:** Improvements flow to all projects, not just new ones
- **Handoff:** Clients can ask the agent questions instead of searching docs

The agent isn't the tool you use to build. The agent *is* the deliverable.

---

## What's Actually Here: The File Tour

```
.claude/commands/        ← The working commands you actually run
  start-session.md       ← Begin your day
  end-session.md         ← Wrap up your day
  spawn-project.md       ← Create a new project
  new-feature.md         ← Start feature work
  complete-feature.md    ← Finish feature work
  ... and more

packages/
  core/                  ← The Result<T, E> type and utilities
  cli/                   ← Command-line interface
  create-project/        ← npm create magic
  dev-server/            ← Port allocation sorcery

apps/web/dashboard/      ← The visual cost tracker

templates/
  commands/              ← Documentation for commands (copied to spawned projects)
  knowledge/
    web/nextjs/          ← Next.js patterns
    auth/better-auth/    ← Authentication patterns
    database/drizzle/    ← ORM patterns
    monorepo/turborepo/  ← Monorepo patterns
    patterns/            ← Cross-cutting concerns
  profiles/developer/    ← Full developer setup
  skills/                ← Portable agent capabilities

inbox/
  ideas/                 ← Your future improvements
  feedback/              ← Learnings from spawned projects

outbox/
  feedback/              ← Feedback to send upstream
  discussions/           ← Exploratory conversation output
  handovers/             ← Context for returning to branches
```

---

## Getting Started: The Two-Minute Version

```bash
# Clone and install
git clone <repo>
cd Squared-Agent
pnpm install

# Build everything
pnpm build

# Start the dashboard (optional)
pnpm --filter @squared-agent/dashboard dev

# Begin a session
# (Claude Code will handle this—just run /start-session)
```

Then talk to Claude:
- `/start-session` → Sets up your environment
- `/new-feature "add dark mode"` → Creates a safe branch
- `/end-session` → Wraps up with commits and handover
- `/spawn-project` → Creates a new client project

---

## Final Thoughts

Squared Agent represents a shift in how we think about software development expertise.

Traditionally, expertise lives in people. When they leave, the knowledge leaves. When they're busy, the knowledge is unavailable. Scaling requires hiring more people who know less.

This project captures expertise in a runnable form. The master agent embodies your patterns. Spawned projects inherit and extend them. Learnings flow back to improve the source.

It's not about replacing developers. It's about amplifying them. Making sure the best practices are always available, the common mistakes are always caught, and the accumulated wisdom is never lost.

The agent is the deliverable.

And now you understand how it works.

---

**Want the full technical reference?** See [docs/README-detailed.md](docs/README-detailed.md) for complete command documentation, configuration options, and project structure details.
