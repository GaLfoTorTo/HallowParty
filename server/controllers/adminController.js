const prisma = require('../db/prisma');
const path = require('path');
const fs = require('fs');

const missionsFile    = path.join(__dirname, '../seed/missions.json');
const testamentosFile = path.join(__dirname, '../seed/testamentos.json');

async function resetDb(req, res) {
  try {
    await prisma.userMission.deleteMany();
    await prisma.userTestamento.deleteMany();
    await prisma.user.deleteMany();
    await prisma.testamento.deleteMany();
    await prisma.mission.deleteMany();
    await prisma.trilha.deleteMany();

    await prisma.trilha.createMany({
      data: [
        { id: 1, nome: 'Vampiro' },
        { id: 2, nome: 'Fantasma' },
        { id: 3, nome: 'Zumbi' },
      ],
    });

    const missions = JSON.parse(fs.readFileSync(missionsFile, 'utf-8'));
    await prisma.mission.createMany({
      data: missions.map(({ id, titulo, descricao, categoria, linhagem }) => ({ id, titulo, descricao, categoria, linhagem })),
    });

    const testamentos = JSON.parse(fs.readFileSync(testamentosFile, 'utf-8'));
    await prisma.testamento.createMany({
      data: testamentos.map((t) => ({
        id:           t.id,
        titulo:       t.titulo,
        trilha_id:    t.trilha_id,
        senha:        String(t.senha),
        user_id:      null,
        completed:    0,
        completed_at: null,
      })),
    });

    return res.json({ message: 'Banco resetado e recriado com sucesso.' });
  } catch (err) {
    console.error('[POST /api/admin/reset]', err);
    return res.status(500).json({ message: err.message });
  }
}

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

module.exports = { stats, resetDb };
