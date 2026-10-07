const prisma = require('../db/prisma');

const get = () => prisma.testamento.findMany();

const find = (id) => prisma.testamento.findUnique({ where: { id: Number(id) } });

const complete = (id, userId) =>
  prisma.testamento.update({
    where: { id: Number(id) },
    data: { user_id: userId, completed: 1, completed_at: new Date() },
  });

const getByUser = (userId) =>
  prisma.testamento.findFirst({
    where: { users: { some: { user_id: Number(userId) } } },
  });

module.exports = { get, find, complete, getByUser };
