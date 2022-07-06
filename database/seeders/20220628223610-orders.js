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

    const number_of_iterations_for_the_week = (moment().day() > 5 || moment().day() === 0) ? 5 : moment().day(); // 1: -> lunes, 5 -> viernes. El máximo valor debe de ser 5, impidiendo considerar sábado y domingo.

    // Esto se ejecuta 3 veces, para que sean 3 semanas de órdenes
    for(let i = 0; i < 3; i++) {
      let index_date = null;
      if(i === 0) {
        index_date = moment().day() === 0 ? moment().subtract(1, 'day').startOf('week').add(1, 'day') : moment().startOf('week').add(1, 'day'); // Obtener lunes
      }
      else {
        index_date = moment().day() === 0 ?
        moment().subtract(1, 'day').startOf('week').subtract(7 * i, 'day').add(1, 'day')
        : moment().startOf('week').subtract(7 * i, 'day').add(1, 'day'); // Obtener lunes de hace (i) semanas
      }

      for(let j = 0; j < (i === 0 ? number_of_iterations_for_the_week : 5); j++) {
        const createdAt = index_date;
        users.forEach(user => {
          const random_food_id = getRandomInt(foods.length);
          const food = foods.find(food => food.id === random_food_id);
          const order = {user_id: user.id, food_id: food.id, extra_id: null, name: food.full_name, price: food.price, discount: food.price - discount, createdAt: createdAt.format(), updatedAt: createdAt.format()};
          orders.push(order);
        });

        const users_with_double_food = [];
        const users_with_extra = [];

        for(let i = 0; i < 2; i++) {
          let random_user_id = getRandomInt(users.length);
          let random_food_id = getRandomInt(foods.length);

          while(users_with_double_food.find(element => element.user_id === random_user_id) !== undefined) random_user_id = getRandomInt(users.length);
          while(users_with_double_food.find(element => element.food_id === random_food_id) !== undefined) random_food_id = getRandomInt(foods.length);

          users_with_double_food.push({user_id: random_user_id, food_id: random_food_id});
        }
        for(let i = 0; i < 4; i++) {
          let random_user_id = getRandomInt(users.length);
          let random_extra_id = getRandomInt(extras.length);

          while(users_with_extra.find(element => element.user_id === random_user_id) !== undefined) random_user_id = getRandomInt(users.length);
          while(users_with_extra.find(element => element.extra_id === random_extra_id) !== undefined) random_extra_id = getRandomInt(extras.length);

          users_with_extra.push({user_id: random_user_id, extra_id: random_extra_id});
        }

        users_with_double_food.forEach(element => {
          const food = foods.find(food => food.id === element.food_id);
          const order = {user_id: element.user_id, food_id: element.food_id, extra_id: null, name: food.full_name, price: food.price, discount: 0, createdAt: createdAt.format(), updatedAt: createdAt.format()};
          orders.push(order);
        })
        users_with_extra.forEach(element => {
          const extra = extras.find(extra => extra.id === element.extra_id);
          const order = {user_id: element.user_id, food_id: null, extra_id: element.extra_id, name: extra.name, price: extra.price, discount: 0, createdAt: createdAt.format(), updatedAt: createdAt.format()};
          orders.push(order);
        })

        index_date.add(1, 'day');
      }
    }

    await queryInterface.bulkInsert('orders', orders.map(order => ({...order, id: i++})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('orders'/* , {id: Array(quantity).fill(null).map(item => i++)}, {} */);
  }
};