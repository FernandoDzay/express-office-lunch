const express = require('express');
const router = express.Router();
const ExtrasController = require('../controllers/ExtrasController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ExtrasMiddleware = require('../middlewares/ExtrasMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(ExtrasMiddleware.globalBodyValidations());


// ------------ Routes
router.get('/', ExtrasController.get);

router.get('/:id', ExtrasMiddleware.requiredParamId(), ExtrasController.getExtra);

router.post(
    '/create',
    AuthMiddleware.adminUserOnly,
    ExtrasMiddleware.create(),
    ExtrasController.create
);

router.put(
    '/update',
    AuthMiddleware.adminUserOnly,
    ExtrasMiddleware.requiredBodyId(),
    ExtrasMiddleware.update(),
    ExtrasController.update
);

router.delete('/delete/:id', AuthMiddleware.adminUserOnly, ExtrasMiddleware.requiredParamId(), ExtrasController.delete);


module.exports = router;