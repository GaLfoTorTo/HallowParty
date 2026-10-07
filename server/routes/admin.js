const router = require('express').Router();
const ctrl = require('../controllers/adminController');

router.get('/stats', ctrl.stats);
router.post('/reset', ctrl.resetDb);

module.exports = router;
