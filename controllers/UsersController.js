const {User} = require('../configs/sequelize/models');

module.exports = {

    async getUser(req, res) {

        const user = User.build({
            username: "Luis",
            password: "123456",
            image: "/avatar.jpg",
            birth_month: 1,
            birth_day: 2,
        });



        // await user.save();

        res.send( req.body.test );
    }

}