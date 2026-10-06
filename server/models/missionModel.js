const db = require('../db/database');

function findAll() {
  return db.prepare('SELECT * FROM missions').all();
}

function findById(id) {
  return db.prepare('SELECT * FROM missions WHERE id = ?').get(id) || null;
}

function findByLinhagem(linhagem) {
  return db.prepare('SELECT * FROM missions WHERE linhagem = ?').all(linhagem.toLowerCase());
}

function create(data) {
  const mission = { ...data, id: data.id || `M${Date.now()}` };
  db.prepare(
    'INSERT INTO missions (id, linhagem, category, description) VALUES (@id, @linhagem, @category, @description)'
  ).run(mission);
  return mission;
}

function update(id, data) {
  const existing = findById(id);
  if (!existing) return null;
  const updated = { ...existing, ...data, id };
  db.prepare(
    'UPDATE missions SET linhagem = @linhagem, category = @category, description = @description WHERE id = @id'
  ).run(updated);
  return updated;
}

function remove(id) {
  const result = db.prepare('DELETE FROM missions WHERE id = ?').run(id);
  return result.changes > 0;
}

module.exports = { findAll, findById, findByLinhagem, create, update, remove };
