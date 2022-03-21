'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Extra extends Model {
    static associate(models) {}
  }
  Extra.init({
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Extra',
  });
  return Extra;
};