Meteor.afterStartup(function(){
    var date = new Date(getNowTime()-2*24*3600*1000);

    MalibunLogs.remove({
        created:{$lte:date},
        level:{$lt:MalibunLogger.ERROR}
    });

    MalibunLogsGlobal.remove({
        created:{$lte:date},
        level:{$lt:MalibunLogger.ERROR}
    });
});