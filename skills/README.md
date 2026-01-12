# Skills

Knowledge base that informs how agents build things. These are reference guides and documentation that agents can consult when implementing specific technologies or patterns.

## Purpose

Skills are **not** step-by-step setup instructions (those live in `setups/`). Instead, they are comprehensive guides that document:

- Architecture patterns and best practices
- Common pitfalls and solutions
- Code examples and templates
- Configuration requirements

Agents reference these skills when building features that use the documented technologies.

## Available Skills

| Skill | Description |
|-------|-------------|
| [Next.js-App-Build-Guide](./Next.js-App-Build-Guide.md) | Building Next.js apps with Better Auth, Drizzle ORM, and Turborepo monorepo |

## How Skills Are Used

1. **During feature development** - Agents consult relevant skills for implementation guidance
2. **In setup profiles** - Setup instructions may reference skills for detailed context
3. **For troubleshooting** - Skills document common pitfalls and solutions

## Adding New Skills

Add comprehensive guides as markdown files. Each skill should include:

- Overview of the technology/pattern
- Architecture and structure
- Code examples
- Configuration requirements
- Common pitfalls and solutions
