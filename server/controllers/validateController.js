const testamentoModel = require('../models/testamentoModel');

// POST /api/validate
// Body: { testamentoId, senha, guestName }
function validate(req, res) {
  const { testamentoId, senha, guestName } = req.body;

  if (!testamentoId || !senha) {
    return res.status(400).json({ message: 'testamentoId e senha são obrigatórios' });
  }

  const testamento = testamentoModel.findById(testamentoId.toString().padStart(3, '0'));

  if (!testamento) {
    return res.status(404).json({
      valid: false,
      message: 'Testamento não encontrado. Verifique o número do seu envelope.',
    });
  }

  if (testamento.completed) {
    return res.status(409).json({
      valid: false,
      message: 'Esta herança já foi reivindicada.',
    });
  }

  if (testamento.senha !== senha.toString()) {
    return res.status(200).json({
      valid: false,
      message: 'Senha incorreta. Os mortos não se convencem tão facilmente...',
    });
  }

  // Valid — mark as completed
  if (guestName) testamentoModel.assignGuest(testamento.id, guestName);
  const completed = testamentoModel.markCompleted(testamento.id);

  return res.json({
    valid: true,
    message: 'A herança é sua.',
    testamento: {
      id: completed.id,
      linhagem: completed.linhagem,
      guestName: completed.guestName,
      completedAt: completed.completedAt,
    },
  });
}

// POST /api/validate/check — check only, does not mark completed (for guardian preview)
function check(req, res) {
  const { testamentoId, senha } = req.body;

  if (!testamentoId || !senha) {
    return res.status(400).json({ message: 'testamentoId e senha são obrigatórios' });
  }

  const testamento = testamentoModel.findById(testamentoId.toString().padStart(3, '0'));

  if (!testamento) {
    return res.status(404).json({ valid: false, message: 'Testamento não encontrado.' });
  }

  const valid = testamento.senha === senha.toString();

  return res.json({
    valid,
    completed: testamento.completed,
    linhagem: testamento.linhagem,
    message: valid ? 'Senha correta' : 'Senha incorreta',
  });
}

module.exports = { validate, check };
