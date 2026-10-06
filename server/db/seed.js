const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '../../data/hallowparty.db');

//INSTANCIA DB
const db = new Database(DB_PATH);

//LIMPA TABELAS EXISTENTES
db.exec(`
    DELETE FROM testamento_missions;
    DELETE FROM user_testamentos;
    DELETE FROM user_missions;
    DELETE FROM testamentos;
    DELETE FROM users;
    DELETE FROM missions;
    DELETE FROM trilha;
`);
console.log('Tabelas limpas.');

//USERS
const usersFile = path.join(__dirname, '../seed/users.json');
//TESTAMENTOS
const testamentosFile = path.join(__dirname, '../seed/testamentos.json');
//MISSÕES
const missionsFile = path.join(__dirname, '../seed/missions.json');

//SEED TRILHA
const insert = db.prepare('INSERT INTO trilha (id, nome) VALUES (@id, @nome)');
const insertAll = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
insertAll([
    {"id": 1, "nome": "Vampiro"},
    {"id": 2, "nome": "Fantasma"},
    {"id": 3, "nome": "Zumbi"}
]);

//SEED MISSÕES
if (fs.existsSync(missionsFile)) {
    const missions = JSON.parse(fs.readFileSync(missionsFile, 'utf-8'));
    const insert = db.prepare('INSERT INTO missions (id, titulo, descricao, categoria) VALUES (@id, @titulo, @descricao, @categoria)');
    const insertAll = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
    insertAll(missions);
}

//SEED USERS
if (fs.existsSync(usersFile)) {
    const user = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));
    const insert = db.prepare('INSERT INTO users (id, nome, trilha_id) VALUES (@id, @nome, @trilha_id)');
    const insertAll = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
    insertAll(user);
}

//SEED TESTAMENTOS
if (fs.existsSync(testamentosFile)) {
    const testamentos = JSON.parse(fs.readFileSync(testamentosFile, 'utf-8'));
    const insert = db.prepare('INSERT INTO testamentos (titulo, trilha_id, senha, user_id, completed, completed_at) VALUES (@titulo, @trilha_id, @senha, @user_id, @completed, @completed_at)');
    const insertAll = db.transaction((rows) => rows.forEach((r) => insert.run(r)));
    insertAll(testamentos);
}

//VINCULAR MISSÕES A TESTAMENTOS
db.transaction(() => {
    const insertTM = db.prepare(`INSERT INTO testamento_missions (testamento_id, mission_id) VALUES (@testamento_id, @mission_id)`);
    const missions = JSON.parse(fs.readFileSync(missionsFile, 'utf-8'));
    //RANDOMIZE MISSIONS
    const pickRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);

    [1,2,3,].forEach((i) => {
        const picked = pickRandom(missions, 5);
        picked.forEach((m) => {
            insertTM.run({
                testamento_id: i,
                mission_id:    m.id,
            });
        })
    });
})();

db.close();