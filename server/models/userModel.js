const db = require('../db/database');

const get = () => db.prepare('SELECT * FROM users').all();

const find = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;

const findByField = (field, value) => db.prepare(`SELECT * FROM users WHERE ${field} = ${value}`).get() || null;

module.exports = { get, find, findByField };
