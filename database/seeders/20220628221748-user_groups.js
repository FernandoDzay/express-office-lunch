'use strict';

const startAt = 1;
const users_groups = [
  {group_id: 1},
  {group_id: 1},
  {group_id: 1},
  {group_id: 1},
  {group_id: 2},
  {group_id: 2},
  {group_id: 2},
  {group_id: 2},
  {group_id: 3},
  {group_id: 3},
  {group_id: 3},
  {group_id: 3},
  {group_id: 4},
  {group_id: 4},
  {group_id: 4},
  {group_id: 4},
];
const quantity = users_groups.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('users_groups', users_groups.map(users_group => ({...users_group, id: i, user_id: i++, status: 1})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('users_groups', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};