'use strict';

// ---------------------------- Este archivo depende del número de users, y notifications en los queries --------------------------------//
const startAt = 1;
const assigned_notifications = [];
const quantity = assigned_notifications.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;

    const notifications = await queryInterface.sequelize.query('SELECT * FROM notifications WHERE id >= 1 AND id < 10', {type: queryInterface.sequelize.QueryTypes.SELECT});
    const users = await queryInterface.sequelize.query('SELECT * FROM users WHERE id < 17', {type: queryInterface.sequelize.QueryTypes.SELECT});
    
    notifications.forEach(notification => {
      users.forEach(user => {
        const assigned_notification = {notification_id: notification.id, user_id: user.id};
        assigned_notifications.push(assigned_notification);
      })
    });

    await queryInterface.bulkInsert('assigned_notifications', assigned_notifications.map(assigned_notification => ({...assigned_notification, id: i++, createdAt: new Date(), updatedAt: new Date()})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('assigned_notifications'/* , {id: Array(quantity).fill(null).map(item => i++)}, {} */);
  }
};