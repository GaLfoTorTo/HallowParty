const router = require('express').Router();
const ctrl = require('../controllers/validateController');

router.post('/', ctrl.validate);

module.exports = router;
