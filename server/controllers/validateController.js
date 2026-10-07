const testamentoModel = require('../models/testamentoModel');
const userModel = require('../models/userModel');

// POST /api/validate
// Body: { userId, senha }
async function validate(req, res) {
  const { userId, senha } = req.body;

  if (!userId || !senha) {
    return res.status(400).json({ valid: false, message: 'userId e senha são obrigatórios' });
  }

  try {
    const user = await userModel.find(userId);
    if (!user) {
      return res.status(404).json({ valid: false, message: 'Usuário não encontrado.' });
    }

    const testamento = await testamentoModel.getByUser(userId);
    if (!testamento) {
      return res.status(404).json({ valid: false, message: 'Testamento não encontrado para este usuário.' });
    }

    if (testamento.completed) {
      return res.status(409).json({ valid: false, message: 'Esta herança já foi reivindicada.' });
    }

    if (testamento.senha !== senha.trim()) {
      return res.status(200).json({ valid: false, message: 'Senha incorreta. Os mortos não se convencem tão facilmente...' });
    }

    await testamentoModel.complete(testamento.id, Number(userId));

    return res.json({ valid: true, message: 'A herança é sua.', nome: user.nome });
  } catch {
    return res.status(500).json({ valid: false, message: 'Não foi possível validar. Tente novamente.' });
  }
}

module.exports = { validate };
