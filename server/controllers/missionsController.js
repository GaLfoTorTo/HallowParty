const missionModel = require('../models/missionModel');

const normalizeMissions = (missions) =>
  missions.map(({ userMissions, ...m }) => ({
    ...m,
    completed: userMissions?.[0]?.fragment != null,
    fragment: userMissions?.[0]?.fragment ?? null,
  }));

function list(req, res) {
  const missions = missionModel.get();
  res.json(missions);
}

function getOne(req, res) {
  const mission = missionModel.find(req.params.id);
  if (!mission) return res.status(404).json({ message: 'Missão não encontrada' });
  res.json(mission);
}

// POST /api/missions/:id/complete
// Body: { userId }
async function completeMission(req, res) {
  const { userId, fragmento } = req.body;
  const missionId = req.params.id;

  if (!userId) return res.status(400).json({ message: 'userId é obrigatório' });

  try {
    const updated = await missionModel.complete(userId, missionId, fragmento);
    if (!updated) {
      return res.status(409).json({ message: 'Missão não encontrada ou já concluída' });
    }

    const rawMissions = await missionModel.getByUser(userId);
    return res.json({ success: true, missions: normalizeMissions(rawMissions) });
  } catch {
    return res.status(500).json({ message: 'Não foi possível concluir a missão. Tente novamente.' });
  }
}

module.exports = { list, getOne, completeMission };
