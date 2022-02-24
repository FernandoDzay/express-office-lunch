const {User} = require('../configs/sequelize/models');

module.exports = {

    async get(req, res, next) {
        // User.findAll({where: })
    },

    async getUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if(user === null) return res.status(404).json({error: "no se encontró ningún usuario"});
        return res.status(200).json({data: user.toJSON()});
    },

    async delete(req, res, next) {
        const id = req.params.id;
        await User.destroy({where: {id}})
        .then(count => count ? 
            res.status(200).json({message: "Usuario borrado"}) :
            res.status(404).json({massage: "No se encontró ningún usuario"}))
        .catch(e => next("Ocurrio un error al borrar el usuario"));
        return;
    }



}