'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User_group extends Model {
		static associate(models) {
			this.belongsTo(models.Group, {
				as: 'group',
				foreignKey: {
				name: 'group_id'
			}});
			this.belongsTo(models.User, {
				as: 'user',
				foreignKey: {
				name: 'user_id'
			}});
		}
	}
	User_group.init({
		user_id: DataTypes.INTEGER,
		group_id: DataTypes.INTEGER,
		status: DataTypes.INTEGER
	}, {
		sequelize,
		modelName: 'User_group',
		tableName: 'users_groups',
		timestamps: false,
	});
	return User_group;
};