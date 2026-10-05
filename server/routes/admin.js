const router = require('express').Router();
const ctrl = require('../controllers/adminController');

router.get('/stats', ctrl.stats);

module.exports = router;
