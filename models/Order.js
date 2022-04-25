'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
      this.belongsTo(models.Extra, {foreignKey: 'extra_id', as: 'extra'});
      this.belongsTo(models.Food, {foreignKey: 'food_id', as: 'food'});
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    food_id: DataTypes.INTEGER,
    extra_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
  }, {
    sequelize,
    tableName: 'orders',
    modelName: 'Order',
  });
  return Order;
};