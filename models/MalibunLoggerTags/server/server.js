Meteor.afterStartup(()=>{
    MalibunLogger.registerTags([
        MalibunLogger.TAG_SYSTEM
    ]);
});