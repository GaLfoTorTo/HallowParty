const path = require('path');
const fs = require('fs');
const prisma = require('../db/prisma');
const testamentoModel = require('../models/testamentoModel');
const missionModel = require('../models/missionModel');

const MISSIONS_FILE = path.join(__dirname, '../seed/missions.json');
const TESTAMENTOS_FILE = path.join(__dirname, '../seed/testamentos.json');

async function resetDb(req, res) {
  try {
    await prisma.$transaction([
      prisma.userMission.deleteMany(),
      prisma.userTestamento.deleteMany(),
      prisma.testamentoMission.deleteMany(),
      prisma.user.deleteMany(),
      prisma.testamento.deleteMany(),
      prisma.mission.deleteMany(),
      prisma.trilha.deleteMany(),
    ]);

    // Seed trilha
    await prisma.trilha.createMany({
      data: [
        { id: 1, nome: 'Vampiro' },
        { id: 2, nome: 'Fantasma' },
        { id: 3, nome: 'Zumbi' },
      ],
    });

    // Seed missions
    const missions = JSON.parse(fs.readFileSync(MISSIONS_FILE, 'utf-8'));
    await prisma.mission.createMany({
      data: missions.map(({ id, titulo, descricao, categoria }) => ({ id, titulo, descricao, categoria })),
    });

    // Seed testamentos
    const testamentos = JSON.parse(fs.readFileSync(TESTAMENTOS_FILE, 'utf-8'));
    await prisma.testamento.createMany({
      data: testamentos.map((t) => ({
        id: t.id,
        titulo: t.titulo,
        trilha_id: t.trilha_id,
        senha: String(t.senha),
        user_id: null,
        completed: 0,
        completed_at: null,
      })),
    });

    // Link testamento_missions (5 random per testamento)
    const pickRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
    const links = [];
    for (const t of testamentos) {
      const picked = pickRandom(missions, 5);
      for (const m of picked) {
        links.push({ testamento_id: t.id, mission_id: m.id });
      }
    }
    await prisma.testamentoMission.createMany({ data: links });

    res.json({ success: true, message: 'Banco de dados resetado com sucesso.' });
  } catch (err) {
    console.error('resetDb error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

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

module.exports = { stats, resetDb };
