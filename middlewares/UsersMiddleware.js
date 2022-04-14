const {body, param} = require('express-validator');
const Validator = require('../utils/Validator');
const FileHandler = require('../utils/FileHandler');

module.exports = class UsersMiddleware extends Validator {

    static globalValidationRules = [
        body('email').optional().escape().trim().isEmail().withMessage("Cadena debe ser Email"),
        body('username').optional().escape().trim().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('password').optional().escape().trim().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('birth_month').optional().isInt({min: 1, max: 12}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('birth_day').optional().isInt({min: 1, max: 31}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('is_guest').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('is_admin').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
        body('status').optional().isInt({min: 0, max: 1}).withMessage("Debe de ser entero con valor 0 o 1"),
    ];

    static createUserRules() {
        return [
            [
                body('email').exists().withMessage("Email es requerido"),
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

    static update() {
        return [
            [
                body('email').exists().withMessage("Email es requerido"),
                body('username').exists().withMessage("Username es requerido"),
                body('birth_month').exists().withMessage("birth_month es requerido"),
                body('birth_day').exists().withMessage("birth_day es requerido"),
                body('is_guest').exists().withMessage("is_guest es requerido"),
                body('is_admin').exists().withMessage("is_admin es requerido"),
                body('status').exists().withMessage("status es requerido"),
            ],
            this.validationHandler
        ];
    }

    static uploadErrorHandlder(error, req, res, next) {
        if(error === "image_extension") return res.status(400).json({error: 'No se permite esa extension de archivo'});
        else return next();
    }

    static uploadImage() {
        const destination = 'public/img/users/';
        const extAllowed = /jpeg|jpg|png/;
        const identifier = 'image';
        const fileHandler = new FileHandler(destination, extAllowed, identifier);
        return fileHandler.single('user');
    }
    
}