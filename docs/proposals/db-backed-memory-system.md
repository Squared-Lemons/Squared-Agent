# Proposal: DB-Backed Memory System

## Summary

Replace the current file-based session tracking with a SQLite/D1 database system that:
- Makes `/start-session` and `/end-session` faster and more token-efficient
- Enables deployment of the dashboard to Cloudflare (Pages + D1)
- Provides queryable session history, costs, and learnings
- Inherits to spawned projects with clean separation

## Current State

- `/end-session` writes markdown files to `outbox/`
- Dashboard reads and parses these files
- File searching is slow and token-heavy
- Can't easily deploy dashboard online (file-based)
- No structured query capability

## Proposed Architecture

### Database Schema

```sql
-- Core session tracking
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  branch TEXT,
  started_at DATETIME,
  ended_at DATETIME,
  summary TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost_usd REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Commits linked to sessions
CREATE TABLE commits (
  hash TEXT PRIMARY KEY,
  message TEXT,
  project TEXT,
  session_id TEXT REFERENCES sessions(id),
  author TEXT,
  created_at DATETIME
);

-- Pending items / handoffs between sessions
CREATE TABLE pending (
  id TEXT PRIMARY KEY,
  project TEXT,
  item TEXT,
  priority TEXT DEFAULT 'normal',
  created_session TEXT REFERENCES sessions(id),
  resolved_session TEXT REFERENCES sessions(id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Searchable learnings
CREATE TABLE learnings (
  id TEXT PRIMARY KEY,
  project TEXT,
  session_id TEXT REFERENCES sessions(id),
  category TEXT,  -- 'gotcha', 'pattern', 'decision', 'tip'
  content TEXT,
  tags TEXT,  -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_sessions_project ON sessions(project);
CREATE INDEX idx_sessions_ended ON sessions(ended_at);
CREATE INDEX idx_commits_session ON commits(session_id);
CREATE INDEX idx_learnings_category ON learnings(category);
```

### Dual-Mode Operation

```
Local Development:
  App → SQLite file (data/sessions.db)
  
Cloudflare Deployment:
  App (Pages) → D1 database
```

Same schema, same queries. D1 is SQLite-compatible.

### Data Layer Abstraction

```typescript
// packages/core/src/db.ts
export function getDatabase(): Database {
  if (process.env.CF_PAGES) {
    // Cloudflare D1
    return env.DB;
  } else {
    // Local SQLite
    return new Database('./data/sessions.db');
  }
}
```

## Command Changes

### `/start-session` (Optimized)

Before: Load multiple files, parse markdown, search for context
After: 3 quick SQL queries

```sql
-- Last session context
SELECT summary, branch, ended_at 
FROM sessions 
WHERE project = ? 
ORDER BY ended_at DESC LIMIT 1;

-- Recent commits since last session
SELECT message, hash 
FROM commits 
WHERE project = ? AND created_at > ?
ORDER BY created_at DESC LIMIT 10;

-- Pending items
SELECT item, priority 
FROM pending 
WHERE project = ? AND resolved_session IS NULL;
```

### `/end-session` (Optimized)

Before: Generate markdown, write files
After: Insert structured records

```sql
INSERT INTO sessions (id, project, branch, summary, tokens_in, tokens_out, cost_usd, started_at, ended_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);

-- Log commits from this session
INSERT INTO commits (hash, message, project, session_id, created_at)
SELECT hash, message, ?, ?, authored_date 
FROM (git log --since=session_start);

-- Record any learnings
INSERT INTO learnings (id, project, session_id, category, content)
VALUES (?, ?, ?, ?, ?);
```

### `/spawn-project` (Inheritance)

When spawning a child project:

1. Copy database schema (empty tables)
2. Export relevant learnings based on tech stack/project type
3. Child starts with inherited patterns, fresh session history

```sql
-- Export learnings for child (filtered by relevance)
SELECT category, content, tags 
FROM learnings 
WHERE project = 'parent' 
  AND (tags LIKE '%typescript%' OR category = 'pattern');
```

### Other Commands

| Command | DB Usage |
|---------|----------|
| `/new-feature` | Log branch creation linked to session |
| `/complete-feature` | Mark pending resolved, log merge |
| `/summary` | Aggregate query on sessions table |
| `/discuss` | Store discussion for later recall |
| `/agent-feedback` | Query learnings to include in feedback |

## Dashboard Changes

### Current: File-based
- Reads `outbox/sessions/*.json`
- Parses on every load
- Can't deploy to web easily

### Proposed: Database-backed
- Queries sessions table directly
- Real-time aggregations
- Deployable to Cloudflare Pages + D1

### New Dashboard Features
- Cost tracking over time (chart)
- Token usage by project
- Learnings search
- Pending items across projects
- Session timeline

## Migration Path

1. Add database schema and data layer
2. Update `/end-session` to write to DB (keep file output as fallback)
3. Update `/start-session` to read from DB
4. Update dashboard to query DB
5. Add D1 configuration for Cloudflare deployment
6. Deploy dashboard to subdomain
7. Deprecate file-based session tracking

## Deployment

```bash
# Create D1 database
wrangler d1 create squared-agent-dashboard

# Apply schema
wrangler d1 execute squared-agent-dashboard --file=schema.sql

# Deploy dashboard
wrangler pages deploy apps/web/dashboard/dist

# Sync local data to D1
sqlite3 data/sessions.db .dump | wrangler d1 execute squared-agent-dashboard --file=-
```

## File Structure

```
squared-agent/
├── data/
│   ├── sessions.db          # Local SQLite
│   └── schema.sql           # Shared schema
├── packages/
│   └── core/
│       └── src/
│           └── db.ts        # Database abstraction
├── apps/
│   └── web/
│       └── dashboard/
│           ├── wrangler.toml  # D1 binding
│           └── ...
└── templates/
    └── data/
        └── schema.sql       # Schema for spawned projects
```

## Benefits

1. **Performance**: SQL queries vs file parsing
2. **Token efficiency**: Minimal context loading
3. **Deployable**: Dashboard works on Cloudflare
4. **Queryable**: Ad-hoc analysis, aggregations
5. **Inheritance**: Clean spawn with filtered learnings
6. **Scalable**: Works for many projects/sessions

## Timeline

- [ ] Database schema and migrations
- [ ] Data layer abstraction (local + D1)
- [ ] Update `/start-session` 
- [ ] Update `/end-session`
- [ ] Update dashboard to use DB
- [ ] Cloudflare Pages + D1 deployment
- [ ] Update `/spawn-project` inheritance
- [ ] Documentation

## Questions

1. Keep markdown file export as optional feature?
2. How to handle existing session files? (migrate or leave)
3. Dashboard subdomain preference? (dashboard.squaredlemons.com?)
