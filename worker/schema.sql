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
