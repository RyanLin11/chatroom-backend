const UserController = require('../controllers/UserController');
const { loginSchema } = require('../validation/auth');
const validator = require('../validation/validator');
const { isAuthenticated } = require('../utils/auth');
const express = require('express');
const router = express.Router();

router.post('/login', validator(loginSchema), UserController.login);

router.get('/logout', isAuthenticated, UserController.logout);

module.exports = router;