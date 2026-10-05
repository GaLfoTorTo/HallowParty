const testamentoModel = require('../models/testamentoModel');
const missionModel = require('../models/missionModel');

function stats(req, res) {
  const testamentos = testamentoModel.findAll();
  const missions = missionModel.findAll();

  const byLinhagem = { fantasma: 0, vampiro: 0, zumbi: 0 };
  const completedByLinhagem = { fantasma: 0, vampiro: 0, zumbi: 0 };

  testamentos.forEach(t => {
    byLinhagem[t.linhagem] = (byLinhagem[t.linhagem] || 0) + 1;
    if (t.completed) {
      completedByLinhagem[t.linhagem] = (completedByLinhagem[t.linhagem] || 0) + 1;
    }
  });

  res.json({
    totalTestamentos: testamentos.length,
    totalMissions: missions.length,
    completed: testamentos.filter(t => t.completed).length,
    pending: testamentos.filter(t => !t.completed).length,
    byLinhagem,
    completedByLinhagem,
    recentCompletions: testamentos
      .filter(t => t.completed)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 10)
      .map(t => ({
        id: t.id,
        linhagem: t.linhagem,
        guestName: t.guestName,
        completedAt: t.completedAt,
      })),
  });
}

module.exports = { stats };
