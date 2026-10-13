CREATE TABLE IF NOT EXISTS strokes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  ip_hash TEXT,
  key_hash TEXT,
  data TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  ip_hash TEXT,
  name TEXT, company TEXT, topic TEXT, email TEXT, body TEXT,
  sent INTEGER DEFAULT 0
);
-- Private case studies: one personal code per approved request
CREATE TABLE IF NOT EXISTS access_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  code_hash TEXT NOT NULL UNIQUE,
  first_name TEXT, last_name TEXT, email TEXT, company TEXT, reason TEXT, page TEXT,
  ip_hash TEXT,
  revoked INTEGER DEFAULT 0,
  uses INTEGER DEFAULT 0,
  last_used_at TEXT,
  sent INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS access_fails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  ip_hash TEXT
);
