const fs = require('fs');
const path = require('path');
const { send } = require("process");

module.exports = {

    users(req, res, next) {
        const usersImagesPath = path.join(__dirname, '/../public/img/users/');
        const userImage = req.params.filename;

        return res.sendFile(usersImagesPath + userImage, function (err) {
            if (err) {
                next();
            }
        });
    },

    foods(req, res, next) {
        const foodsImagesPath = path.join(__dirname, '/../public/img/foods/');
        const foodImage = req.params.filename;

        return res.sendFile(foodsImagesPath + foodImage, function (err) {
            if (err) {
                next();
            }
        });
    },

    handleNotFound(req, res, next) {
        return res.status(404).send();
    }

}