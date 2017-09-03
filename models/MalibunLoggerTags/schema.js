MalibunLoggerTags.schema = new SimpleSchema({
    name:{type:String,label:'Имя',unique:true},
    'console.level':{
        type:Number,label:'Уровень логирования в консоль',optional:true,defaultValue:0,
            allowedValues:_.keys(MalibunLogger.levels ).map(function(k){return Number(k);}),
            autoform:{
                options:MalibunLogger.levels.map((levelName,level)=>{
                    return {label: levelName,value:level};
                })
            }
    },
    'mongo.level':{
        type:Number,label:'Уровень логирования в БД группы',optional:true,defaultValue:0,
        allowedValues:_.keys(MalibunLogger.levels ).map(function(k){return Number(k);}),
        autoform:{
            options:MalibunLogger.levels.map((levelName,level)=>{
                return {label: levelName,value:level};
            })
        }
    },
    'mongoGlobal.level':{
        type:Number,label:'Уровень логирования в БД глобальную',optional:true,defaultValue:0,
        allowedValues:_.keys(MalibunLogger.levels ).map(function(k){return Number(k);}),
        autoform:{
            options:MalibunLogger.levels.map((levelName,level)=>{
                return {label: levelName,value:level};
            })
        }
    },
});

