const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/SettingsController');
const SettingsMiddleware = require('../middlewares/SettingsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(AuthMiddleware.adminUserOnly);
router.use(SettingsMiddleware.globalBodyValidations());


// ---------- Routes
router.get('/get', SettingsController.get);

router.post('/create', SettingsMiddleware.createOrUpdate(), SettingsController.create);

router.put('/update', SettingsMiddleware.requiredBodyId(), SettingsMiddleware.createOrUpdate(), SettingsController.update);

router.delete('/delete/:id', SettingsMiddleware.requiredParamId(), SettingsController.delete);


module.exports = router;