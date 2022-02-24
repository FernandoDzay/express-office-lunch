'use strict';
const {Model} = require('sequelize');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

      customSave = async () => {
				const hash = await bcrypt.hash(this.password, saltRounds);
				this.password = hash;
				return await this.save();
      }
      auth = async (password) => await bcrypt.compare(password, this.password);
  }
  User.init({
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      birth_month: DataTypes.INTEGER.UNSIGNED,
      birth_day: DataTypes.INTEGER.UNSIGNED,
      is_guest: DataTypes.INTEGER.UNSIGNED,
      is_admin: DataTypes.INTEGER.UNSIGNED,
      status: DataTypes.INTEGER.UNSIGNED
  }, {
      sequelize,
      modelName: 'User',
      timestamps: false,
  });
  return User;
};