const express = require('express');
const router = express.Router();
const NotificationsController = require('../controllers/NotificationsController');
const NotificationsMiddleware = require('../middlewares/NotificationsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(NotificationsMiddleware.globalBodyValidations());


// ---------- Routes
router.get('/get', NotificationsController.get);

router.post('/send', AuthMiddleware.adminUserOnly, NotificationsMiddleware.send(), NotificationsController.send);

router.patch('/mark-read/:id', NotificationsMiddleware.requiredParamId(), NotificationsController.markRead);


module.exports = router;