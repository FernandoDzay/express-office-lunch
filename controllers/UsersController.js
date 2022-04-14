const { use } = require('bcrypt/promises');
const {User} = require('../configs/sequelize/models');

module.exports = {

    async get(req, res, next) {
        const users = await User.findAll();
        if(users.length === 0) return res.status(404).json({message: 'No se encontró ningún usuario'});

        const usersResponse = req.body.logged_user.is_admin ? 
        users.map(user => ({id: user.id, username: user.username, is_admin: user.is_admin, status: user.status})) :
        users.map(user => ({id: user.id, username: user.username, status: user.status}));

        return res.json(usersResponse);
    },

    async getUser(req, res) {
        const user = await User.findByPk(req.params.id);
        if(user === null) return res.status(404).json({error: "no se encontró ningún usuario"});
        return res.json(user);
    },

    async update(req, res, next) {
        const {id, email, username, birth_month, birth_day, is_guest, is_admin, status} = req.body;
        const user = await User.findByPk(id);
        if(user === null) return res.status(404).json({error: "no se encontró ningún usuario"})
        
        user.email = email;
        user.username = username;
        user.birth_month = birth_month;
        user.birth_day = birth_day;
        user.is_guest = is_guest;
        user.is_admin = is_admin;
        user.status = status;

        if(req.body.password) {
            user.password = req.body.password;
            await user.customSave();
        }
        else await user.save();

        return res.json({message: 'El usuario ha sido actualizado exitosamente'});
    },

    async updateLoggedUserImage(req, res, next) {
        const user = await User.findByPk(req.body.logged_user.id);
        if(user === null) return res.status(404).json({error: "no se encontró ningún usuario"})
        user.image = req.file.filename;

        await user.save()
        .then(r => res.json({message: 'La imagen del usuario ha sido actualizada con éxito'}))
        .catch(e => next(e));
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