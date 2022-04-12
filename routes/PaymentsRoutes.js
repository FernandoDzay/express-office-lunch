const express = require('express');
const router = express.Router();
const PaymentsController = require('../controllers/PaymentsController');
const PaymentsMiddleware = require('../middlewares/PaymentsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(PaymentsMiddleware.globalBodyValidations());


// ------------ Routes
router.get('/get', PaymentsController.get);

router.get('/get-user-payments', PaymentsController.getUserPayments);

router.post('/create', PaymentsMiddleware.create(), PaymentsController.create);

router.patch('/update', PaymentsMiddleware.requiredBodyId(), PaymentsMiddleware.patch(), PaymentsController.patch);

router.delete('/delete/:id', PaymentsMiddleware.requiredParamId(), PaymentsController.delete);

module.exports = router;