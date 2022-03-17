const {Food} = require('../configs/sequelize/models');


module.exports = {

    async create(req, res, next) {
        const image = req.file === undefined ? '/public/img/foods/default.jpg' : req.file.filename;
        const short_name = req.body.short_name === undefined ? null : req.body.short_name;
        const { full_name, price } = req.body;
        const food = new Food({full_name, short_name, price, image});

        await food.save()
        .then(r => res.status(201).json({message: "Food Creada"}))
        .catch(e =>  next(e));
    },



}