const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { authenticate, requireAdmin, requireAdminOnly } = require('../middleware/auth');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);
router.patch('/me', authenticate, ctrl.updateMe);
router.get('/', authenticate, requireAdmin, ctrl.list);
router.patch('/:id/role', authenticate, requireAdminOnly, ctrl.changeRole);

module.exports = router;