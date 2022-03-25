const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/MenuController');
const MenuMiddleware = require('../middlewares/MenuMiddleware');


router.use(MenuMiddleware.globalBodyValidations());

// ---------- Routes

router.get('/get', MenuController.get);

router.post('/add-food/:id', MenuMiddleware.requiredParamId(), MenuController.addFood);

router.delete('/remove-food/:id', MenuMiddleware.requiredParamId(), MenuController.removeFood);


module.exports = router;