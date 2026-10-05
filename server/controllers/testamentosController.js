const testamentoModel = require('../models/testamentoModel');

const LINHAGENS_VALIDAS = ['fantasma', 'vampiro', 'zumbi'];

function list(req, res) {
  res.json(testamentoModel.findAll());
}

function getOne(req, res) {
  const t = testamentoModel.findById(req.params.id);
  if (!t) return res.status(404).json({ message: 'Testamento não encontrado' });
  res.json(t);
}

function create(req, res) {
  const { linhagem, guestName, hasCurse } = req.body;
  if (!linhagem || !LINHAGENS_VALIDAS.includes(linhagem.toLowerCase())) {
    return res.status(400).json({ message: 'linhagem deve ser fantasma, vampiro ou zumbi' });
  }
  const testamento = testamentoModel.create({ linhagem: linhagem.toLowerCase(), guestName, hasCurse });
  res.status(201).json(testamento);
}

function generateBatch(req, res) {
  const { quantidades } = req.body;
  if (!quantidades) {
    return res.status(400).json({ message: 'quantidades é obrigatório' });
  }
  const created = testamentoModel.generateBatch({ quantidades });
  res.status(201).json({ total: created.length, testamentos: created });
}

function remove(req, res) {
  const deleted = testamentoModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Testamento não encontrado' });
  res.json({ message: 'Testamento removido' });
}

function clearAll(req, res) {
  testamentoModel.clearAll();
  res.json({ message: 'Todos os testamentos foram removidos' });
}

module.exports = { list, getOne, create, generateBatch, remove, clearAll };
