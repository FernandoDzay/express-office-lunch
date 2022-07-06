'use strict';

const startAt = 1;
const menu = [
  {food_id: 1},
  {food_id: 2},
  {food_id: 3},
  {food_id: 4},
];
const quantity = menu.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('menu', menu.map(food => ({...food, id: i++})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('menu', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};