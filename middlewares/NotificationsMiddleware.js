const {body} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class NotificationsMiddleware extends Validator {

    static globalValidationRules = [
        body('title').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('description').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('created_by').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('notification_id').optional().toInt().isInt({min: 0}).withMessage("notification_id debe de ser un número"),
        body('user_id').optional().toInt().isInt({min: 0}).withMessage("user_id debe de ser un número"),
        body('type').optional().if((value, {req}) => (value === 'normal' || value === 'warning' || value === 'danger')),
        body('has_been_read').optional().toInt().isInt({min: 0, max: 1}).withMessage("has_been_read debe de ser un número entre 0 y 1"),
        body('send_to').optional().isArray().withMessage("send_to debe de ser un arreglo")
    ];

    static send() {
        return [
            [
                body('title').exists().withMessage("title es requerido"),
                body('description').exists().withMessage("title es requerido")
            ],
            this.validationHandler
        ];
    }
    
}