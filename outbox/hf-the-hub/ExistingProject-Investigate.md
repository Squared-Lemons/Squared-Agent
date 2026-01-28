# Project Analysis & Documentation Generation

You are onboarding to an existing codebase. Your task is to thoroughly analyse this project and create comprehensive documentation that will serve as context for all future development work.

## Phase 1: Discovery

### 1.1 File Structure Analysis
- Map the complete directory structure
- Identify the framework/stack being used
- Note any configuration files (package.json, composer.json, requirements.txt, etc.)
- Identify environment configuration patterns (.env.example, config files)
- Document any build/deployment configurations

### 1.2 Database Analysis
- Locate database schema definitions (migrations, schema files, ORM models)
- Map all tables/collections and their relationships
- Document indexes, constraints, and foreign keys
- Identify any seed data or fixtures
- Note the database technology (PostgreSQL, MySQL, MongoDB, Supabase, etc.)

### 1.3 Codebase Analysis
- Identify entry points (main files, index files, route definitions)
- Map the architectural pattern (MVC, Clean Architecture, etc.)
- Document key modules/services and their responsibilities
- Identify shared utilities, helpers, and common patterns
- Note any third-party integrations or APIs consumed
- Document authentication/authorisation patterns

### 1.4 Dependencies & Infrastructure
- Review all dependencies and their purposes
- Identify any infrastructure-as-code (Docker, Terraform, etc.)
- Note CI/CD configurations
- Document any external services required

---

## Phase 2: Documentation Generation

Create a `@docs` folder in the project root with the following structure:

```
@docs/
├── OVERVIEW.md           # Project summary and quick reference
├── ARCHITECTURE.md       # System design and patterns
├── DATABASE.md           # Complete schema documentation
├── API.md                # API endpoints and contracts (if applicable)
├── COMPONENTS.md         # Key modules/services breakdown
├── SETUP.md              # Local development setup steps
├── CONVENTIONS.md        # Code style, naming, and patterns used
└── DECISIONS.md          # Notable technical decisions observed
```

### Document Templates

#### OVERVIEW.md
```markdown
# [Project Name]

## Quick Reference
- **Stack:** [e.g., Next.js 14, Supabase, TypeScript]
- **Package Manager:** [npm/yarn/pnpm/bun]
- **Node Version:** [if applicable]
- **Database:** [type and connection pattern]

## Project Purpose
[Brief description of what this application does]

## Key Commands
- `[command]` - [description]
- `[command]` - [description]

## Directory Structure
[Tree view of main directories with brief descriptions]

## Critical Files
- `[path]` - [why it's important]
```

#### ARCHITECTURE.md
```markdown
# Architecture

## Pattern
[Describe the architectural pattern used]

## Data Flow
[How data moves through the system]

## Key Abstractions
[Important interfaces, base classes, or patterns]

## Module Boundaries
[How the codebase is organised and why]
```

#### DATABASE.md
```markdown
# Database Schema

## Overview
[Database type, ORM if used, migration approach]

## Tables/Collections

### [table_name]
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| ... | | | |

**Relationships:** [describe foreign keys and relations]
**Indexes:** [list any indexes]

## Entity Relationship Summary
[Describe how main entities relate]
```

#### COMPONENTS.md
```markdown
# Components & Services

## [Component/Service Name]
- **Location:** `[path]`
- **Purpose:** [what it does]
- **Dependencies:** [what it relies on]
- **Used by:** [what depends on it]
- **Key methods/exports:** [main interface]
```

#### CONVENTIONS.md
```markdown
# Code Conventions

## Naming
- Files: [pattern]
- Components: [pattern]
- Functions: [pattern]
- Database: [pattern]

## Patterns Observed
- [Pattern]: [where and why used]

## Error Handling
[How errors are managed]

## Testing Approach
[Testing patterns if present]
```

---

## Phase 3: Execution Instructions

1. **Start with package/config files** to understand the stack
2. **Read any existing documentation** (README, docs folders, comments)
3. **Trace from entry points** to understand the application flow
4. **Examine database migrations/models** in chronological order if possible
5. **Document as you discover** - don't wait until the end
6. **Flag uncertainties** - note anything unclear for future investigation

## Output Requirements

- Write documentation in clear, scannable prose
- Use tables for structured data (schemas, endpoints)
- Include file paths as references
- Keep each document focused and under 500 lines where possible
- Use consistent markdown formatting
- Add a "Last Updated" timestamp to each document

## Begin

Start by running `tree` or `ls -la` to see the project structure, then systematically work through the discovery phases. Create each documentation file as you gather the relevant information.

If you encounter areas that are unclear or require assumptions, document these in DECISIONS.md with a "[NEEDS CLARIFICATION]" tag.