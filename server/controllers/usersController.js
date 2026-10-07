const userModel = require('../models/userModel');
const testamentoModel = require('../models/testamentoModel');
const missionModel = require('../models/missionModel');

const TRILHA_IDS = { vampiro: 1, fantasma: 2, zumbi: 3 };

const normalizeMissions = (missions) =>
  missions.map(({ userMissions, ...m }) => ({
    ...m,
    completed: userMissions?.[0]?.fragment != null,
    fragment: userMissions?.[0]?.fragment ?? null,
  }));

// POST /api/users
// Body: { nome, trilha } — trilha: 'vampiro' | 'fantasma' | 'zumbi'
async function create(req, res) {
  const { nome, trilha } = req.body;

  if (!nome || !nome.trim()) return res.status(400).json({ message: 'O Nome é obrigatório' });
  if (!trilha) return res.status(400).json({ message: 'A Trilha é obrigatória' });

  const trilha_id = TRILHA_IDS[trilha.toLowerCase()];
  if (!trilha_id) return res.status(400).json({ message: 'trilha inválida' });

  const existing = await userModel.findByField('nome', nome.trim());
  if (existing) return res.status(409).json({ message: 'Este nome já está sendo usado por outro convidado' });

  try {
    const user = await userModel.create(nome.trim(), trilha_id);
    const [testamento, rawMissions] = await Promise.all([
      testamentoModel.getByUser(user.id),
      missionModel.getByUser(user.id),
    ]);

    return res.status(201).json({ user, testamento, missions: normalizeMissions(rawMissions) });
  } catch (err) {
    const known = err.message?.includes('testamento disponível');
    const message = known
      ? 'Todos os testamentos desta trilha já foram reivindicados. Escolha outra trilha.'
      : 'Não foi possível registrar sua trilha. Tente novamente.';
    return res.status(409).json({ message });
  }
}

// GET /api/users/:id
async function getById(req, res) {
  const user = await userModel.find(req.params.id);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  return res.json(user);
}

// DELETE /api/users/:id
async function remove(req, res) {
  const { id } = req.params;
  try {
    await userModel.remove(id);
    return res.status(200).json({ message: 'Sessão resetada com sucesso' });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
}

module.exports = { create, getById, remove };
