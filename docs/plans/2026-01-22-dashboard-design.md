# Work Summary Dashboard Design

**Date:** 2026-01-22
**Status:** Approved

## Overview

Personal dashboard to view work summaries and session costs across multiple Squared-Agent projects.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Location | `apps/web/dashboard` | Personal tool, not publishable package |
| Frontend | Vite + React | Fast dev, simple setup for local app |
| Styling | Tailwind + shadcn/ui | Polished components, familiar stack |
| Charts | Tremor | Dashboard-focused, beautiful defaults |
| Backend | Hono (local API) | Lightweight, reads files from disk |
| Project discovery | Add on demand | Flexible, no config file maintenance |
| Storage | `~/.squared-agent/dashboard-projects.json` | Central registry outside projects |

## Architecture

```
Browser (React)
    │
    │ fetch /api/*
    ▼
Local API Server (Hono)
    │
    │ reads
    ▼
File System
  - ~/.squared-agent/dashboard-projects.json
  - ~/Projects/*/.project/token-usage.md
  - ~/Projects/*/.project/sessions/*.md
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List registered projects |
| POST | `/api/projects` | Add a project path |
| DELETE | `/api/projects/:id` | Remove a project |
| GET | `/api/projects/:id/sessions` | Session logs for project |
| GET | `/api/projects/:id/tokens` | Token usage for project |
| GET | `/api/stats` | Aggregated stats across all projects |
| GET | `/api/stats/sessions` | Sessions for date or month |
| GET | `/api/stats/logs` | Session logs for date or month |
| GET | `/api/settings` | User subscription settings |
| PUT | `/api/settings` | Update subscription settings |

## Data Models

### Project Registry
```typescript
interface ProjectRegistry {
  projects: {
    id: string;
    name: string;
    path: string;
    addedAt: string;
  }[];
}
```

### Token Session
```typescript
interface TokenSession {
  date: string;
  type: "subscription" | "api";
  input: number;
  output: number;
  cacheRead: number;
  cacheCreate: number;
  turns: number;
}
```

### Session Log
```typescript
interface SessionLog {
  date: string;
  sessions: {
    time: string;
    title?: string;
    changes: string[];
    insights: string[];
    commits: string[];
  }[];
}
```

### Aggregated Stats
```typescript
interface Stats {
  totalSessions: number;
  totalCost: number;
  totalTokens: { input, output, cacheRead, cacheCreate };
  byProject: { projectId, sessions, cost, tokens }[];
  byDay: { date, sessions, cost }[];
}
```

## UI Views

### 1. Overview (`/`)
- Metric cards: Total Cost, Sessions This Week, Active Projects, Cache Efficiency
- Area chart: Daily costs over 30 days
- Recent activity feed

### 2. Projects List (`/projects`)
- Card grid with project stats
- Add Project button
- Click to drill into detail

### 3. Project Detail (`/projects/:id`)
- Header with quick stats
- Tabs: Sessions, Costs, Work Log
- Session table with expandable details

### 4. Timeline (`/timeline`)
- Calendar heatmap (GitHub-style)
- Click day to see sessions
- Drill-down shows Changes, Insights, Commits
- Click monthly cards to see month's sessions
- Filter by project

### 5. Settings (`/settings`)
- Subscription plan selection (Free, Pro, Max 5x, Max 20x, Custom)
- Monthly price configuration
- Billing cycle start day
- How costs are calculated explanation

## File Structure

```
apps/web/dashboard/
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── metrics/
│   │   └── projects/
│   ├── pages/
│   │   ├── Overview.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── Timeline.tsx
│   │   └── Settings.tsx
│   ├── hooks/
│   └── lib/
├── server/
│   ├── index.ts
│   ├── routes/
│   └── parsers/
└── tailwind.config.js
```

## Running

```bash
pnpm --filter @squared-agent/dashboard dev
```

Opens at `http://localhost:5173`
