const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');
const OrdersMiddleware = require('../middlewares/OrdersMiddleware');
const SettingsMiddleware = require('../middlewares/SettingsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(OrdersMiddleware.globalBodyValidations());


// ------------ Routes
router.get('/get', OrdersController.get);

router.get('/get-todays-orders', OrdersController.getTodaysOrders);

router.post('/create', SettingsMiddleware.verifyIfMenuIsOpen, OrdersMiddleware.validateUserId(), OrdersMiddleware.checkForOneFoodOrExtra(), OrdersController.create);

router.delete('/delete/:id', OrdersMiddleware.requiredParamId(), OrdersController.delete);

router.delete('/delete-user-order', SettingsMiddleware.verifyIfMenuIsOpen, OrdersMiddleware.validateUserId(), OrdersMiddleware.checkForOneFoodOrExtra(), OrdersController.deleteUserOrder);

module.exports = router;