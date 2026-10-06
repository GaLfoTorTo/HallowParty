const db = require('../db/database');
const missionModel = require('./missionModel');

const get = () => db.prepare('SELECT * FROM testamentos').all();

const find = (id) => db.prepare('SELECT * FROM testamentos WHERE id = ?').get(id);

const complete = (id, userId) => {
  db.prepare('UPDATE testamentos SET user_id = ? WHERE id = ?').run(userId, id);
  return findById(id);
};

module.exports = {
  get,
  find,
  complete,
};
