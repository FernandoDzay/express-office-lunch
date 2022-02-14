const {body, param} = require('express-validator');
const Validator = require('../utils/Validator');

module.exports = class UsersMiddleware extends Validator {

    static globalValidationRules = [
        body('test').isString(),
        body('test2').exists(),
    ];
}