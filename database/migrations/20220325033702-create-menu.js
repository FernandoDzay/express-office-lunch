'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      food_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'foods',
          key: 'id'
        },
        allowNull: false
      },
    });
    await queryInterface.addConstraint('menu', {
      type: 'UNIQUE',
      fields: ['food_id'],
      name: 'unique_food_id',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('menu');
  }
};