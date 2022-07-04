'use strict';

const startAt = 1;
const foods = [
  {full_name: 'Empanizado de pollo', short_name: 'Empanizados', image: 'empanizado.jpg'},
  {full_name: 'Pechuga a la plancha', short_name: 'Pechuga', image: 'pechuga.jpg'},
  {full_name: 'Huevo con papas', short_name: 'Huevos', image: 'huevos.jpg'},
  {full_name: 'Mole con arroz', short_name: 'Moles', image: 'mole.jpg'},
  {full_name: 'Lomitos de valladolid', short_name: 'Lomitos', image: 'lomitos.jpg'},
  {full_name: 'Empanadas de carne molida', short_name: 'Empanadas molida', image: 'e_pollo.jpg'},
  {full_name: 'Empanadas de pollo', short_name: 'Empanadas pollo', image: 'e_molida.jpg'},
  {full_name: 'Baguette', short_name: 'Baguette', image: 'baguette.jpg'},
  {full_name: 'Chuleta', short_name: 'Chuletas', image: 'chuletas.jpg'},
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