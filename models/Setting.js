'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class settings extends Model {
    static associate(models) {}
  }
  settings.init({
    setting: DataTypes.STRING,
    int_value: DataTypes.INTEGER,
    string_value: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'settings',
    modelName: 'Setting',
    timestamps: false
  });
  return settings;
};