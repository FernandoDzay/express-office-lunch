const { Extra, Order } = require('../configs/sequelize/models');
const { Op } = require("sequelize");
const dateHelper = require('../utils/DateHelper');

module.exports = {

    async get(req, res, next) {
        const extra = await Extra.findAll();
        if(extra === null) return res.status(404).json({error: 'No existen extras'});
        return res.json(extra);
    },

    async getExtra(req, res, next) {
        const extra = await Extra.findByPk(req.params.id);
        if(extra === null) return res.status(404).json({error: 'Extra no encontrado'});
        return res.json(extra);
    },

    async create(req, res, next) {
        const { name, price } = req.body;
        const extra = new Extra({name, price});

        await extra.save()
        .then(r => res.status(201).json({message: "Extra Creado"}))
        .catch(e => next(e));
    },

    async update(req, res, next) {
        const { name, price } = req.body;
        const extra = await Extra.findByPk(req.body.id);
        if(extra === null) return res.status(404).json({error: 'Extra no encontrado'});

        extra.name = name;
        extra.price = price;

        await extra.save()
        .then(r => res.status(200).json({message: "Extra actualizado"}))
        .catch(e =>  next(e));
    },

    async delete(req, res) {
        const today_start = dateHelper.getTodaysInitialTime();
        const today_end = dateHelper.getTodaysEndTime();
        const createdAt =  { [Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end} };

        const extra = await Extra.findByPk(req.params.id);
        if(extra === null) return res.status(404).json({error: 'Extra no encontrado'});

        const order = await Order.findOne({where: {extra_id: extra.id, createdAt}});
        if(order !== null) return res.status(400).json({error: 'Hay al menos un usuario que cuenta con éste extra. Se requiere que los usuarios anulen su pedido de hoy relacionado con éste extra'});

        await extra.destroy();
        return res.json({message: 'Extra borrada con éxito'});
    }

}