const express = require('express');
const router = express.Router();
const FoodsController = require('../controllers/FoodsController');
const FoodsMiddleware = require('../middlewares/FoodsMiddleware');


// ------------ Routes
router.get(
    '/',
    FoodsController.get
);

router.get(
    '/:id',
    FoodsMiddleware.requiredParamId(),
    FoodsController.getFoods
);

router.post(
    '/create',
    FoodsMiddleware.uploadImage(),
    FoodsMiddleware.uploadErrorHandlder,
    FoodsMiddleware.globalBodyValidations(),
    FoodsMiddleware.create(),
    FoodsController.create
);

router.put(
    '/update',
    FoodsMiddleware.uploadImage(),
    FoodsMiddleware.uploadErrorHandlder,
    FoodsMiddleware.globalBodyValidations(),
    FoodsMiddleware.requiredBodyId(),
    FoodsMiddleware.update(),
    FoodsController.update
);

router.delete(
    '/delete/:id',
    FoodsMiddleware.requiredParamId(),
    FoodsController.delete
);

module.exports = router;