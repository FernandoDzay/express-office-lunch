'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      this.belongsTo(models.Food, {
				as: 'food',
				foreignKey: {
				name: 'food_id'
			}});
    }
  }
  Menu.init({
    food_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'menu',
    timestamps: false
  });
  return Menu;
};