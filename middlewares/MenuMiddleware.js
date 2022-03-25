const {body} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class MenuMiddleware extends Validator {

    static globalValidationRules = [
        body('food_id').optional().toInt().isInt({min: 0}).withMessage("food_id debe de ser un número")
    ];

    static requireFoodId() {
        return [
            [
                body('food_id').exists().withMessage("food_id es requerido")
            ],
            this.validationHandler
        ];
    }
}