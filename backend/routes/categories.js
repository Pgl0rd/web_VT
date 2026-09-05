const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', ctrl.list);
router.post('/', authenticate, requireAdmin, ctrl.create);
router.patch('/reorder', authenticate, requireAdmin, ctrl.reorder);
router.patch('/by-name/:name', authenticate, requireAdmin, ctrl.updateByName);
router.patch('/by-name/:name/products', authenticate, requireAdmin, ctrl.assignProducts);
router.delete('/:id', authenticate, requireAdmin, ctrl.remove);

module.exports = router;
