const db = require('../db/database');

const get = () => db.prepare('SELECT * FROM users').all();

const find = (id) => db.prepare('SELECT * FROM users WHERE id = ?').get(id) || null;

const findByName = (name) => db.prepare('SELECT * FROM users WHERE name = ?').get(name) || null;

module.exports = { get, find, findByName };
