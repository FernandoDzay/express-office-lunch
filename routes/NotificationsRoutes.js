const express = require('express');
const router = express.Router();
const NotificationsController = require('../controllers/NotificationsController');
const NotificationsMiddleware = require('../middlewares/NotificationsMiddleware');


router.use(NotificationsMiddleware.globalBodyValidations());

// ---------- Routes

router.get('/get/:id', NotificationsMiddleware.requiredParamId(), NotificationsController.get);

router.post('/send', NotificationsMiddleware.send(), NotificationsController.send);

router.patch('/mark-read/:id', NotificationsMiddleware.requiredParamId(), NotificationsController.markRead);


module.exports = router;