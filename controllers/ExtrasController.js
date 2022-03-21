const {Extra} = require('../configs/sequelize/models');

module.exports = {

    async get(req, res, next) {
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
        if(extra === null) return res.status(404).json({error: 'Extra no encontrada'});

        extra.name = name;
        extra.price = price;

        await extra.save()
        .then(r => res.status(200).json({message: "Extra actualizada"}))
        .catch(e =>  next(e));
    },

    async delete(req, res) {
        const extra = await Extra.findByPk(req.params.id);
        if(extra === null) return res.status(404).json({error: 'Comida no encontrada'});
        await extra.destroy();
        return res.json({message: 'Extra borrada con éxito'});
    }

}