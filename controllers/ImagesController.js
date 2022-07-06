const fs = require('fs');
const path = require('path');
const { send } = require("process");

module.exports = {

    users(req, res, next) {
        return returnImage(req, res, next, '/../public/img/users/');
    },

    foods(req, res, next) {
        return returnImage(req, res, next, '/../public/img/foods/');
    },

    usersSeeds(req, res, next) {
        return returnImage(req, res, next, '/../public/img/users/seeders/');
    },

    foodsSeeds(req, res, next) {
        return returnImage(req, res, next, '/../public/img/foods/seeders/');
    },

    handleNotFound(req, res, next) {
        return res.status(404).send();
    }

}


const returnImage = (req, res, next, imagesPath) => {
    const fullImagesPath = path.join(__dirname, imagesPath);

    return res.sendFile(fullImagesPath + req.params.filename, function (err) {
        if (err) {
            next();
        }
    });
}