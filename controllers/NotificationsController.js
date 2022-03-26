const {Notification, Assigned_notification, sequelize} = require('../configs/sequelize/models');
const Moment = require('moment');
const {QueryTypes} = require('sequelize');

module.exports = {

    async get(req, res, next) {
        const format = 'YYYY-MM-DD HH:mm:ss';
        const createdAt = Moment( Moment().format('YYYY-MM-DD') ).format(format);
        const user_id = req.params.id;

        const query = 
        `
            SELECT a.id, title, description, created_by, type, has_been_read, a.createdAt, a.updatedAt
            FROM notifications n
            INNER JOIN assigned_notifications a ON n.id = a.notification_id
            WHERE
                user_id = :user_id
                AND (
                    a.createdAt >= :createdAt OR
                    has_been_read = 0
                )
            ORDER BY createdAt
        `;
        const notifications = await sequelize.query(query, {replacements: {createdAt, user_id}, type: QueryTypes.SELECT});

        if(notifications.length === 0) return res.status(404).json({status: 0, message: 'No se encontraron notificaciones para este usuario'});
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