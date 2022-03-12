const {Food} = require('../configs/sequelize/models');


module.exports = {

    async create(req, res) {
        console.log(req.file);
        return res.json({
            fullName: req.body.fullName,
            shortName: req.body.shortName,
            price: req.body.price
        });
    },



}