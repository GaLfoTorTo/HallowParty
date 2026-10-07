const prisma = require('../db/prisma');

const get = () => prisma.user.findMany();

const find = (id) => prisma.user.findUnique({ where: { id: Number(id) } });

const findByField = (field, value) => prisma.user.findFirst({ where: { [field]: value } });

const create = async (nome, trilha_id) => {
  const disponiveis = await prisma.testamento.findMany({
    where: { trilha_id, completed: 0 },
  });

  if (!disponiveis.length) throw new Error('Nenhum testamento disponível para esta trilha');

  const testamento = disponiveis[Math.floor(Math.random() * disponiveis.length)];

  const missionIds = (
    await prisma.testamentoMission.findMany({
      where: { testamento_id: testamento.id },
      select: { mission_id: true },
    })
  ).map((r) => r.mission_id);

  return prisma.user.create({
    data: {
      nome,
      testamentos: {
        create: { testamento_id: testamento.id },
      },
      missions: {
        create: missionIds.map((mission_id) => ({ mission_id, fragment: 0 })),
      },
    },
  });
};

const remove = async (id) => {
  const userId = Number(id);

  // Libera o testamento somente se foi completado por este usuário
  const userTestamento = await prisma.userTestamento.findFirst({ where: { user_id: userId } });
  if (userTestamento) {
    const testamento = await prisma.testamento.findUnique({ where: { id: userTestamento.testamento_id } });
    if (testamento?.completed && testamento.user_id === userId) {
      await prisma.testamento.update({
        where: { id: testamento.id },
        data: { completed: 0, completed_at: null, user_id: null },
      });
    }
  }

  // Deleta o user (cascata remove UserMission e UserTestamento)
  await prisma.user.delete({ where: { id: userId } });
};

module.exports = { get, find, findByField, create, remove };
