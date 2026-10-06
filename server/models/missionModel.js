const db = require('../db/database.js');

const get = () => db.prepare('SELECT * FROM missions').all();

const find = (id) => db.prepare('SELECT * FROM missions WHERE id = ?').get(id) || null;

const getMissions = (user_id) => db.prepare('SELECT * FROM user_missions WHERE id = ?').get(user_id) || null;

const completeMission = (user_id, id) => db.prepare('SELECT * FROM user_missions WHERE user_id = ? AND mission_id = ?').get(user_id, id) || null;

module.exports = { get, find, getMissions, completeMission};
