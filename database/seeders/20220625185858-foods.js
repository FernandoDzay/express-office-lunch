'use strict';

const startAt = 1;
const foods = [
  {full_name: 'Empanizado de pollo', short_name: 'Empanizados', image: 'seeders/empanizado.png'},
  {full_name: 'Pechuga a la plancha', short_name: 'Pechuga', image: 'seeders/pechuga.png'},
  {full_name: 'Huevo con papas', short_name: 'Huevos', image: 'seeders/huevos.png'},
  {full_name: 'Mole con arroz', short_name: 'Moles', image: 'seeders/mole.png'},
  {full_name: 'Lomitos de valladolid', short_name: 'Lomitos', image: 'seeders/lomitos.png'},
  {full_name: 'Empanadas de carne molida', short_name: 'Empanadas molida', image: 'seeders/e_molida.png'},
  {full_name: 'Empanadas de pollo', short_name: 'Empanadas pollo', image: 'seeders/e_pollo.png'},
  {full_name: 'Baguette', short_name: 'Baguette', image: 'seeders/baguette.png'},
  {full_name: 'Chuleta', short_name: 'Chuletas', image: 'seeders/chuletas.png'},
];
const quantity = foods.length;


module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('foods', foods.map((food, index) => ({...food, id: i++, price: 50, createdAt: new Date(), updatedAt: new Date()})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('foods', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};