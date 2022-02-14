const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const UsersMiddleware = require('../middlewares/UsersMiddleware');

// --------- Middleware
router.use(UsersMiddleware.globalBodyValidations());

// --------- Routes
router.post('/:id', UsersMiddleware.requiredParamId(), UsersController.getUser);

module.exports = router;