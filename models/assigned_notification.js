'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Assigned_notification extends Model {
    static associate(models) {

      this.belongsTo(models.Notification, {
        foreignKey: 'notification_id',
        as: 'notification'
      });

      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });

    }
  }
  Assigned_notification.init({
    notification_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    has_been_read: DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName: 'assigned_notifications',
    modelName: 'Assigned_notification',
  });
  return Assigned_notification;
};