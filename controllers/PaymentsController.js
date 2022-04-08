const {User, Order, Payment, sequelize} = require('../configs/sequelize/models');
const moment = require('moment');
const dateHelper = require('../utils/DateHelper');
const {QueryTypes} = require('sequelize');
const { Op } = require("sequelize");

module.exports = {

    async get(req, res, next) {
        const createdAt = req.body.payment_date === undefined ? dateHelper.getLastWeekMonday() : dateHelper.getMondayDate(req.body.payment_date);
        const replacements = {createdAt};
        const query = 
        `
            SELECT custom_user_id AS id, username, SUM(custom.price - custom.discount) AS total_to_pay, COALESCE(SUM(quantity), 0) AS total_paid
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
                    SELECT u.id AS group_p_id, quantity
                    FROM users u
                    INNER JOIN payments p ON u.id = p.user_id
                    WHERE
                        p.createdAt >= :createdAt AND
                        p.createdAt < DATE_ADD(:createdAt, INTERVAL 7 DAY)
                    GROUP BY u.id
                ) group_p
            ON custom_user_id = group_p_id
            GROUP BY custom_user_id
            ORDER BY username
        `;
        const paymentsTable = await sequelize.query(query, {replacements, type: QueryTypes.SELECT});
        if(paymentsTable.length === 0) return res.status(404).json({message: 'No hay nada por pagar'});
        return res.json(paymentsTable);
    },

    async getUserPayments(req, res, next) {
        const user = await User.findByPk(req.body.user_id);
        if(user === null) return res.status(404).json({error: 'No se encontró el usuario'});

        const initial_time = req.body.payment_date === undefined ? dateHelper.getLastWeekMonday() : dateHelper.getMondayDate(req.body.payment_date);
        const end_time = req.body.payment_date === undefined ? dateHelper.getSundayLastTime( dateHelper.getLastWeekMonday() ) : dateHelper.getSundayLastTime(req.body.payment_date);

        const payments = await user.getPayments({where: {createdAt: {[Op.and]: {[Op.gte]: initial_time, [Op.lte]: end_time}}}});
        if(payments.length === 0) return res.status(404).json({message: 'No hay registros de pagos para esta fecha y usuario'});
        return res.json(payments);
    },

    async create(req, res, next) {
        const {user_id, concept, quantity, payment_date} = req.body;

        const user = await User.findByPk(user_id);
        if(user === null) return res.status(404).json({error: 'No se encontró el usuario'});
        
        const total_to_pay_by_users = await getTotalToPayByUsers(payment_date);
        const total_payments_by_users = await getTotalPaymentsByUsers(payment_date);

        const total_to_pay_by_user = total_to_pay_by_users.find(element => user_id === element.id);
        const total_payments_by_user = total_payments_by_users.find(element => user_id === element.id);

        if(total_to_pay_by_user === undefined) return res.status(400).json({error: 'No se puede crear un pago si no hay una cantidad a pagar'});

        const total_to_pay = total_to_pay_by_user.total_to_pay;
        const payments_sum = (total_payments_by_user === undefined ? 0 : total_payments_by_user.total) + quantity;

        if(payments_sum > total_to_pay) return res.status(400).json({error: 'El pago sobrepasa la cantidad total a pagar'});

        const payment = new Payment({user_id, concept, quantity, payment_date});

        payment.save()
        .then(r => res.status(201).json({message: 'El pago fue creado exitosamente'}))
        .catch(e => next(e));
    },

    async patch(req, res, next) {
        const {id, concept, quantity} = req.body;
        const payment = await Payment.findByPk(id);
        if(payment === null) return res.status(404).json({error: 'Pago no encontrado'});

        payment.concept = concept;
        payment.quantity = quantity;

        await payment.save()
        .then(r => res.json({message: 'Pago actualizado correctamente'}))
        .catch(e => next(e));
    },

    async delete(req, res, next) {
        const payment = await Payment.findByPk(req.params.id);
        if(payment === null) return res.status(404).json({error: 'Pago no encontrado'});

        await payment.destroy()
        .then(r => res.json({message: 'Pago borrado correctamente'}))
        .catch(e => next(e));
    },

}

async function getTotalToPayByUsers(date = undefined) {
    const createdAt = date === undefined ? dateHelper.getLastWeekMonday() : dateHelper.getMondayDate(date);
    const replacements = {createdAt};
    const query = 
    `
        SELECT u.id, u.username, SUM(o.price - o.discount) AS total_to_pay
        FROM users u
        INNER JOIN orders o ON u.id = o.user_id
        WHERE
            o.createdAt >= :createdAt AND
            o.createdAt < DATE_ADD(:createdAt, INTERVAL 7 DAY)
        GROUP BY u.id
        ORDER BY u.username
    `;
    return await sequelize.query(query, {replacements, type: QueryTypes.SELECT});
}

async function getTotalPaymentsByUsers(date = undefined) {
    const payment_date = date === undefined ? dateHelper.getLastWeekMonday() : dateHelper.getMondayDate(date);
    const replacements = {payment_date};
    const query = 
    `
        SELECT u.id, u.username, SUM(p.quantity) AS total
        FROM users u
        INNER JOIN payments p ON u.id = p.user_id
        WHERE
            p.payment_date >= :payment_date AND
            p.payment_date < DATE_ADD(:payment_date, INTERVAL 7 DAY)
        GROUP BY u.id
        ORDER BY u.username
    `;
    return await sequelize.query(query, {replacements, type: QueryTypes.SELECT});
}