# UX Guides

UI/UX patterns and implementation guides that agents follow when building interfaces.

## Purpose

UX guides document reusable interface patterns - how to build specific UI systems that follow the master agent's standards. These are not framework guides (those are in `knowledge/`) but rather design patterns with implementation details.

## Available Guides

| Guide | Description |
|-------|-------------|
| [Canvas-Panel-Navigation-System](./Canvas-Panel-Navigation-System.md) | Horizontal panel navigation with canvas-style scrolling |

## How UX Guides Are Used

1. **During `/new-idea`** - Relevant UX patterns are included based on project requirements
2. **During feature development** - Agents reference these for consistent UI implementation
3. **As templates** - Code examples can be adapted for specific projects

## How to Extend

### Adding a New UX Guide

1. Create `templates/ux-guides/[Pattern-Name].md`
2. Include:
   - Overview of the pattern
   - When to use it
   - Implementation details with code examples
   - Variations and customization options
3. Update this README
4. Update CLAUDE.md Available Content section

### Naming Convention

- Use Title-Case with hyphens: `[Pattern-Name].md`
- Be descriptive: `Canvas-Panel-Navigation-System.md` not `panels.md`
