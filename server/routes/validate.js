const router = require('express').Router();
const ctrl = require('../controllers/validateController');

router.post('/', ctrl.validate);
router.post('/check', ctrl.check);

module.exports = router;
