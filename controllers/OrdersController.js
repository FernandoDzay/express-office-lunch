const {User, Food, Extra, Setting, Order, sequelize} = require('../configs/sequelize/models');
const moment = require('moment');
const dateHelper = require('../utils/DateHelper');
const {QueryTypes} = require('sequelize');
const { Op } = require("sequelize");

module.exports = {

    async get(req, res, next) {
        let andWhereUser = "";
        if(req.body.user_id) {
            const user = await User.findByPk(req.body.user_id);
            if(user === null) return res.status(404).json({error: 'No se encontró el usuario'});
            andWhereUser = ` AND user_id = ${user.id}`;
        }

        const currentMonday = dateHelper.getMondayDate();
        const replacements = req.body.date === undefined ? {createdAt: currentMonday} : {createdAt: dateHelper.getMondayDate(req.body.date)};
        const query = 
        `
            SELECT o.id, u.username, o.name, o.food_id, o.extra_id, o.price, o.discount, o.createdAt, o.updatedAt 
            FROM orders o 
            INNER JOIN users u ON o.user_id = u.id 
            WHERE o.createdAt >= :createdAt AND o.createdAt < DATE_ADD(:createdAt, INTERVAL 7 DAY) ${andWhereUser}
            ORDER BY u.username, o.createdAt
        `;
        const orders = await sequelize.query(query, {replacements, type: QueryTypes.SELECT});

        const ordersWeekArray = getOrdersWeekArray(orders);

        return res.json(ordersWeekArray);
    },

    async getTodaysOrders(req, res, next) {
        const today_start = dateHelper.getTodaysInitialTime();
        const today_end = dateHelper.getTodaysEndTime();

        let orders = [];
        if(req.params.user_id) {
            const user = await User.findByPk(req.params.user_id);
            if(user === null) return res.status(404).json({error: 'No se encontró el usuario'});

            orders = await Order.findAll({
                where: {user_id: req.params.user_id, createdAt: {[Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end}}}
            });
        }
        else {
            orders = await Order.findAll({
                where: {createdAt: {[Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end}}},
                include: {model: User, as: 'user'},
                order: ['user_id']
            });
        }

        if(orders.length === 0) return res.status(404).json({message: 'No hay órdenes el día de hoy'});
        const todaysOrders = req.params.user_id ? getTodaysOrdersArray(orders) : getTodaysOrdersByUsersArray(orders);

        return res.json(todaysOrders);
    },

    async make(req, res, next) {
        const today_start = dateHelper.getTodaysInitialTime();
        const today_end = dateHelper.getTodaysEndTime();

        const orders = await Order.findAll({
            where: {createdAt: {[Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end}}},
            include: {model: Food, as: 'food'},
        });

        if(orders.length === 0) return res.status(404).json({message: 'No hay órdenes el día de hoy'});
        const todaysOrders = getTodaysOrdersArray(orders);

        return res.json(todaysOrders);
    },

    async create(req, res, next) {
        const user = await User.findByPk(req.body.user_id);
        if(user === null) return res.status(404).json({error: 'No se encontró el usuario'});

        const userOrders = await Order.findAll({where: {createdAt: {[Op.gte]: moment().format('YYYY-MM-DD')}, user_id: user.id}});

        const order = new Order({user_id: req.body.user_id});
        order.user_id = user.id;

        if(req.body.food_id) {
            const food = await Food.findByPk(req.body.food_id);
            if(food === null) return res.status(404).json({error: 'No se encontró la comida'});
            order.food_id = food.id;
            order.name = food.full_name;
            order.price = food.price;

            const setting = await Setting.findOne({where: {setting: 'discount_price'}});
            if(setting.int_value > 0 && food.price > setting.int_value && !userHasAlreadyFoodOrder(userOrders)) order.discount = food.price - setting.int_value;
        }
        else {
            const extra = await Extra.findByPk(req.body.extra_id);
            if(extra === null) return res.status(404).json({error: 'No se encontró el extra'});
            order.extra_id = extra.id;
            order.name = extra.name;
            order.price = extra.price;
        }

        await order.save()
        .then(r => res.status(201).json({message: 'La orden fue creada con éxito'}))
        .catch(e => next(e));
    },

    async createUserOrder(req, res, next) {
        const userOrders = await Order.findAll({where: {createdAt: {[Op.gte]: moment().format('YYYY-MM-DD')}, user_id: req.body.logged_user.id}});
        const order = new Order({user_id: req.body.logged_user.id});

        if(req.body.food_id) {
            const food = await Food.findByPk(req.body.food_id);
            if(food === null) return res.status(404).json({error: 'No se encontró la comida'});
            order.food_id = food.id;
            order.name = food.full_name;
            order.price = food.price;

            const setting = await Setting.findOne({where: {setting: 'discount_price'}});
            if(setting.int_value > 0 && food.price > setting.int_value && !userHasAlreadyFoodOrder(userOrders)) order.discount = food.price - setting.int_value;
        }
        else {
            const extra = await Extra.findByPk(req.body.extra_id);
            if(extra === null) return res.status(404).json({error: 'No se encontró el extra'});
            order.extra_id = extra.id;
            order.name = extra.name;
            order.price = extra.price;
        }

        await order.save()
        .then(r => res.status(201).json({message: 'La orden fue creada con éxito'}))
        .catch(e => next(e));
    },

    async delete(req, res, next) {
        const order = await Order.findByPk(req.params.id);
        if(order === null) return res.status(404).json({error: 'Órden no encontrada'});
        await order.destroy();
        return res.json({message: 'Órden borrada con éxito'});
    },

    async deleteUserOrder(req, res, next) {
        const today_start = dateHelper.getTodaysInitialTime();
        const today_end = dateHelper.getTodaysEndTime();

        let order = null;
        if(req.body.food_id) {
            order = await Order.findOne({where: {
                food_id: req.body.food_id,
                user_id: req.body.logged_user.id,
                createdAt: { [Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end} }}, order: [['discount', 'ASC']]});
        }
        else {
            order = await Order.findOne({where: {
                extra_id: req.body.extra_id,
                user_id: req.body.logged_user.id,
                createdAt: { [Op.and]: {[Op.gte]: today_start, [Op.lte]: today_end} }}});
        }

        if(order === null) return res.status(404).json({error: 'Órden no encontrada'});
        await order.destroy();
        return res.json({message: 'Órden borrada con éxito'});
    }

}


