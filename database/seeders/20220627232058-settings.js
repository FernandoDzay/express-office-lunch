'use strict';

const startAt = 1;
const settings = [
  {setting: 'menu_open', int_value: 1, string_value: null},
  {setting: 'groups_rotate', int_value: 1, string_value: null},
  {setting: 'discount_price', int_value: 20, string_value: null},
];
const quantity = settings.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('Settings', settings.map(setting => ({...setting, id: i++})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('Settings', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};