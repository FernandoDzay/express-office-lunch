const {Notification, Menu, User, Group, User_group, Setting, sequelize} = require('../configs/sequelize/models');
const moment = require('moment');


module.exports = {
    checkForBirhdays,
    dailyRemove,
    checkForBirhdaysFunction,
    dailyRemoveFunction,
    rotateGroups,
    dailyRotateGroupsFunction
};

async function checkForBirhdays(req, res, next) {
    try {
        const response = await checkForBirhdaysFunction();
        return res.json(response);
    } 
    catch(e) { return next(e); }
}

async function dailyRemove(req, res, next) {
    try {
        const response = await dailyRemoveFunction();
        return res.json(response);
    } 
    catch(e) { return next(e); }
}

async function rotateGroups(req, res, next) {
    try {
        const response = await dailyRotateGroupsFunction();
        return res.json(response);
    } 
    catch(e) { return next(e); }
}


// ------------------------------ Functions

async function checkForBirhdaysFunction() {
    console.log('----------------------------- EXECUTING CHECK FOR BIRTHDAYS -----------------------------');
    console.log(`Ejecutando cron a las: ${ moment().format() }`);

    const users = await User.findAll({where: {status: 1}});
    if(users.length === 0) return {status: 404, message: 'No se encontró ningún usuario activo', data: null};
    
    const currentYear = moment().format('YYYY');

    let todaysUsersBirthday = [];
    users.forEach(user => {

        const userMonth = user.birth_month < 10 ? `0${user.birth_month}` : user.birth_month;
        const userDay = user.birth_day < 10 ? `0${user.birth_day}` : user.birth_day;
        const userBirthday = moment(`${currentYear}-${userMonth}-${userDay}`).format('YYYY-MM-DD');
        const currentDay = moment().format('YYYY-MM-DD');

        if(currentDay === userBirthday) {
            const {id, username} = user;
            todaysUsersBirthday.push({id, username});
        }
        
    });

    if(todaysUsersBirthday.length === 0) return {status: 404, message: 'Hoy no cumple años ningún usuario', data: null};
    
    let description = 'Hoy es el cumpleaños de ';
    const notification = new Notification({title: 'Cumpleaños'});

    if(todaysUsersBirthday.length === 1) {
        description += todaysUsersBirthday[0].username + '. Felicítalo!';
        notification.description = description;
        await notification.sendAll();
    }

    else {
        todaysUsersBirthday.forEach((user, index) => {
            if( (index + 1) === todaysUsersBirthday.length ) description += `y ${user.username}`;
            else description += `${user.username}, `;
        });
        description += '. Felicítalos!';
        notification.description = description;
        await notification.save();
        await notification.sendAll(false);
    }

    const response = {status: 200, message: description, data: {users: todaysUsersBirthday, notification}}; 
    console.log(response);
    return response;
}

async function dailyRemoveFunction() {
    console.log('----------------------------- EXECUTING MENU DAILY REMOVE -----------------------------');
    console.log(`Ejecutando cron a las: ${ moment().format() }`);

    const menu = await Menu.findAll();
    if(menu.length === 0) return {status: 404, message: 'El menú ya está vacío'};

    menu.forEach(async food => await food.destroy());

    const response = {status: 200, message: 'El menú de hoy fue borrado'};
    console.log(response);
    return response;
}

async function dailyRotateGroupsFunction() {
    const setting = await Setting.findOne({where: {setting: 'groups_rotate'}});
    if(!setting) return {status: 500, message: 'No se ha configurado el menu_open'};
    if(setting.int_value === 0) return {status: 403, message: 'Se tiene configurado el sistema para no hacer una rotación de grupos'};

    console.log('----------------------------- EXECUTING GROUPS ROTATE -----------------------------');
    console.log(`Ejecutando cron a las: ${ moment().format() }`);

    const groups = await Group.findAll();
    if(groups.length === 0) return {status: 404, message: 'No hay ningún grupo'};

    const users_groups = await User_group.findAll();
    if(users_groups.length === 0) return {status: 404, message: 'No hay ningún grupo asignado'};

    const statement = 
    `
        UPDATE users_groups SET group_id = 
        CASE 
            WHEN group_id >= (SELECT id FROM \`groups\` ORDER BY id DESC LIMIT 1)
                THEN 1
            ELSE group_id + 1
        END;
    `;
    await sequelize.query(statement);

    const response = {status: 200, message: 'Los grupos fueron rotados con éxito'};
    console.log(response);
    return response;
}