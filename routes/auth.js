const { Router } = require('express');

const router = Router();

const authController = require('../controllers/auth');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/token-refresh', authController.refreshToken);

module.exports = router;
