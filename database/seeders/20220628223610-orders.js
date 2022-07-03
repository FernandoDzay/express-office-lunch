'use strict';
const moment = require('moment');

function getRandomInt(max) {
  const random = parseInt(Math.floor(Math.random() * (max + 1)));
  return random < 1 ? 1 : random;
}


// ---------------------------- Este archivo depende del número de foods, extras, users, y settings en los queries --------------------------------//
const startAt = 1;
const orders = [];
const quantity = orders.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;

    const foods = await queryInterface.sequelize.query('SELECT * FROM foods WHERE id >= 1 AND id < 10', {type: queryInterface.sequelize.QueryTypes.SELECT});
    const extras = await queryInterface.sequelize.query('SELECT * FROM extras WHERE id >= 1 AND id < 6', {type: queryInterface.sequelize.QueryTypes.SELECT});
    const discount = await queryInterface.rawSelect('settings', {where: {setting: 'discount_price'}}, ['int_value']);
    const users = await queryInterface.sequelize.query('SELECT * FROM users WHERE id < 17', {type: queryInterface.sequelize.QueryTypes.SELECT});

    const today = moment();

    // Esto se ejecuta 3 veces, para que sean 3 semanas de órdenes
    for(let i = 0; i < 3; i++) {
      if(i === 0) {
        const number_of_iterations_for_the_week = moment().day() > 5 ? 5 : moment().day(); // 1: -> lunes, 5 -> viernes. El máximo valor debe de ser 5, impidiendo considerar sábado y domingo.
        const index_date = moment().startOf('week').add(1, 'day'); // Obtener lunes

        for(let i = 0; i < number_of_iterations_for_the_week; i++) {
          const createdAt = index_date;
          users.forEach(user => {
            const random_food_id = getRandomInt(foods.length);
            /* const users_with_double_food = [];
            const users_with_extra = [];

            for(let i = 0; i < 2; i++) {
              users_with_double_food.push({user_id: getRandomInt(users.length), food_id: getRandomInt(foods.length)});
            }

            for(let i = 0; i < 5; i++) {
              users_with_extra.push({user_id: getRandomInt(users.length), extra_id: getRandomInt(extras.length)});
            } */

            const food = foods.find(food => food.id === random_food_id);
            const order = {user_id: user.id, food_id: food.id, extra_id: null, name: food.full_name, price: 20, discount: 0, createdAt: createdAt.format(), updatedAt: createdAt.format()};
            orders.push(order);
          });
          index_date.add(1, 'day');
        }
      }
      else {
        const index_date = moment().startOf('week').subtract(7 * i, 'day').add(1, 'day'); // Obtener lunes de hace (i) semanas

        for(let i = 0; i < 5; i++) {
          const createdAt = index_date;
          users.forEach(user => {
            const random_food_id = getRandomInt(foods.length);
            const food = foods.find(food => food.id === random_food_id);
            const order = {user_id: user.id, food_id: food.id, extra_id: null, name: food.full_name, price: food.price, discount, createdAt: createdAt.format(), updatedAt: createdAt.format()};
            orders.push(order);
          });
          index_date.add(1, 'day');
        }
      }
    }

    await queryInterface.bulkInsert('Orders', orders.map(order => ({...order, id: i++})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('Orders'/* , {id: Array(quantity).fill(null).map(item => i++)}, {} */);
  }
};