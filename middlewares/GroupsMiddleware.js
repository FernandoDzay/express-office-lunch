const {body} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class GroupsMiddleware extends Validator {

    static globalValidationRules = [
        body('user_id').optional().toInt().isInt({min: 0}).withMessage("user_id debe de ser un número"),
        body('group_id').optional().toInt().isInt({min: 0}).withMessage("group_id debe de ser un número"),
        body('status').optional().toInt().isInt({min: 0, max: 1}).withMessage("status debe de ser un número entre 0 y 1")
    ];

    static requireUserId() {
        return [
            [
                body('user_id').exists().withMessage("user_id es requerido")
            ],
            this.validationHandler
        ];
    }

    static requireGroupId() {
        return [
            [
                body('group_id').exists().withMessage("group_id es requerido")
            ],
            this.validationHandler
        ];
    }

    static requireStatus() {
        return [
            [
                body('group_id').exists().withMessage("group_id es requerido")
            ],
            this.validationHandler
        ];
    }
}