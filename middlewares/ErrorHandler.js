module.exports = function (error, req, res, next) {
    console.log(error);
    return res.status(500).send({error: "Ocurrió un error inseperado"});
}