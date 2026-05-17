-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- IME Entries Table
CREATE TABLE IF NOT EXISTS ime_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    original TEXT NOT NULL,
    bopomofo TEXT,
    short_form TEXT,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Knowledge Base Table
CREATE TABLE IF NOT EXISTS kb_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ko TEXT NOT NULL,
    zh_tw TEXT NOT NULL,
    category TEXT, -- e.g., 'expression', 'game', 'meme'
    tags TEXT, -- JSON string or comma separated
    note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create some default categories or initial data if needed
INSERT INTO projects (name, is_active) VALUES ('무림지존', 1);
INSERT INTO projects (name, is_active) VALUES ('학원액션', 0);
