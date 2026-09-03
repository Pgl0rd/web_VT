const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', ctrl.create);
router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.get);
router.patch('/:id/status', authenticate, requireAdmin, ctrl.updateStatus);

module.exports = router;