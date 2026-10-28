const prisma = require('../db/prisma');

async function list(req, res) {
  try {
    const testamentos = await prisma.testamento.findMany({
      include: {
        trilha: true,
        users:  { include: { user: true } },
      },
      orderBy: { id: 'asc' },
    });

    const result = testamentos.map(t => ({
      id:        t.id,
      titulo:    t.titulo,
      senha:     t.senha,
      completed: t.completed,
      linhagem:  t.trilha?.nome?.toLowerCase() ?? null,
      hasCurse:  false,
      guestName: t.users[0]?.user?.nome ?? null,
    }));

    res.json(result);
  } catch (err) {
    console.error('[GET /api/testamentos]', err);
    res.status(500).json({ message: err.message });
  }
}

async function getOne(req, res) {
  try {
    const t = await prisma.testamento.findUnique({
      where: { id: Number(req.params.id) },
      include: { trilha: true, users: { include: { user: true } } },
    });
    if (!t) return res.status(404).json({ message: 'Testamento não encontrado' });
    res.json({
      ...t,
      linhagem:  t.trilha?.nome?.toLowerCase() ?? null,
      guestName: t.users[0]?.user?.nome ?? null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Não utilizado no modelo atual (testamentos são pré-seeded)
async function create(req, res) {
  res.status(410).json({ message: 'Criação individual não suportada no modelo atual.' });
}

// Não utilizado no modelo atual
async function generateBatch(req, res) {
  res.status(410).json({ message: 'Geração em lote não suportada no modelo atual.' });
}

async function remove(req, res) {
  try {
    await prisma.testamento.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Testamento removido' });
  } catch (err) {
    res.status(404).json({ message: 'Testamento não encontrado' });
  }
}

async function clearAll(req, res) {
  try {
    await prisma.$transaction([
      prisma.userMission.deleteMany(),
      prisma.userTestamento.deleteMany(),
      prisma.user.deleteMany(),
      prisma.testamento.updateMany({
        data: { completed: 0, completed_at: null, user_id: null },
      }),
    ]);
    res.json({ message: 'Todos os testamentos foram resetados.' });
  } catch (err) {
    console.error('[DELETE /api/testamentos/batch/all]', err);
    res.status(500).json({ message: err.message });
  }
}

module.exports = { list, getOne, create, generateBatch, remove, clearAll };
