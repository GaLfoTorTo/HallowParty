const db = require('../db/database');
const missionModel = require('./missionModel');

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

function _rowToTestamento(row) {
  if (!row) return null;
  const missions = db
    .prepare('SELECT missionId, description, category, fragment FROM testamento_missions WHERE testamento_id = ?')
    .all(row.id);
  return {
    ...row,
    hasCurse: row.hasCurse === 1,
    completed: row.completed === 1,
    missions,
  };
}

function findAll() {
  return db.prepare('SELECT * FROM testamentos').all().map(_rowToTestamento);
}

function findById(id) {
  const row = db.prepare('SELECT * FROM testamentos WHERE id = ?').get(id);
  return _rowToTestamento(row);
}

function findBySenha(senha) {
  const row = db.prepare('SELECT * FROM testamentos WHERE senha = ?').get(senha);
  return _rowToTestamento(row);
}

function _pickMissions(linhagem) {
  const pool = missionModel.findByLinhagem(linhagem);
  return pool.sort(() => Math.random() - 0.5).slice(0, 3);
}

function _pickSenha(linhagem, usedSenhas) {
  const pool = SENHAS_PREDEFINIDAS[linhagem] || [];
  const available = pool.filter((s) => !usedSenhas.includes(s));
  if (available.length > 0) return available[Math.floor(Math.random() * available.length)];
  let senha;
  do {
    senha = String(Math.floor(Math.random() * 900) + 100);
  } while (usedSenhas.includes(senha));
  return senha;
}

function _nextId() {
  const row = db.prepare('SELECT MAX(CAST(id AS INTEGER)) as max FROM testamentos').get();
  return String((row.max || 0) + 1).padStart(3, '0');
}

const _insertTestamento = db.prepare(
  'INSERT INTO testamentos (id, linhagem, guestName, senha, hasCurse, curse, completed, completedAt) VALUES (@id, @linhagem, @guestName, @senha, @hasCurse, @curse, @completed, @completedAt)'
);

const _insertMission = db.prepare(
  'INSERT INTO testamento_missions (testamento_id, missionId, description, category, fragment) VALUES (@testamento_id, @missionId, @description, @category, @fragment)'
);

function create({ linhagem, guestName = null, hasCurse = false }) {
  const usedSenhas = db.prepare('SELECT senha FROM testamentos').all().map((r) => r.senha);
  const missions = _pickMissions(linhagem);
  const senha = _pickSenha(linhagem, usedSenhas);

  const testamento = {
    id: _nextId(),
    linhagem,
    guestName,
    senha,
    hasCurse: hasCurse ? 1 : 0,
    curse: hasCurse ? MALDICOES[linhagem] : null,
    completed: 0,
    completedAt: null,
  };

  const missionRows = missions.map((m, i) => ({
    testamento_id: testamento.id,
    missionId: m.id,
    description: m.description,
    category: m.category,
    fragment: parseInt(senha[i], 10),
  }));

  db.transaction(() => {
    _insertTestamento.run(testamento);
    missionRows.forEach((mr) => _insertMission.run(mr));
  })();

  return _rowToTestamento(db.prepare('SELECT * FROM testamentos WHERE id = ?').get(testamento.id));
}

function generateBatch({ quantidades }) {
  const created = [];
  for (const [linhagem, qty] of Object.entries(quantidades)) {
    for (let i = 0; i < qty; i++) {
      created.push(create({ linhagem, hasCurse: Math.random() < 0.3 }));
    }
  }
  return created;
}

function markCompleted(id) {
  const completedAt = new Date().toISOString();
  db.prepare('UPDATE testamentos SET completed = 1, completedAt = ? WHERE id = ?').run(completedAt, id);
  return findById(id);
}

function assignGuest(id, guestName) {
  db.prepare('UPDATE testamentos SET guestName = ? WHERE id = ?').run(guestName, id);
  return findById(id);
}

function remove(id) {
  const result = db.prepare('DELETE FROM testamentos WHERE id = ?').run(id);
  return result.changes > 0;
}

function clearAll() {
  db.prepare('DELETE FROM testamento_missions').run();
  db.prepare('DELETE FROM testamentos').run();
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
