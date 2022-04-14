const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const MenuMiddleware = require('../middlewares/MenuMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(MenuMiddleware.globalBodyValidations());


// ------------ Routes
router.get('/get', MenuController.get);

router.post('/add-food/:id', AuthMiddleware.adminUserOnly, MenuMiddleware.requiredParamId(), MenuController.addFood);

router.delete('/remove-food/:id', AuthMiddleware.adminUserOnly, MenuMiddleware.requiredParamId(), MenuController.removeFood);


module.exports = router;