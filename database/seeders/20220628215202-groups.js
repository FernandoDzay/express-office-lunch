'use strict';

const startAt = 1;
const groups = [
  {start_time: '12:45:00', end_time: '13:15:00'},
  {start_time: '13:15:00', end_time: '13:45:00'},
  {start_time: '13:45:00', end_time: '14:15:00'},
  {start_time: '14:15:00', end_time: '14:45:00'},
];
const quantity = groups.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('groups', groups.map(group => ({...group, id: i++})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('groups', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};