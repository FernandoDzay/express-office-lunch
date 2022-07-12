const {Menu, Food, Order, Setting} = require('../configs/sequelize/models');
const dateHelper = require('../utils/DateHelper');
const { Op } = require("sequelize");

module.exports = {

    async get(req, res, next) {
        // status 0: Menú vacío
        // status 1: Menú cerrado
        // status 2: Menú abierto

        const setting = await Setting.findOne({where: {setting: 'menu_open'}});
        const menu = await Menu.findAll({
            attributes: ['id'],
            include: [{model: Food, as: 'food'}],
        });
        
        if(menu.length === 0) return res.status(404).json({status: 0, menu});

        const settingDiscount = await Setting.findOne({where: {setting: 'discount_price'}});
        const discount = settingDiscount ? settingDiscount.int_value : 0;

        const menuResponse = menu.map(menu => ({id: menu.id, food: {...menu.food.get(), discount: menu.food.price - discount}}));
        return res.json({status: setting.int_value === 0 ? 1 : 2, menu: menuResponse});
    },

    async addFood(req, res, next) {
        const food_id = req.params.id;
        const validation = await Menu.findOne({where: {food_id}});
        if(validation !== null) return res.status(400).json({error: 'Esa comida ya ha sido agregada al menú', AddError: 'Esa comida ya ha sido agregada al menú'});

        const menu = new Menu({food_id});

        await menu.save()
        .then(r => res.status(201).json({message: 'Comida agregada al menú'}))
        .catch(e => next(e));
    },

    async removeFood(req, res) {
        const today_start = dateHelper.getTodaysInitialTime();
        const today_end = dateHelper.getTodaysEndTime();
        const createdAt =  { [Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end} };

        
        const menu = await Menu.findByPk(req.params.id);
        if(menu === null) return res.status(404).json({error: 'Comida no encontrada en el menú'});

        const order = await Order.findOne({where: {food_id: menu.food_id, createdAt}});
        if(order !== null) return res.status(400).json({error: 'Hay al menos un usuario que cuenta con ésta comida. Se requiere que los usuarios anulen su pedido relacionado con esta comida'});

        await menu.destroy();
        return res.json({message: 'La comida ha sido quitada del menú con éxito'});
    }

}