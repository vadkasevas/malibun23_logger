/**
 * @property {string} message
 * @property {string} tag
 * @property {string} level
 * @property {string} user_id
 * @property {object} data
 * @property {string} server_id
 *
 * */
MalibunLogsModel = class MalibunLogsModel extends MalibunModel{

};

MalibunLogs = new MalibunCollection('malibunLogs',{
    modelClass:MalibunLogsModel,
    permissions:{
        group:{
            [Roles.ROLE_ADMIN]:'rw',
        }
    }
});

/**
 * @method
 * @name MalibunLogs#findOne
 * @param {object} selector - <p>A query describing the documents to find</p>
 * @returns MalibunLogsModel
 */

MalibunLogs.schema = new SimpleSchema({
    message:{type:String,label:'Сообщение',optional:true,defaultValue:null},
    tag:{type:String,label:'Тэг',optional:true,defaultValue:null},
    level:{ type:Number,label:'Уровень',optional:true,defaultValue:0 },
    user_id:{type:String,optional:true,defaultValue:null,label:'Юзер'},
    dataString:{type:String,optional:true,defaultValue:null,label:'Дополнительное инфо'},
    server_id:{type:String,label:'Сервер',optional:true,defaultValue:null},
    worker_id:{type:Number,optional:true,defaultValue:null,label:'Воркер'},
    created:Schemas.created('Время создания'),
});

if(Meteor.isServer){
    MalibunLogs._ensureIndex({'message': 1});
    MalibunLogs._ensureIndex({'tag': 1});
    MalibunLogs._ensureIndex({'level': 1});
    MalibunLogs._ensureIndex({'user_id': 1});
    MalibunLogs._ensureIndex({'server_id': 1});
    MalibunLogs._ensureIndex({'worker_id': 1});
    MalibunLogs._ensureIndex({'created': 1});
}
/*
if(Meteor.isServer&&process.env.SHARED_MONGO_URL){
    MalibunLogsGlobal = new MalibunCollection('malibunLogs',{
        _suppressSameNameError:true,defineMutationMethods:false,
        modelClass:MalibunLogsModel,
        MONGO_URL : process.env.SHARED_MONGO_URL
    });
}*/











