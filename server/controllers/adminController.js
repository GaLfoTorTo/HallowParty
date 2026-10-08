const prisma = require('../db/prisma');

async function stats(req, res) {
  try {
    const [testamentos, missions, users] = await Promise.all([
      prisma.testamento.findMany({ include: { trilha: true } }),
      prisma.mission.findMany(),
      prisma.user.findMany(),
    ]);

    const byTrilha = { fantasma: 0, vampiro: 0, zumbi: 0 };
    const completedByTrilha = { fantasma: 0, vampiro: 0, zumbi: 0 };

    testamentos.forEach(t => {
      const key = t.trilha?.nome?.toLowerCase();
      if (key && byTrilha[key] !== undefined) {
        byTrilha[key]++;
        if (t.completed) completedByTrilha[key]++;
      }
    });

    res.json({
      provider: 'postgresql',
      totalTestamentos: testamentos.length,
      totalMissions: missions.length,
      totalUsers: users.length,
      completed: testamentos.filter(t => t.completed).length,
      pending: testamentos.filter(t => !t.completed).length,
      byTrilha,
      completedByTrilha,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { stats };