const userHasAlreadyFoodOrder = (orders) => orders.length > 0;

function getOrdersWeekArray(orders) {
    const ordersWeekArray = {total: 0, discount: 0, net_total: 0, orders: []};
    let previousUsername = null;

    orders.forEach((order, index) => {
        const ordersOfWeek = {
            username: order.username,
            total: 0,
            discount: 0,
            net_total: 0,
            weekDays: {
                monday: {total: 0, discount: 0, net_total: 0, orders: []},
                tuesday: {total: 0, discount: 0, net_total: 0, orders: []},
                wednesday: {total: 0, discount: 0, net_total: 0, orders: []},
                thursday: {total: 0, discount: 0, net_total: 0, orders: []},
                friday: {total: 0, discount: 0, net_total: 0, orders: []},
                saturday: {total: 0, discount: 0, net_total: 0, orders: []},
                sunday: {total: 0, discount: 0, net_total: 0, orders: []}
            },
        };
        const arrangedOrder = {
            id: order.id,
            food_id: order.food_id,
            extra_id: order.extra_id,
            name: order.name,
            price: order.price,
            discount: order.discount,
            user_price: order.price - order.discount,
            createdAt: order.createdAt
        };

        const dayOfWeek = dateHelper.getDayOfWeek(order.createdAt);
        ordersOfWeek.weekDays[dayOfWeek].orders.push(arrangedOrder);

        if(previousUsername === ordersOfWeek.username) ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].weekDays[dayOfWeek].orders.push(arrangedOrder);
        else ordersWeekArray.orders.push(ordersOfWeek);

        ordersWeekArray.total += arrangedOrder.price;
        ordersWeekArray.discount += arrangedOrder.discount;
        ordersWeekArray.net_total += arrangedOrder.user_price;

        ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].total += arrangedOrder.price;
        ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].discount += arrangedOrder.discount;
        ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].net_total += arrangedOrder.user_price;

        ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].weekDays[dayOfWeek].total += arrangedOrder.price;
        ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].weekDays[dayOfWeek].discount += arrangedOrder.discount;
        ordersWeekArray.orders[ ordersWeekArray.orders.length - 1 ].weekDays[dayOfWeek].net_total += arrangedOrder.user_price;

        previousUsername = order.username;
    });
    
    return ordersWeekArray;
}

function getTodaysOrdersArray(orders) {
    const todaysUserOrders = {
        total: 0,
        discount: 0,
        net_total: 0,
        orders: {
            foods: [],
            extras: [],
        }
    };

    orders.forEach(order => {
        const arrangedOrder = {
            id: order.id,
            name: order.name,
            price: order.price,
            discount: order.discount,
            user_price: order.price - order.discount,
            createdAt: order.createdAt
        };
        if(order.food && order.food.short_name) arrangedOrder.short_name = order.food.short_name;

        if(order.food_id) {
            arrangedOrder.food_id = order.food_id;
            todaysUserOrders.orders.foods.push(arrangedOrder);
        }
        else {
            arrangedOrder.extra_id = order.extra_id;
            todaysUserOrders.orders.extras.push(arrangedOrder);
        }

        todaysUserOrders.total += arrangedOrder.price;
        todaysUserOrders.discount += arrangedOrder.discount;
        todaysUserOrders.net_total += arrangedOrder.user_price;
    });
    
    return todaysUserOrders;
}

function getTodaysOrdersByUsersArray(orders) {
    const todaysOrdersArray = {total: 0, discount: 0, net_total: 0, orders: []};
    let previousUsername = null;

    orders.forEach(order => {
        const arrangedOrder = {
            id: order.id,
            food_id: order.food_id,
            extra_id: order.extra_id,
            name: order.name,
            price: order.price,
            discount: order.discount,
            user_price: order.price - order.discount,
            createdAt: order.createdAt
        };
        const userOrders = {
            username: order.user.username,
            total: 0,
            discount: 0,
            net_total: 0,
            orders: [arrangedOrder]
        }

        if(previousUsername === userOrders.username) todaysOrdersArray.orders[ todaysOrdersArray.orders.length - 1 ].orders.push(arrangedOrder);
        else todaysOrdersArray.orders.push(userOrders);

        todaysOrdersArray.total += arrangedOrder.price;
        todaysOrdersArray.discount += arrangedOrder.discount;
        todaysOrdersArray.net_total += arrangedOrder.user_price;

        todaysOrdersArray.orders[ todaysOrdersArray.orders.length - 1 ].total += arrangedOrder.price;
        todaysOrdersArray.orders[ todaysOrdersArray.orders.length - 1 ].discount += arrangedOrder.discount;
        todaysOrdersArray.orders[ todaysOrdersArray.orders.length - 1 ].net_total += arrangedOrder.user_price;

        previousUsername = order.user.username;
    });
    
    return todaysOrdersArray;
}