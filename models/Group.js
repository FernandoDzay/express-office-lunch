'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      this.hasOne(models.User_group, {foreignKey: 'group_id'});
    }
  }
  Group.init({
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME
  }, {
    sequelize,
    tableName: 'groups',
    modelName: 'Group',
    timestamps: false,
  });
  return Group;
};