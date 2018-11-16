/**
 *Author: TaiGuangYin
 *Date: 2018
 *Description: 定期删除历史记录
 */

var schedule = require("node-schedule");
var reportModel = require('../models/report');

function task(){
    schedule.scheduleJob('00 30 * * * *', function() {
        reportModel.del();
    });
}

exports.task = task;
