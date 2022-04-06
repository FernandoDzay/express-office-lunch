const {body, param} = require('express-validator');
const Validator = require('../utils/Validator');
const {validationResult} = require('express-validator');
const {Setting} = require('../configs/sequelize/models');
const moment = require('moment');

module.exports = class OrdersMiddleware extends Validator {

    static globalValidationRules = [
        body('food_id').optional().toInt().isInt({min: 0}).withMessage("group_id debe de ser un número"),
        body('extra_id').optional().toInt().isInt({min: 0}).withMessage("group_id debe de ser un número"),
        body('name').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('price').optional().toFloat().isFloat({min: 0}).withMessage("Price debe ser número, y mayor que 0"),
        body('discount').optional().toFloat().isFloat({min: 0}).withMessage("Discount debe ser número, y mayor que 0"),
        body('date').optional().custom((date, {req}) => moment(date).isValid()).withMessage("Date debe de ser una fecha"),
    ];

    static checkForOneFoodOrExtra() {
        return [
            [
                body('food_id').exists(),
                body('extra_id').exists()
            ],
            function(req, res, next) {
                const errors = validationResult(req)
                
                if(errors.array().length > 1) return res.status(400).json({error: 'Debe de existir una comida, o un extra'});
                if(errors.array().length === 0) return res.status(400).json({error: 'No pueden existir una comida y un extra al mismo tiempo'});
                return next();
            }
        ];
    }

    static validateUserId() {
        return [
            [
                body('user_id').exists().withMessage('user_id es requerido')
            ],
            this.validationHandler
        ];
    }

    static validateDate() {
        return [
            [
                body('date').withMessage('date debe de ser una fecha')
            ],
            this.validationHandler
        ];
    }

}