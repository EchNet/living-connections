var refreshReminders = require("./refreshReminders");
var async = require('async');


const processReminderHandle = new refreshReminders() ;

processReminderHandle.processReminders();