# UX Guides

[← Back to Templates](../README.md) · [← Back to README](../../README.md)

---

Reusable UI/UX patterns with implementation details. These are design patterns agents follow when building interfaces — not framework guides (those are in [knowledge/](../knowledge/)).

## Available Guides

| Guide | Description |
|-------|-------------|
| [Canvas-Panel-Navigation-System.md](Canvas-Panel-Navigation-System.md) | Horizontal panel navigation with infinite scroll |

---

## Canvas-Panel-Navigation-System

**Location:** `templates/ux-guides/Canvas-Panel-Navigation-System.md`

Horizontal, infinite-scrolling panel navigation for complex UIs.

| Feature | What It Provides |
|---------|-----------------|
| Architecture | CanvasProvider + CanvasContainer pattern |
| Panel Management | Open, close, activate, resize |
| URL Sync | Query params reflect panel state |
| Keyboard Nav | Arrow keys, Home/End |
| Unsaved Changes | Track dirty state per panel |

**Best for:** Apps with related entities needing context-preserving navigation:
- CRMs and admin dashboards
- IDE-like interfaces
- Multi-document editors

---

## Adding a UX Guide

1. Create file: `templates/ux-guides/[Pattern-Name].md`

2. Structure with these sections:
   - Overview — What the pattern is
   - When to Use — Problem it solves
   - Architecture — Components and their relationships
   - Implementation — Code with explanations
   - Variations — Customization options

3. Update this README with the new guide

**Naming:** Title-Case with hyphens (`Canvas-Panel-Navigation-System.md`)

Be descriptive — `Canvas-Panel-Navigation-System.md` not `panels.md`

---

## How UX Guides Get Used

1. **During `/new-idea`** — Included based on project requirements
2. **During development** — Agents reference for consistent UI
3. **As templates** — Code adapted for specific projects
