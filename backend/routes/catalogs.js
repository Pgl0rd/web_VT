const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/catalogController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.put('/:language', authenticate, requireAdmin, ctrl.upsert);
router.delete('/:id', authenticate, requireAdmin, ctrl.remove);

module.exports = router;
