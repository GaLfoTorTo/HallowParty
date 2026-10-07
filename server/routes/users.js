const router = require('express').Router();
const ctrl = require('../controllers/usersController');

router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.delete('/:id', ctrl.remove);

module.exports = router;
