const {body, param} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class UsersMiddleware extends Validator {

    static globalValidationRules = [
        body('username').optional().escape().trim().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('password').optional().escape().trim().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('image').optional().trim().isLength({min: 4, max: 200}).withMessage("Cadena debe de tener longitud entre 4 y 200"),
        body('birth_month').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('birth_day').optional().isInt().withMessage("Debe de ser entero con valor 0 o 1"),
        body('is_guest').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('is_admin').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('status').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
    ];

    static createUserRules() {
        return [
            [
                body('username').exists().withMessage("Username es requerido"),
                body('password').exists().withMessage("Password es requerido"),
                body('birth_month').exists().withMessage("birth_month es requerido"),
                body('birth_day').exists().withMessage("birth_day es requerido")
            ],
            this.validationHandler,
            (req, res, next) => {
                const {image, is_guest, is_admin, status} = req.body;
                if(image !== undefined || is_guest !== undefined || is_admin !== undefined || status !== undefined) {
                    return res.status(400).json({error: "No puedes guardar estos parámetros"});
                }
                return next();
            }
        ];
    }
}