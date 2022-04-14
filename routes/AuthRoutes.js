const express = require('express');
const router = express.Router();
const UsersMiddleware = require('../middlewares/UsersMiddleware');
const AuthController = require('../controllers/AuthController');


// ------------ Middlewares
router.use(UsersMiddleware.globalBodyValidations());


// ------------ Routes
router.post('/register', UsersMiddleware.createUserRules(), AuthController.register);
router.post('/login', AuthController.login);


module.exports = router;