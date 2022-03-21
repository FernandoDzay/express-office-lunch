const express = require('express');
const router = express.Router();
const ExtrasController = require('../controllers/ExtrasController');
const ExtrasMiddleware = require('../middlewares/ExtrasMiddleware');


// ------------ Routes
router.get('/:id', ExtrasMiddleware.requiredParamId(), ExtrasController.get);

router.post('/create',
    ExtrasMiddleware.globalBodyValidations(),
    ExtrasMiddleware.create(),
    ExtrasController.create
);

router.put(
    '/update',
    ExtrasMiddleware.globalBodyValidations(),
    ExtrasMiddleware.requiredBodyId(),
    ExtrasMiddleware.update(),
    ExtrasController.update
);

router.delete('/delete/:id', ExtrasMiddleware.requiredParamId(), ExtrasController.delete);

module.exports = router;