const prisma = require('../db/prisma');

const get = () => prisma.mission.findMany();

const find = (id) => prisma.mission.findUnique({ where: { id: Number(id) } });

const getByUser = (userId) =>
  prisma.mission.findMany({
    where: { userMissions: { some: { user_id: Number(userId) } } },
    include: {
      userMissions: {
        where: { user_id: Number(userId) },
        select: { fragment: true },
      },
    },
  });

const complete = async (userId, missionId) => {
  const result = await prisma.userMission.updateMany({
    where: {
      user_id: Number(userId),
      mission_id: Number(missionId),
      fragment: 0,
    },
    data: { fragment: 1 },
  });
  return result.count > 0;
};

module.exports = { get, find, getByUser, complete };
