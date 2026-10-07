const router = require('express').Router();
const ctrl = require('../controllers/missionsController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/:id/complete', ctrl.completeMission);

module.exports = router;
