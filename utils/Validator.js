const {validationResult} = require('express-validator');
const {body, param} = require('express-validator');

module.exports = class Validator {

    static globalValidations() {
        return this.globalValidationRules;
    }

    static validationHandler = (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
        return next();
        }
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
        res.status(400).json(extractedErrors);
    }

    static globalBodyValidations() {
        return [
            this.globalValidations(),
            this.validationHandler
        ];
    }

    static requiredParamId() {
        return [
            param('id').notEmpty().withMessage("No existe id").isInt().withMessage("id debe de ser número"),
            this.validationHandler
        ];
    }

    static requiredBodyId() {
        return [
            body('id').notEmpty().withMessage("No existe id").isInt().withMessage("id debe de ser número"),
            this.validationHandler
        ];
    }
}