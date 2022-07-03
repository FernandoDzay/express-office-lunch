'use strict';

const startAt = 1;
const extras = [
  {name: 'Tortillas extra', price: 5},
  {name: 'Coca-cola', price: 20},
  {name: 'Sprite', price: 18},
  {name: 'Horchata', price: 15},
  {name: 'Jamaica', price: 15},
];
const quantity = extras.length;


module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('Extras', extras.map(extra => ({...extra, id: i++, createdAt: new Date(), updatedAt: new Date()})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('Extras', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};