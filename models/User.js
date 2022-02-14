'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING,
    birth_month: DataTypes.INTEGER.UNSIGNED,
    birth_day: DataTypes.INTEGER.UNSIGNED,
    is_guest: DataTypes.BOOLEAN,
    is_admin: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });
  return User;
};