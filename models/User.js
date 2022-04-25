'use strict';
const {Model} = require('sequelize');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      static associate(models) {
        this.hasOne(models.User_group, {foreignKey: 'user_id'});
        this.hasMany(models.Order, {foreignKey: 'user_id'});
        this.hasMany(models.Payment, {foreignKey: 'user_id'});
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
      tableName: 'users',
      timestamps: false,
      hooks: {
        beforeDestroy: deleteImage,
        afterSave: function(instances, options) {
          const isNewRecord = instances._options.isNewRecord;
          const imageChanged = instances._previousDataValues.image !== instances.dataValues.image;
          if(!isNewRecord && imageChanged) deleteImage(instances, options);
        },
      }
  });
  return User;
};


// ---------------------- Functions

const deleteImage = (instances, options) => {
  const image = instances._previousDataValues.image;
  try { fs.unlinkSync(`public/img/users/${image}`); }
  catch(error) { console.log(error); }
}