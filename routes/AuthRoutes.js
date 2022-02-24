const express = require('express');
const router = express.Router();
const UsersMiddleware = require('../middlewares/UsersMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const AuthController = require('../controllers/AuthController');

router.use(UsersMiddleware.globalBodyValidations());

router.post('/register', UsersMiddleware.createUserRules(), AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;