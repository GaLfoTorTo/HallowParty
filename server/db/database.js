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
  CREATE TABLE IF NOT EXISTS trilha (
    id          INTEGER PRIMARY KEY,
    nome        TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS missions (
    id           INTEGER PRIMARY KEY,
    titulo       TEXT NOT NULL,
    descricao    TEXT NOT NULL,
    categoria    TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY,
    nome        TEXT NOT NULL,
    numero      INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS testamentos (
    id           INTEGER PRIMARY KEY,
    titulo       TEXT NOT NULL,
    trilha_id    INTEGER NOT NULL REFERENCES trilha(id) ON DELETE CASCADE,
    senha        TEXT NOT NULL,
    user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
    completed    INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testamento_missions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    testamento_id INTEGER NOT NULL REFERENCES testamentos(id) ON DELETE CASCADE,
    mission_id    INTEGER NOT NULL REFERENCES missions(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_testamentos (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    testamento_id INTEGER NOT NULL REFERENCES testamentos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_missions (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mission_id    INTEGER NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    fragment      INTEGER NOT NULL
  );
`);

module.exports = db;
