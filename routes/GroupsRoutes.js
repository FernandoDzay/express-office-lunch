const express = require('express');
const router = express.Router();
const GroupsController = require('../controllers/GroupsController');
const GroupsMiddleware = require('../middlewares/GroupsMiddleware');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


// ------------ Middlewares
router.use(AuthMiddleware.verify);
router.use(GroupsMiddleware.globalBodyValidations());


// ---------- Routes
router.get('/get', GroupsController.get);

router.post('/set', AuthMiddleware.adminUserOnly, GroupsMiddleware.requireUserId(), GroupsMiddleware.requireGroupId(), GroupsController.set);

router.delete('/delete/:id', AuthMiddleware.adminUserOnly, GroupsMiddleware.requiredParamId(), GroupsController.delete);


module.exports = router;