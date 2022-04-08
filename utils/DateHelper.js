const moment = require('moment');

module.exports = class DateHelper {

    static getMondayDate(date) {
        const currentMonday = moment().startOf('isoweek').format();
        if(date === undefined) return currentMonday;

        const monday = moment(date);
        if(!monday.isValid()) return currentMonday;
        return monday.startOf('isoweek').format();
    }

    static getSundayLastTime(date = undefined) {
        if(date === undefined) return moment().endOf('week').format();
        return moment(date).endOf('week').format(); 
    }

    static getLastWeekMonday() {
        return moment().startOf('week').subtract(7, 'day').format();
    }

    static getDayOfWeek(date) {
        const daysOfWeek = [undefined, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const weekDayNumber = moment(date).format('E');
        return daysOfWeek[weekDayNumber];
    }

    static getTodaysInitialTime() {
        return moment().startOf('day').format();
    }

    static getTodaysEndTime() {
        return moment().endOf('day').format();
    }


}