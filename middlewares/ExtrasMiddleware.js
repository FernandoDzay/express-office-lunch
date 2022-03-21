const {body} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class ExtrasMiddleware extends Validator {

    static globalValidationRules = [
        body('name').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('price').optional().toFloat().isFloat({min: 0}).withMessage("Price debe ser número, y mayor que 0")
    ];

    static create() {
        return [
            [
                body('name').exists().withMessage("full_name es requerido"),
                body('price').exists().withMessage("price es requerido"),
            ],
            this.validationHandler
        ];
    }

    static update() {
        return [
            [
                body('name').exists().withMessage("full_name es requerido"),
                body('price').exists().withMessage("price es requerido"),
            ],
            this.validationHandler
        ];
    }
}