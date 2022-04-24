const express = require('express');
const router = express.Router();
const FoodsController = require('../controllers/FoodsController');
const FoodsMiddleware = require('../middlewares/FoodsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);


// ------------ Routes
router.get(
    '/',
    AuthMiddleware.adminUserOnly,
    FoodsController.get
);

router.get(
    '/:id',
    FoodsMiddleware.requiredParamId(),
    FoodsController.getFoods
);

router.post(
    '/create',
    AuthMiddleware.adminUserOnly,
    FoodsMiddleware.uploadImage(),
    FoodsMiddleware.uploadErrorHandlder,
    FoodsMiddleware.globalBodyValidations(),
    FoodsMiddleware.create(),
    FoodsController.create
);

router.put(
    '/update',
    AuthMiddleware.adminUserOnly,
    FoodsMiddleware.uploadImage(),
    FoodsMiddleware.uploadErrorHandlder,
    FoodsMiddleware.globalBodyValidations(),
    FoodsMiddleware.requiredBodyId(),
    FoodsMiddleware.update(),
    FoodsController.update
);

router.delete(
    '/delete/:id',
    AuthMiddleware.adminUserOnly,
    FoodsMiddleware.requiredParamId(),
    FoodsController.delete
);


module.exports = router;