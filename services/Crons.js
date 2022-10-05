const cron = require('node-cron');
const CronsController = require('../controllers/CronsController.js');

cron.schedule('0 0 2 * * *', CronsController.checkForBirhdaysFunction);

cron.schedule('0 0 2 * * *', CronsController.dailyRemoveFunction);

cron.schedule('0 0 2 * * *', CronsController.dailyRotateGroupsFunction);


// 0 0 6 * * ?  <-- Every day at 6am