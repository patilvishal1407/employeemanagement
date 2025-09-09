const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/roles');
const ctrl = require('../controller/workOrderController');

router.get('/', auth, ctrl.list);
router.post('/', auth, requireRole('supervisor', 'manager'), ctrl.create);
router.put('/:id', auth, requireRole('technician', 'supervisor', 'manager'), ctrl.update);
router.delete('/:id', auth, requireRole('manager'), ctrl.remove);

module.exports = router;


