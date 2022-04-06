const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const {Setting} = require('../configs/sequelize/models');
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

    static async verifyIfMenuIsOpen(req, res, next) {
        const setting = await Setting.findOne({where: {setting: 'menu_activated'}});
        if(setting === null) return res.status(500).json({error: 'Debe de existir la configuracion menu_activated'});
        if(setting.int_value !== 0 && setting.int_value !== 1) return res.status(500).json({error: 'menu_activated Debe de estar entre 0 y 1'});

        if(setting.int_value === 1) return next();
        return res.json({error: 'El menú está cerrado', display: 'El menú está cerrado'})
    }
    
}