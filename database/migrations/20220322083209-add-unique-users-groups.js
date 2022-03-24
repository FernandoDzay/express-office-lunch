'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.addConstraint('users_groups', {
      type: 'UNIQUE',
      fields: ['user_id'],
      name: 'unique_user_id',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('users_groups', 'users_groups_ibfk_1')
    await queryInterface.removeConstraint('users_groups', 'unique_user_id')
  }
};
