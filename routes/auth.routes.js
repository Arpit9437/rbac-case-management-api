const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/init-superadmin', authController.createSuperAdmin);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);

module.exports = router;