'use strict';is_admin: 0

const startAt = 1;
const users = [
  {email: 'luis@gmail.com', username: 'Luis Fernando', birth_month: 1, is_admin: 1},
  {email: 'pedro@gmail.com', username: 'Pedro González', birth_month: 2, is_admin: 0},
  {email: 'majo@gmail.com', username: 'María José', birth_month: 3, is_admin: 0},
  {email: 'laura@gmail.com', username: 'Laura Zambrano', birth_month: 4, is_admin: 0},
  {email: 'pablo@gmail.com', username: 'Pablo Pérez', birth_month: 5, is_admin: 0},
  {email: 'diana@gmail.com', username: 'Diana Poot', birth_month: 6, is_admin: 0},
  {email: 'maria@gmail.com', username: 'María Dávila', birth_month: 7, is_admin: 0},
  {email: 'karla@gmail.com', username: 'Karla Peniche', birth_month: 8, is_admin: 0},
  {email: 'angel@gmail.com', username: 'Angel Ek', birth_month: 9, is_admin: 0},
  {email: 'diego@gmail.com', username: 'Diego Hernández', birth_month: 10, is_admin: 0},
  {email: 'andres@gmail.com', username: 'Andres Palma', birth_month: 11, is_admin: 0},
  {email: 'rafa@gmail.com', username: 'Rafa Vera', birth_month: 12, is_admin: 0},
  {email: 'victor@gmail.com', username: 'Victor Piña', birth_month: 1, is_admin: 0},
  {email: 'david@gmail.com', username: 'David Torres', birth_month: 2, is_admin: 0},
  {email: 'arturo@gmail.com', username: 'Arturo Castañeda', birth_month: 3, is_admin: 0},
  {email: 'juan@gmail.com', username: 'Juan Castillo', birth_month: 4, is_admin: 0},
];
const quantity = users.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('Users', users.map(user => ({...user, id: i, password: '$2b$10$I.O0TbikAicVHn7raHWH1O/nFHDM./WVdJeUJLSwQv5pe9TishSSq', image: `user_${i++}.jpg`, birth_day: 1, status: 1})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('Users', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};