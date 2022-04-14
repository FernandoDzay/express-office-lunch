const jwt = require('jsonwebtoken');
const {User} = require('../configs/sequelize/models');

module.exports = {

    async register(req, res, next) {
        const authError = "No se pudo guardar el usuario";
        const data = req.body;
        let user;

        try { user = await User.findOne({where: {email: data.email}}); }
        catch(e) { return next(authError); }
        if(user !== null) return res.status(400).json({error: "Ya existe ese Email"});

        user = User.build(data);
        try { await user.customSave(); }
        catch(e) { return next(authError); }
        return res.status(201).json({message: 'Usuario creado'});
    },

    async login(req, res, next) {
        const authError = "Ocurrió un error al loguear";
        const authIncorrect = "Email o contraseña incorrecta";
        const {email, password} = req.body;
        let user;
        let match;

        try { user = await User.findOne({where: {email}}); }
        catch(e) { return next(authError); }
        if(user === null) return res.status(400).json({error: authIncorrect});
        try { match = await user.auth(password); }
        catch(e) { return next(authError); }
        
        if(!match) return res.status(400).json({error: authIncorrect});
        jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'}, function(err, token) {
            if(err) next(authError);
            res.status(200).json({token});
        });
        return;
    },
    
}