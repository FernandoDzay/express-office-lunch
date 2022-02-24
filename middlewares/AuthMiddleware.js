const Validator = require('../utils/Validator');
const jwt = require('jsonwebtoken');

const {User} = require('../configs/sequelize/models');

module.exports = class AuthMiddleware extends Validator {
    
    static async verify(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        if(token == null) return res.status(401);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err) return res.sendStatus(401);
            if(!decoded.id) next("Ocurrió un error en la autorización");
            else {
                req.body.account_id = decoded.id;
                next();
            }
        });
        return;
    }

}