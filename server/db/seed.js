const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const prisma = new PrismaClient();

const missionsFile    = path.join(__dirname, '../seed/missions.json');
const testamentosFile = path.join(__dirname, '../seed/testamentos.json');

const pickRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

async function main() {
  // Limpa na ordem correta (respeita foreign keys)
  await prisma.userMission.deleteMany();
  await prisma.userTestamento.deleteMany();
  await prisma.testamentoMission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.testamento.deleteMany();
  await prisma.mission.deleteMany();
  await prisma.trilha.deleteMany();
  console.log('Tabelas limpas.');

  // Trilhas
  await prisma.trilha.createMany({
    data: [
      { id: 1, nome: 'Vampiro' },
      { id: 2, nome: 'Fantasma' },
      { id: 3, nome: 'Zumbi' },
    ],
  });

  // Missões
  const missions = JSON.parse(fs.readFileSync(missionsFile, 'utf-8'));
  await prisma.mission.createMany({
    data: missions.map(({ id, titulo, descricao, categoria }) => ({ id, titulo, descricao, categoria })),
  });

  // Testamentos
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

  // Vincular missões a testamentos (5 aleatórias por testamento)
  const links = [];
  for (const t of testamentos) {
    const picked = pickRandom(missions, 5);
    for (const m of picked) {
      links.push({ testamento_id: t.id, mission_id: m.id });
    }
  }
  await prisma.testamentoMission.createMany({ data: links });

  console.log('Seed concluído com sucesso.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
