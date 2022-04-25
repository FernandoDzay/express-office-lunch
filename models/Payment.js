'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    }
  }
  Payment.init({
    user_id: DataTypes.INTEGER,
    concept: DataTypes.STRING,
    quantity: DataTypes.FLOAT,
    payment_date: DataTypes.DATE,
  }, {
    sequelize,
    tableName: 'payments',
    modelName: 'Payment',
  });
  return Payment;
};