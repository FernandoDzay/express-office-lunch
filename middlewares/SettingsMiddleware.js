const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class SettingsMiddleware extends Validator {

    static globalValidationRules = [
        body('setting').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('int_value').optional().toInt().isInt({min: 0}).withMessage("group_id debe de ser un número"),
        body('string_value').optional().escape().isLength({min: 2}).withMessage("Cadena debe de tener una longitud más de 2"),
    ];

    static createOrUpdate() {
        return [
            [
                body('setting').exists().withMessage("setting es requerido"),
                body('int_value').exists(),
                body('string_value').exists()
            ],
            function(req, res, next) {
                const errors = validationResult(req)
                
                if(errors.array().length > 1) return res.status(400).json({error: 'Debe de haber al menos un setting value'});
                return next();
            }
        ];
    }
}