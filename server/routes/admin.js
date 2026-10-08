const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const prisma = require('../db/prisma');

router.get('/stats', ctrl.stats);

router.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, provider: 'postgresql' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
