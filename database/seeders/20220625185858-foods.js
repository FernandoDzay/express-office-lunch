'use strict';

const startAt = 1;
const foods = [
  {full_name: 'Empanizado de pollo', short_name: 'Empanizados', image: 'seeders/empanizado.jpg'},
  {full_name: 'Pechuga a la plancha', short_name: 'Pechuga', image: 'seeders/pechuga.jpg'},
  {full_name: 'Huevo con papas', short_name: 'Huevos', image: 'seeders/huevos.jpg'},
  {full_name: 'Mole con arroz', short_name: 'Moles', image: 'seeders/mole.jpg'},
  {full_name: 'Lomitos de valladolid', short_name: 'Lomitos', image: 'seeders/lomitos.jpg'},
  {full_name: 'Empanadas de carne molida', short_name: 'Empanadas molida', image: 'seeders/e_molida.jpg'},
  {full_name: 'Empanadas de pollo', short_name: 'Empanadas pollo', image: 'seeders/e_pollo.jpg'},
  {full_name: 'Baguette', short_name: 'Baguette', image: 'seeders/baguette.jpg'},
  {full_name: 'Chuleta', short_name: 'Chuletas', image: 'seeders/chuletas.jpg'},
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