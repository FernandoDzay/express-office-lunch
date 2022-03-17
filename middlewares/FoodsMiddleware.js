const {body, param} = require('express-validator');
const Validator = require('../utils/Validator');
const FileHandler = require('../utils/FileHandler');

module.exports = class FoodsMiddleware extends Validator {

    static globalValidationRules = [
        body('full_name').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('short_name').optional().escape().isLength({min: 4, max: 30}).withMessage("Cadena debe de tener longitud entre 4 y 30"),
        body('price').optional().isInt({min: 0}).withMessage("Price debe ser número")
    ];

    static uploadErrorHandlder(error, req, res, next) {
        if(error === "image_extension") return res.status(400).json({error: 'No se permite esa extension de archivo'});
        else return next();
    }

    static uploadImage() {
        const destination = 'public/img/foods/';
        const extAllowed = /jpeg|jpg|png|gif/;
        const identifier = 'image';
        const fileHandler = new FileHandler(destination, extAllowed, identifier);
        return fileHandler.single();
    }

    static create() {
        return [
            [
                body('full_name').exists().withMessage("full_name es requerido"),
            ],
            this.validationHandler
        ];
    }
}