const {Setting} = require('../configs/sequelize/models');

module.exports = {

    async get(req, res, next) {
        const setting = await Setting.findAll();

        if(setting === null) return res.status(404).json({error: 'No está lleno ningún setting'});
        return res.json(setting);
    },

    async create(req, res, next) {
        const validation = await Setting.findOne({where: {setting: req.body.setting}});
        if(validation !== null) return res.status(400).json({error: 'Setting existente'});
        
        const data = {setting: req.body.setting};
        if(req.body.int_value === undefined) data.string_value = req.body.string_value;
        else data.int_value = req.body.int_value;

        const setting = new Setting(data);

        await setting.save()
        .then(r => res.status(201).json({message: 'Setting guardada'}))
        .catch(e => next(e));
    },

    async update(req, res, next) {
        const setting = await Setting.findByPk(req.body.id);
        if(setting === null) return res.status(404).json({error: 'Setting no encontrado'});
        if(setting.setting !== req.body.setting) {
            const validation = await Setting.findOne({where: {setting: req.body.setting}});
            if(validation !== null) return res.json({error: 'Ya existe un setting con ese nombre'});
        }
        
        setting.setting = req.body.setting
        if(req.body.int_value === undefined) {
            setting.string_value = req.body.string_value;
            setting.int_value = null;
        }
        else {
            setting.int_value = req.body.int_value;
            setting.string_value = null;
        }

        await setting.save()
        .then(r => res.status(200).json({message: 'Setting actualizada'}))
        .catch(e => next(e));
    },

    async delete(req, res) {
        const setting = await Setting.findByPk(req.params.id);
        if(setting === null) return res.status(404).json({error: 'Setting no encontrado'});
        await setting.destroy();
        return res.json({message: 'Setting borrado con éxito'});
    }

}