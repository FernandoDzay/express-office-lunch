const express = require('express');
const router = express.Router();
const CronsController = require('../controllers/CronsController');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(AuthMiddleware.adminUserOnly);


// ---------- Routes
router.post('/check-for-birthdays', CronsController.checkForBirhdays);

router.delete('/daily-remove', CronsController.dailyRemove);


module.exports = router;