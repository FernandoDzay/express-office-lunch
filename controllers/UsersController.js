const { response } = require('express');
const {User} = require('../configs/sequelize/models');

module.exports = {

    async getUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if(user === null) return res.status(404).json({error: "no se encontró ningún usuario"});
        return res.status(200).json({data: user.toJSON()});
    },

    async create(req, res, next) {
        const data = req.body;
        const user = User.build(data);
        try { await user.customSave(); } 
        catch(e) { return next("No se pudo guardar el usuario"); }
        return res.status(201).json(user);
    }

    

}