const fs = require('fs');
const path = require('path');
const missionModel = require('./missionModel');

const FILE = path.join(__dirname, '../data/testamentos.json');

// Predefined passwords per lineage (from PDF page 20)
const SENHAS_PREDEFINIDAS = {
  fantasma: ['739', '381', '625', '914', '472'],
  vampiro:  ['482', '157', '936', '521', '804'],
  zumbi:    ['516', '293', '741', '658', '327'],
};

const MALDICOES = {
  fantasma: 'Durante os próximos 10 minutos, sempre que alguém chamar seu nome, você deverá responder: "Eu já morri uma vez."',
  vampiro:  'Durante 10 minutos, você não poderá tocar em nada vermelho.',
  zumbi:    'Quando ouvir a palavra "morto", deverá permanecer imóvel durante 5 segundos.',
};

function readAll() {
  return JSON.parse(fs.readFileSync(FILE, 'utf-8'));
}

function save(testamentos) {
  fs.writeFileSync(FILE, JSON.stringify(testamentos, null, 2));
}

function findAll() {
  return readAll();
}

function findById(id) {
  return readAll().find(t => t.id === id) || null;
}

function findBySenha(senha) {
  return readAll().find(t => t.senha === senha) || null;
}

function _pickMissions(linhagem) {
  const pool = missionModel.findByLinhagem(linhagem);
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function _pickSenha(linhagem, usedSenhas) {
  const pool = SENHAS_PREDEFINIDAS[linhagem] || [];
  const available = pool.filter(s => !usedSenhas.includes(s));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  // Generate a random 3-digit code if pool is exhausted
  let senha;
  do {
    senha = String(Math.floor(Math.random() * 900) + 100);
  } while (usedSenhas.includes(senha));
  return senha;
}

function _nextId() {
  const all = readAll();
  if (all.length === 0) return '001';
  const maxId = Math.max(...all.map(t => parseInt(t.id, 10)));
  return String(maxId + 1).padStart(3, '0');
}

function create({ linhagem, guestName = null, hasCurse = false }) {
  const testamentos = readAll();
  const usedSenhas = testamentos.map(t => t.senha);
  const missions = _pickMissions(linhagem);
  const senha = _pickSenha(linhagem, usedSenhas);

  const testamento = {
    id: _nextId(),
    linhagem,
    guestName,
    missions: missions.map((m, i) => ({
      missionId: m.id,
      description: m.description,
      category: m.category,
      fragment: parseInt(senha[i], 10),
    })),
    senha,
    hasCurse,
    curse: hasCurse ? MALDICOES[linhagem] : null,
    completed: false,
    completedAt: null,
  };

  testamentos.push(testamento);
  save(testamentos);
  return testamento;
}

function generateBatch({ quantidades }) {
  // quantidades: { fantasma: 40, vampiro: 40, zumbi: 40 }
  const created = [];
  for (const [linhagem, qty] of Object.entries(quantidades)) {
    for (let i = 0; i < qty; i++) {
      const hasCurse = Math.random() < 0.3; // 30% chance of curse
      created.push(create({ linhagem, hasCurse }));
    }
  }
  return created;
}

function markCompleted(id) {
  const testamentos = readAll();
  const idx = testamentos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  testamentos[idx].completed = true;
  testamentos[idx].completedAt = new Date().toISOString();
  save(testamentos);
  return testamentos[idx];
}

function assignGuest(id, guestName) {
  const testamentos = readAll();
  const idx = testamentos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  testamentos[idx].guestName = guestName;
  save(testamentos);
  return testamentos[idx];
}

function remove(id) {
  const testamentos = readAll();
  const idx = testamentos.findIndex(t => t.id === id);
  if (idx === -1) return false;
  testamentos.splice(idx, 1);
  save(testamentos);
  return true;
}

function clearAll() {
  save([]);
}

module.exports = {
  findAll,
  findById,
  findBySenha,
  create,
  generateBatch,
  markCompleted,
  assignGuest,
  remove,
  clearAll,
};
