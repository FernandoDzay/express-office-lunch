const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const UsersMiddleware = require('../middlewares/UsersMiddleware');

// --------- Middleware
router.use(UsersMiddleware.globalBodyValidations());

// --------- Routes
router.get('/:id', UsersMiddleware.requiredParamId(), UsersController.getUser);
router.post('/create', UsersMiddleware.createUserRules(), UsersController.create);

module.exports = router;