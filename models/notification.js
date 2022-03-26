'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {

    send = async (user_id) => {
      await this.save();
      const assigned_notification = new sequelize.models.Assigned_notification({notification_id: this.id, user_id});
      return await assigned_notification.save();
    }

    sendAll = async () => {
      const {title, description} = this;
      const users = await sequelize.models.User.findAll();

      const notification = new sequelize.models.Notification({title, description});
      if(this.created_by) notification.created_by = this.created_by;
      if(this.type) notification.type = this.type;

      await notification.save();
      
      users.forEach(async user => {
        const assigned_notification = new sequelize.models.Assigned_notification({notification_id: notification.id, user_id: user.id});
        await assigned_notification.save();
      });
    }

    static associate(models) {
      this.hasMany(models.Assigned_notification, {
        foreignKey: 'notification_id',
        as: 'assigned_notifications'
      })
    }
  }
  Notification.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.STRING,
    type: DataTypes.ENUM('normal', 'warning', 'danger')
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};