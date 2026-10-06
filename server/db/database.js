const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/hallowparty.db');

// Ensure the data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS missions (
    id          TEXT PRIMARY KEY,
    linhagem    TEXT NOT NULL,
    category    TEXT NOT NULL,
    description TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS testamentos (
    id          TEXT PRIMARY KEY,
    linhagem    TEXT NOT NULL,
    guestName   TEXT,
    senha       TEXT NOT NULL,
    hasCurse    INTEGER NOT NULL DEFAULT 0,
    curse       TEXT,
    completed   INTEGER NOT NULL DEFAULT 0,
    completedAt TEXT
  );

  CREATE TABLE IF NOT EXISTS testamento_missions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    testamento_id TEXT NOT NULL REFERENCES testamentos(id) ON DELETE CASCADE,
    missionId     TEXT NOT NULL,
    description   TEXT NOT NULL,
    category      TEXT NOT NULL,
    fragment      INTEGER NOT NULL
  );
`);

// Seed missions from JSON if the table is empty
const count = db.prepare('SELECT COUNT(*) as c FROM missions').get().c;
if (count === 0) {
  const missionsFile = path.join(__dirname, '../data/missions.json');
  if (fs.existsSync(missionsFile)) {
    const missions = JSON.parse(fs.readFileSync(missionsFile, 'utf-8'));
    const insert = db.prepare(
      'INSERT INTO missions (id, linhagem, category, description) VALUES (@id, @linhagem, @category, @description)'
    );
    const insertAll = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
    insertAll(missions);
  }
}

module.exports = db;
