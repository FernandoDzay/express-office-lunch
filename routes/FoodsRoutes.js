const express = require('express');
const router = express.Router();
const FoodsController = require('../controllers/FoodsController');
const FoodsMiddleware = require('../middlewares/FoodsMiddleware');



// ------------ Middleware
// router.use(FoodsMiddleware.globalBodyValidations());

// ------------ Routes
router.post('/create', FoodsMiddleware.uploadImage(), FoodsMiddleware.uploadErrorHandlder, FoodsMiddleware.globalBodyValidations(), FoodsController.create);

module.exports = router;