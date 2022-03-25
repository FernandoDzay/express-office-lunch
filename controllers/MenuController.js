const {Menu, Food} = require('../configs/sequelize/models');

module.exports = {

    async get(req, res, next) {
        const menu = await Menu.findAll({
            attributes: ['id'],
            include: [{model: Food, as: 'food'}],
        });

        if(menu === null) return res.status(404).json({status: 0});
        return res.json({status: 1, menu});
    },

    async addFood(req, res, next) {
        const food_id = req.params.id;
        const validation = await Menu.findOne({where: {food_id}});
        if(validation !== null) return res.status(400).json({error: 'Esa comida ya ha sido agregada al menú'});

        const menu = new Menu({food_id});

        await menu.save()
        .then(r => res.status(201).json({message: 'Comida agregada al menú'}))
        .catch(e => next(e));
    },

    async removeFood(req, res) {
        const menu = await Menu.findByPk(req.params.id);
        if(menu === null) return res.status(404).json({error: 'Comida no encontrada en el menú'});
        await menu.destroy();
        return res.json({message: 'La comida ha sido quitada del menú con éxito'});
    }

}