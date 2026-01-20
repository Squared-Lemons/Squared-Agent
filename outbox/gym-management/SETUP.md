# Project Setup

This folder contains everything needed to build the Gym Management System.

## What's Included

- **README.md** - Comprehensive project specification
- **.claude/commands/** - Slash commands for development workflow
- **PROJECT-BRIEF.md** - Full project context and requirements
- **TECHNICAL-DECISIONS.md** - Technology choices with rationale
- **knowledge/** - Platform-specific guidance and patterns
- **provided-files/** - Original project scope document

## Skills to Install

Install these skills during setup for optimal development:

```bash
npx add-skill anthropics/skills -s frontend-design
npx add-skill anthropics/skills -s vercel-react-best-practices
```

| Skill | Purpose |
|-------|---------|
| **frontend-design** | Production-grade UI without generic AI aesthetics |
| **vercel-react-best-practices** | React/Next.js performance patterns |

## Available Commands

After opening in Claude Code, these commands are available:

| Command | Purpose |
|---------|---------|
| `/start-session` | Begin session with branch safety check |
| `/new-feature` | Create feature branch for safe development |
| `/complete-feature` | Merge or create PR when done |
| `/clean-branches` | Remove merged or stale branches |
| `/commit` | Draft commit message and commit changes |
| `/end-session` | Update docs, capture learnings, commit |
| `/summary` | Generate accomplishments report |
| `/local-env` | Manage local domains and trusted HTTPS |

## For the Target Agent

Read these files in order:

1. **README.md** - Comprehensive project specification (overview, scope, tech stack, workflows)
2. **PROJECT-BRIEF.md** - Full project context and requirements
3. **TECHNICAL-DECISIONS.md** - Understand the technical approach
4. **knowledge/*.md** - Learn platform patterns and gotchas

Then:

1. Enter plan mode to design the implementation
2. Create the project structure based on platform guide
3. Implement core features from the brief
4. Set up development commands from commands/ guides
5. Create CLAUDE.md documenting the project
6. **Run build and fix any errors** until it passes
7. **Run /end-session** to generate creator feedback for the master agent

## CLAUDE.md Requirements

When creating CLAUDE.md, include these sections:

### Browser Automation (required)

```markdown
## Browser Automation

**Default:** Use `claude-in-chrome` (mcp__claude-in-chrome__*) for all browser testing.

**Key tools:**
- `tabs_context_mcp` - Get current tabs (call first)
- `tabs_create_mcp` - Create new tab
- `read_page` - Get page structure with element refs
- `computer` - Click, type, screenshot
- `navigate` - Go to URL

**Pattern:**
1. Call `tabs_context_mcp` to see existing tabs
2. Create new tab with `tabs_create_mcp`
3. Navigate and interact
```

## Verification Checklist

After setup, verify:
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

## Final Build & Feedback

**IMPORTANT:** Before cleanup, run a full build to verify everything works:

```bash
# Run build (adjust for your package manager)
pnpm build || npm run build || bun run build
```

### If build errors occur

1. Read the error messages carefully
2. Fix each error systematically
3. Re-run the build until it passes
4. Document any gotchas in CLAUDE.md

### Once build passes

Run `/end-session` to generate creator feedback. This feedback helps improve the master agent for future projects by capturing:

- **Knowledge gaps** - What was missing from the guides?
- **Setup issues** - What config was unclear or missing?
- **New patterns** - What reusable code was created?
- **Technical gotchas** - What library issues were discovered?

The feedback will be displayed for you to copy back to the Squared-Agent repository's `inbox/from-projects/` folder.

## Post-Setup Cleanup

**IMPORTANT:** After the project has been successfully built and verified, consolidate all setup documentation:

```bash
mkdir -p agent/setup
mv SETUP.md PROJECT-BRIEF.md TECHNICAL-DECISIONS.md agent/setup/
mv knowledge provided-files agent/setup/ 2>/dev/null || true
```

This keeps everything version-controlled with the project:
- **agent/setup/SETUP.md** - Original setup instructions
- **agent/setup/PROJECT-BRIEF.md** - Requirements and decisions
- **agent/setup/TECHNICAL-DECISIONS.md** - Technology choices
- **agent/setup/knowledge/** - Platform guidance
- **agent/setup/provided-files/** - Original user files

**Why this matters:**
- Project root stays clean (only CLAUDE.md, README.md, src/, etc.)
- Setup context preserved for future reference
- Original requirements documented alongside implementation

**Do this cleanup before your first commit.**

---

*Generated by Squared Agent for the Gym Management System v1 prototype.*
