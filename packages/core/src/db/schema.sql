-- Squared Agent Memory Database Schema
-- Compatible with SQLite (local) and Cloudflare D1 (cloud)

-- Core session tracking
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  branch TEXT,
  started_at TEXT,  -- ISO datetime
  ended_at TEXT,    -- ISO datetime
  summary TEXT,
  tokens_in INTEGER DEFAULT 0,
  tokens_out INTEGER DEFAULT 0,
  cost_usd REAL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Commits linked to sessions
CREATE TABLE IF NOT EXISTS commits (
  hash TEXT PRIMARY KEY,
  message TEXT,
  project TEXT NOT NULL,
  session_id TEXT REFERENCES sessions(id),
  author TEXT,
  created_at TEXT
);

-- Pending items / handoffs between sessions  
CREATE TABLE IF NOT EXISTS pending (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  item TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  created_session TEXT REFERENCES sessions(id),
  resolved_session TEXT REFERENCES sessions(id),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Searchable learnings
CREATE TABLE IF NOT EXISTS learnings (
  id TEXT PRIMARY KEY,
  project TEXT NOT NULL,
  session_id TEXT REFERENCES sessions(id),
  category TEXT,  -- 'gotcha', 'pattern', 'decision', 'tip'
  content TEXT NOT NULL,
  tags TEXT,  -- JSON array
  created_at TEXT DEFAULT (datetime('now'))
);

-- Project metadata
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  path TEXT,
  parent_id TEXT REFERENCES projects(id),
  created_at TEXT DEFAULT (datetime('now')),
  metadata TEXT  -- JSON
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sessions_project ON sessions(project);
CREATE INDEX IF NOT EXISTS idx_sessions_ended ON sessions(ended_at);
CREATE INDEX IF NOT EXISTS idx_commits_session ON commits(session_id);
CREATE INDEX IF NOT EXISTS idx_commits_project ON commits(project);
CREATE INDEX IF NOT EXISTS idx_pending_project ON pending(project);
CREATE INDEX IF NOT EXISTS idx_pending_unresolved ON pending(resolved_session) WHERE resolved_session IS NULL;
CREATE INDEX IF NOT EXISTS idx_learnings_project ON learnings(project);
CREATE INDEX IF NOT EXISTS idx_learnings_category ON learnings(category);
