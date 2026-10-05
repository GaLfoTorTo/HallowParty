const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../data/missions.json');

function readAll() {
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function save(missions) {
  fs.writeFileSync(FILE, JSON.stringify(missions, null, 2));
}

function findAll() {
  return readAll();
}

function findById(id) {
  return readAll().find(m => m.id === id) || null;
}

function findByLinhagem(linhagem) {
  return readAll().filter(m => m.linhagem === linhagem.toLowerCase());
}

function create(data) {
  const missions = readAll();
  const mission = { ...data, id: data.id || `M${Date.now()}` };
  missions.push(mission);
  save(missions);
  return mission;
}

function update(id, data) {
  const missions = readAll();
  const idx = missions.findIndex(m => m.id === id);
  if (idx === -1) return null;
  missions[idx] = { ...missions[idx], ...data };
  save(missions);
  return missions[idx];
}

function remove(id) {
  const missions = readAll();
  const idx = missions.findIndex(m => m.id === id);
  if (idx === -1) return false;
  missions.splice(idx, 1);
  save(missions);
  return true;
}

module.exports = { findAll, findById, findByLinhagem, create, update, remove };
