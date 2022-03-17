'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {

    static associate(models) {

    }
  }
  Food.init({
    full_name: DataTypes.STRING,
    short_name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Food',
    tableName: 'foods',
  });
  return Food;
};