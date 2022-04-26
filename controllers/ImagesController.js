const path = require("path");

module.exports = {

    users(req, res, next) {
        const usersImagesPath = __dirname.split('\\').filter(path => path !== 'controllers').join('\\') + '\\public\\img\\users\\';
        const userImage = req.params.filename;

        console.log("entrando a ruta");

        return res.sendFile(usersImagesPath + userImage, function (err) {
            if (err) {
                console.log("hubo error");
                console.log(err);
                next();
            }
        });
    },

    foods(req, res, next) {
        const foodsImagesPath = __dirname.split('\\').filter(path => path !== 'controllers').join('\\') + '\\public\\img\\foods\\';
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