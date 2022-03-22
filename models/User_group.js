'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
	class User_group extends Model {
		static associate(models) {
			this.belongsTo(models.Group)
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