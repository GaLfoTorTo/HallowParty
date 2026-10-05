const router = require('express').Router();
const ctrl = require('../controllers/testamentosController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', ctrl.create);
router.post('/batch/generate', ctrl.generateBatch);
router.delete('/batch/all', ctrl.clearAll);
router.delete('/:id', ctrl.remove);

module.exports = router;
