const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const equipmentCtrl = require('../controller/equipmentController');

router.get('/', auth, equipmentCtrl.list);
router.post('/', auth, requireRole('supervisor', 'manager'), equipmentCtrl.create);
router.put('/:id', auth, requireRole('supervisor', 'manager'), equipmentCtrl.update);
router.delete('/:id', auth, requireRole('manager'), equipmentCtrl.remove);

module.exports = router;


