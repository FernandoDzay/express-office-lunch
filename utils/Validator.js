const {validationResult} = require('express-validator');
const {body, param} = require('express-validator');
const moment = require('moment');

module.exports = class Validator {

    static globalValidations() {
        return this.globalValidationRules;
    }

    static validationHandler = (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty())  return next();
        
        const extractedErrors = {};
        errors.array().forEach(err => extractedErrors[err.param] = err.msg);
        res.status(400).json({validation: extractedErrors});
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

    static validateQueryDate = (req, res, next) => {
        if(!req.query.date) return next();
        try {
            const date = moment(req.query.date, 'YYYY-MM-DD', true);
            if(date.isValid()) return next();
            throw new Error();
        }
        catch(e) { return res.status(400).json({validation: {date: 'La fecha insertada es inválida'}}) }
    }
}