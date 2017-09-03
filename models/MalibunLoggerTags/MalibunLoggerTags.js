/**
 * @property {string}
 * */
MalibunLoggerTagsModel = class MalibunLoggerTagsModel extends MalibunModel{

};

MalibunLoggerTags = new MalibunCollection('malibunLoggerTags',
{
    modelClass:MalibunLoggerTagsModel,
    permissions:{
        group:{
            [Roles.ROLE_ADMIN]:'rw',
        }
    },
});

/**
 * @method
 * @name MalibunLoggerTags#findOne
 * @param {object} selector - <p>A query describing the documents to find</p>
 * @returns MalibunLoggerTagsModel
 */


