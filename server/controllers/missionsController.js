const missionModel = require('../models/missionModel');

function list(req, res) {
  const { linhagem } = req.query;
  const missions = linhagem
    ? missionModel.findByLinhagem(linhagem)
    : missionModel.findAll();
  res.json(missions);
}

function getOne(req, res) {
  const mission = missionModel.findById(req.params.id);
  if (!mission) return res.status(404).json({ message: 'Missão não encontrada' });
  res.json(mission);
}

function create(req, res) {
  const { id, linhagem, category, description } = req.body;
  if (!linhagem || !category || !description) {
    return res.status(400).json({ message: 'linhagem, category e description são obrigatórios' });
  }
  const mission = missionModel.create({ id, linhagem, category, description });
  res.status(201).json(mission);
}

function update(req, res) {
  const mission = missionModel.update(req.params.id, req.body);
  if (!mission) return res.status(404).json({ message: 'Missão não encontrada' });
  res.json(mission);
}

function remove(req, res) {
  const deleted = missionModel.remove(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Missão não encontrada' });
  res.json({ message: 'Missão removida' });
}

module.exports = { list, getOne, create, update, remove };
