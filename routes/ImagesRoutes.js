const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middlewares/AuthMiddleware');
const ImagesController = require('../controllers/ImagesController');


// ------------ Routes
router.get('/users/:filename', ImagesController.users, ImagesController.handleNotFound);
router.get('/foods/:filename', ImagesController.foods, ImagesController.handleNotFound);


module.exports = router;