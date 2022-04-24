const {Food, Menu} = require('../configs/sequelize/models');
const fs = require('fs');


module.exports = {

    async get(req, res, next) {
        const food = await Food.findAll();
        if(food === null) return res.status(404).json({error: 'Comidas no encontradas'});
        return res.json(food);
    },

    async getFoods(req, res, next) {
        const food = await Food.findByPk(req.params.id);
        if(food === null) return res.status(404).json({error: 'Comida no encontrada'});
        return res.json(food);
    },

    async create(req, res, next) {
        const image = req.file === undefined ? 'default.jpg' : req.file.filename;
        const { full_name, price } = req.body;
        const short_name = req.body.short_name === undefined ? null : req.body.short_name;
        const food = new Food({full_name, short_name, price, image});

        await food.save()
        .then(r => res.status(201).json({message: "Food Creada"}))
        .catch(e => next(e));
    },

    async update(req, res, next) {
        const { full_name, price } = req.body;
        const food = await Food.findByPk(req.body.id);
        if(food === null) return res.status(404).json({error: 'Comida no encontrada'});

        if(req.body.short_name !== undefined) food.short_name = req.body.short_name;
        if(req.file !== undefined) food.image = req.file.filename;

        food.full_name = full_name;
        food.price = price;

        await food.save()
        .then(r => res.status(200).json({message: "Food actualizada"}))
        .catch(e =>  next(e));
    },

    async delete(req, res) {
        const food = await Food.findByPk(req.params.id);
        if(food === null) return res.status(404).json({error: 'Comida no encontrada'});

        foodInMenu = await Menu.findOne({where: {food_id: food.id}});
        if(foodInMenu !== null) return res.status(400).json({deleteError: 'Esa comida se encuentra en el menú, bórrala primero'});

        await food.destroy();
        return res.json({message: 'Comida borrada con éxito'});
    }

}