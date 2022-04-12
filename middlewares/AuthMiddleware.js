const Validator = require('../utils/Validator');
const jwt = require('jsonwebtoken');

const {User} = require('../configs/sequelize/models');

module.exports = class AuthMiddleware extends Validator {
    
    static async verify(req, res, next) {
        const codes = {withoutToken: 0, invalidToken: 1, expiredToken: 2, userNotFound: 3, inActiveUser: 4};
        const authHeader = req.headers['authorization'];
        if(authHeader === undefined) return res.status(401).json({loginError: codes.withoutToken});

        const token = authHeader.split(' ')[1];
        if(token == null) return res.status(401).json({loginError: codes.withoutToken});

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if(err) return res.status(401).json({loginError: err.name === 'TokenExpiredError' ? codes.expiredToken : codes.invalidToken});
            if(!decoded.id) next("Ocurrió un error en la autorización");
            else {
                const user = await User.findByPk(decoded.id);
                if(user === null) return res.status(401).json({loginError: codes.userNotFound});

                const {id, email, username, birth_month, birth_day, is_guest, is_admin, status} = user;
                if(!status) return res.status(401).json({loginError: codes.inActiveUser});

                req.body.logged_user = {id, email, username, birth_month, birth_day, is_guest, is_admin};
                next();
            }
        });
    }

}