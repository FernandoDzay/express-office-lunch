const express = require('express');
const router = express.Router();
const OrdersController = require('../controllers/OrdersController');
const OrdersMiddleware = require('../middlewares/OrdersMiddleware');
const SettingsMiddleware = require('../middlewares/SettingsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(OrdersMiddleware.globalBodyValidations());
router.use(OrdersMiddleware.validateQueryDate);


// ------------ Routes
router.get('/get', OrdersController.get);

router.get('/get-todays-orders', OrdersController.getTodaysOrders);

router.get('/get-todays-orders/:user_id', OrdersController.getTodaysOrders);

router.get('/make', OrdersController.make);

router.post('/create', AuthMiddleware.adminUserOnly, SettingsMiddleware.verifyIfMenuIsOpen, OrdersMiddleware.validateUserId(), OrdersMiddleware.checkForOneFoodOrExtra(), OrdersController.createUserOrder);

router.post('/create-user-order', SettingsMiddleware.verifyIfMenuIsOpen, OrdersMiddleware.checkForOneFoodOrExtra(), OrdersController.createUserOrder);

router.delete('/delete/:id', AuthMiddleware.adminUserOnly, OrdersMiddleware.requiredParamId(), OrdersController.delete);

router.delete('/delete-user-order', SettingsMiddleware.verifyIfMenuIsOpen, OrdersMiddleware.checkForOneFoodOrExtra(), OrdersController.deleteUserOrder);


module.exports = router;