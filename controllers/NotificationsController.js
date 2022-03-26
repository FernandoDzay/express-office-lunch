const {Notification, Assigned_notification} = require('../configs/sequelize/models');

module.exports = {

    async get(req, res, next) {
        const notifications = await Assigned_notification.findAll({
            where: {user_id: req.params.id},
            attributes: ['id', 'createdAt', 'updatedAt'],
            include: [
                {model: Notification, as: 'notification', attributes: ['id', 'title', 'description', 'created_by', 'type']}
            ],
            order: ['createdAt'],
        });

        if(notifications === null) return res.status(404).json({status: 0, message: 'No se encontraron notificaciones para este usuario'});
        return res.json({status: 1, notifications});
    },

    async send(req, res, next) {
        const {title, description} = req.body;
        const notification = new Notification({title, description});
        if(req.body.created_by) notification.type = req.body.created_by;
        if(req.body.type) notification.type = req.body.type;

        await notification.sendAll();
        return res.json({message: 'Todas las notificaciones se enviaron con éxito'});
    },

    async markRead(req, res) {
        const id = req.params.id;
        const assigned_notification = await Assigned_notification.update({has_been_read: 1}, {where: {id}});
        
        if(assigned_notification[0] !== 1) return res.status(500).json({error: 'No se pudo actualizar la notificación'});
        return res.json({message: 'Notificación marcada como leída'});
    }

}