const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/UsersController');
const UsersMiddleware = require('../middlewares/UsersMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(UsersMiddleware.globalBodyValidations());


// --------- Routes
router.get('/', AuthMiddleware.verify, UsersController.get);

router.get('/logged', AuthMiddleware.verify, UsersController.getLoggedUser);

router.get('/:id', AuthMiddleware.verify, AuthMiddleware.adminUserOnly, UsersMiddleware.requiredParamId(), UsersController.getUser);

router.put('/update', AuthMiddleware.verify, AuthMiddleware.adminUserOnly, UsersMiddleware.requiredBodyId(), /* UsersMiddleware.update(), */ UsersController.update);

router.patch('/update-logged-user-image', UsersMiddleware.uploadImage(), UsersMiddleware.uploadErrorHandlder, AuthMiddleware.verify, UsersController.updateLoggedUserImage);

router.delete('/delete/:id', AuthMiddleware.verify, AuthMiddleware.adminUserOnly, UsersMiddleware.requiredParamId(), UsersController.delete);


module.exports = router;