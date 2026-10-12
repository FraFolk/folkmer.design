CREATE TABLE IF NOT EXISTS strokes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  ip_hash TEXT,
  key_hash TEXT,
  data TEXT NOT NULL
);
