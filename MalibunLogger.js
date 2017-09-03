MalibunLoggerClass = class MalibunLoggerClass{
    constructor(){
        this.tags = {};
        var self = this;
        MalibunCollection.ready('malibunLoggerTags',function(){
            MalibunLoggerTags.find().observeChanges({
                added(id){
                    var model = MalibunLoggerTags.findOne({_id:id});
                    self.tags[model.name] = model;
                },
                changed(id){
                    var model = MalibunLoggerTags.findOne({_id:id});
                    self.tags[model.name] = model;
                },
                removed(id){
                    _.each(_.keys(self.tags),function(name){
                        if(self.tags[name]._id==id)
                            delete self.tags[name];
                    });
                }
            });
        });
    }

    getHandlers(tagName,level=MalibunLogger.TRACE){
        var model = this.tags[tagName];
        if(!model)
            return { 'console':true,'mongo':true,mongoGlobal:true};

        return {
            console:safeGet(model,`console.level`,0)<=level,
            mongo:safeGet(model,`mongo.level`,0)<=level,
            mongoGlobal:safeGet(model,`mongoGlobal.level`,0)<=level,
        };
    }

    log(tagName,level,message,data=null,user_id=null){
        if(!tagName)
            tagName = MalibunLogger.TAG_SYSTEM;
        var handlers = this.getHandlers(tagName,level);
        var created = new Date();

        return meteorAsync.seqNew([
            function consolelog(h,cb){
                if(handlers.console){
                    var args = [message];
                    if(data)
                        args.push(data);
                    console.log.apply(console.log,args);
                }
                cb(null,null);
            },
            function mongolog(h,cb){
                if(!handlers.mongo)
                    return cb(null,null);
                var ready = function() {
                    MalibunLogs.insert({
                        tag: tagName,
                        level: level,
                        user_id: user_id,
                        message: message,
                        dataString: data ? JSON.stringify(data) : null,
                        server_id: typeof MalibunServers != 'undefined' ? safeGet(MalibunServers.current(), '_id', null) : null,
                        worker_id: typeof Cluster != 'undefined' ? Cluster.workerId() : null,
                        created: created
                    });
                    return cb(null,null);
                };
                if(typeof MalibunLogs=='undefined'){
                    MalibunCollection.ready('malibunLogs',ready);
                }else{
                    ready();
                }
            },
            function mongogloballog(h,cb){
                if(!handlers.mongoGlobal||typeof MalibunLogsGlobal=='undefined')
                    return cb(null,null);
                MalibunLogsGlobal.insert({
                    tag: tagName,
                    level: level,
                    user_id: user_id,
                    message: message,
                    dataString: data ? JSON.stringify(data) : null,
                    server_id: typeof MalibunServers != 'undefined' ? safeGet(MalibunServers.current(), '_id', null) : null,
                    worker_id: typeof Cluster != 'undefined' ? Cluster.workerId() : null,
                    created: created
                });
            }
        ]);
    }

    logError(tagName,level,err){
        return this.log(tagName,level,err.message,{
            code:err.code||null,stack:err.stack||'',
        });
    }

    info(tagName,message,data=null,user_id=null){
        return this.log(tagName,MalibunLogger.INFO,message,data,user_id);
    }
    debug(tagName,message,data=null,user_id=null){
        return this.log(tagName,MalibunLogger.DEBUG,message,data,user_id);
    }
    error(tagName,message,data=null,user_id=null){
        return this.log(tagName,MalibunLogger.ERROR,message,data,user_id);
    }
    fatal(tagName,message,data=null,user_id=null){
        return this.log(tagName,MalibunLogger.FATAL,message,data,user_id);
    }
    warn(tagName,message,data=null,user_id=null){
        return this.log(tagName,MalibunLogger.WARN,message,data,user_id);
    }
    trace(tagName,message,data=null,user_id=null){
        return this.log(tagName,MalibunLogger.TRACE,message,data,user_id);
    }

    registerTags(names){
        MalibunCollection.ready('malibunLoggerTags',function(){
            _.each(names,function(name){
                if(!MalibunLoggerTags.findOne({name:name})){
                    MalibunLoggerTags.insert({
                        name:name,
                        console:{level:MalibunLogger.TRACE},
                        mongo:{level:MalibunLogger.TRACE},
                        mongoGlobal:{level:MalibunLogger.ERROR},
                    });
                }
            });
        });
    }
};

MalibunLogger = new MalibunLoggerClass();
MalibunLogger.TRACE = 0;
MalibunLogger.DEBUG = 1;
MalibunLogger.INFO = 2;
MalibunLogger.WARN = 3;
MalibunLogger.ERROR = 4;
MalibunLogger.FATAL = 5;
MalibunLogger.levels = [
    'TRACE','DEBUG','INFO','WARN','ERROR','FATAL'
];

if(Meteor.isServer) {
    process.on('uncaughtException', /**@param {Error} err*/function (err) {
        console.log('err:',err.stack);
        MalibunLogger.logError(MalibunLogger.TAG_SYSTEM, MalibunLogger.FATAL, err)
            .finally(()=>{
                process.exit(1);
            });
    });
}

MalibunLogger.TAG_SYSTEM = 'system';
