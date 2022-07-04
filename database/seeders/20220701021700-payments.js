'use strict';
const moment = require('moment');

function getRandomInt(max) {
  const random = parseInt(Math.floor(Math.random() * (max + 1)));
  return random < 1 ? 1 : random;
}

const startAt = 1;
const payments = [];
const quantity = payments.length;

module.exports = {
  async up (queryInterface, Sequelize) {
    let i = startAt;
    const query =
    `
        SELECT custom_user_id AS id, username, SUM(custom.price - custom.discount) AS total_to_pay, COALESCE(total_quantity, 0) AS total_paid
        FROM
            (
                SELECT u.id AS custom_user_id, username, sum(price) AS price, sum(discount) AS discount
                FROM users u
                INNER JOIN orders o ON u.id = o.user_id
                WHERE
                o.createdAt >= :createdAt AND
                o.createdAt < DATE_ADD(:createdAt, INTERVAL 7 DAY)
                GROUP BY custom_user_id
            ) custom
        LEFT JOIN
            (
                SELECT u.id AS group_p_id, SUM(quantity) AS total_quantity
                FROM users u
                INNER JOIN payments p ON u.id = p.user_id
                WHERE
                    p.payment_date >= :createdAt AND
                    p.payment_date < DATE_ADD(:createdAt, INTERVAL 7 DAY)
                GROUP BY u.id
            ) group_p
        ON custom_user_id = group_p_id
        GROUP BY custom_user_id
        ORDER BY username
    `;

    // Esto se ejecuta 3 veces, para que sean 3 semanas de órdenes
    for(let i = 1; i < 3; i++) {
      const createdAt = moment().startOf('week').subtract(7 * i, 'day').add(1, 'day'); // Obtener lunes de hace (i) semanas
      const users_should_pay = await queryInterface.sequelize.query(query, {type: queryInterface.sequelize.QueryTypes.SELECT, replacements: {createdAt: createdAt.format()}});

      const random_users_ids = [];
      for(let i = 0; i < 10; i++) {
        let random_user_id = getRandomInt(users_should_pay.length);
        while(random_users_ids.find(element => element === random_user_id) !== undefined) random_user_id = getRandomInt(users_should_pay.length);

        random_users_ids.push(random_user_id);
      }

      users_should_pay.forEach(user_should_pay => {
        if(random_users_ids.find(random_user_id => random_user_id === user_should_pay.id) === undefined) {
          const payment = {user_id: user_should_pay.id, concept: 'Pago completo', quantity: user_should_pay.total_to_pay, payment_date: createdAt.format(), createdAt: createdAt.format(), updatedAt: createdAt.format()};
          payments.push(payment);
        }
        else {
          const payment = {user_id: user_should_pay.id, payment_date: createdAt.format(), createdAt: createdAt.format(), updatedAt: createdAt.format()};
          payments.push({...payment, concept: 'Primer pago', quantity: user_should_pay.total_to_pay - 10});
          payments.push({...payment, concept: 'Segundo pago', quantity: 10});
        }
      });
    }
    
    await queryInterface.bulkInsert('payments', payments.map(payment => ({...payment, id: i++})), {});
  },

  async down (queryInterface, Sequelize) {
    let i = startAt;
    await queryInterface.bulkDelete('payments'/* , {id: Array(quantity).fill(null).map(item => i++)}, {} */);
  }
};