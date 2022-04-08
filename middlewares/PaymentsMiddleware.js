const {body, param} = require('express-validator');
const Validator = require('../utils/Validator');
const dateHelper = require('../utils/DateHelper');
const moment = require('moment');

module.exports = class PaymentsMiddleware extends Validator {

    static globalValidationRules = [
        body('user_id').optional().toInt().isInt({min: 0}).withMessage("group_id debe de ser un número"),
        body('concept').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('quantity').optional().toFloat().isFloat({min: 1}).withMessage("Discount debe ser número, y mayor que 1"),
        body('payment_date').optional().custom((value, {req}) => {

            const date = moment(value);
            if(!date.isValid()) return false;
            return date.isBefore( dateHelper.getSundayLastTime() );

        }).withMessage("payment_date debe de ser una fecha, y no debe de pasar de esta semana"),
    ];

    static create() {
        return [
            [
                body('payment_date').exists().withMessage("payment_date es requerido")
            ],
            this.validationHandler,
            function(req, res, next) {
                req.body.payment_date = moment(req.body.payment_date).startOf('day').format();
                next();
            }
        ];
    }

    static patch() {
        return [
            [
                body('concept').exists().withMessage("concept es requerido"),
                body('quantity').exists().withMessage("quantity es requerido")
            ],
            this.validationHandler
        ];
    }

}