const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const UsersMiddleware = require('../middlewares/UsersMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(UsersMiddleware.globalBodyValidations());


// --------- Routes
router.get('/:id', UsersMiddleware.requiredParamId(), UsersController.getUser);

router.delete('/delete/:id', UsersMiddleware.requiredParamId(), UsersController.delete);

module.exports = router;