'use strict';

const startAt = 1;
const notifications = [
  {description: 'El proyecto ha sido inicializado con datos prueba'},
  {description: 'Hay un cron configurado para que se inicializen datos aleatorios en el proyecto diariamente'},
  {description: 'Todas las órdenes y pagos anteriores, han sido borrados (en caso de que hubieran antes de la inicialización)'},
  {description: 'La tabla de settings está configurada como se debe'},
  {description: 'El usuario administrador, es Luis, puedes acceder a él con (email: luis@gmail.com, password: 1234)'},
];
const quantity = notifications.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkInsert('notifications', notifications.map(notification => ({...notification, id: i++, title: 'Inicialización de proyecto', createdAt: new Date(), updatedAt: new Date()})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('notifications', {id: Array(quantity).fill(null).map(item => i++)}, {});
  }
};