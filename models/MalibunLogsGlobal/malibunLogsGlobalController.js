MalibunCollection.ready('malibunLogsGlobal', function () {
    MalibunLogsGlobalController = class MalibunLogsGlobalController extends MalibunController {
        constructor() {
            super(MalibunLogsGlobal);
            this.pagination = new Meteor.Pagination(this.collection, {
                itemTemplate: this.getTemplate('Row'),
                templateName: this.getTemplate('Index'),
                perPage: 10,
                sort:{created:1},
                auth: (skip, sub) => {
                    return this.collection.adminAuth(this.pagination, skip, sub);
                },
                table: {
                    class: "table",
                    header: [
                        this.collection.schema.label('message'),
                        this.collection.schema.label('created'),
                        this.collection.schema.label('tag'),
                        this.collection.schema.label('level'),
                        this.collection.schema.label('server_id'),
                        this.collection.schema.label('worker_id'),
                        this.collection.schema.label('dataString'),

                    ],
                    wrapper: "table-wrapper"
                },
                availableSettings: {
                    sort: true,
                    filters: true
                },
                paginationMargin:10
            });
        }

        actionIndex() {
            var controller = this;
            return super.actionIndex().extends({
                waitOn(){
                    return [ MalibunLoggerTags.subscribe() ];
                },
                data() {
                    return {
                        queryFilters:[{
                                id: `tag`,
                                label: MalibunLogsGlobal.schema.label('tag'),
                                type: 'string',
                                input:'select',
                                values:_.pluck( MalibunLoggerTags.find().fetch(), 'name')
                            },{
                                id: `level`,
                                label: MalibunLogsGlobal.schema.label('level'),
                                type: 'integer',
                                input:'select',
                                values:(function(){
                                    var result = {};
                                    _.each(MalibunLogger.levels,function (levelName,level) {
                                        result[level] = levelName;
                                    });
                                    return result;
                                }).call()
                            },{
                                id: `message`,
                                label: MalibunLogsGlobal.schema.label('message'),
                                type: 'string'
                            },{
                                id: `dataString`,
                                label: MalibunLogsGlobal.schema.label('dataString'),
                                type: 'string'
                            },{
                                id: `server_id`,
                                label: MalibunLogsGlobal.schema.label('server_id'),
                                type: 'string'
                            },{
                                id: `worker_id`,
                                label: MalibunLogsGlobal.schema.label('worker_id'),
                                type: 'integer'
                            },{
                                id: `user_id`,
                                label: MalibunLogsGlobal.schema.label('user_id'),
                                type: 'string'
                            },
                                new DateQuery({
                                    mode:DateQuery.Mode.datetime.key,
                                    id:`DATETIME(created)`,
                                    label:`DATETIME(created)`
                                }).filter()
                        ]
                    }
                },
                title: 'Просмотр глобальных логов',
                rendered(){
                    controller.pagination.requestPage(1);
                },
                helpers:{
                    [this.getTemplate('index')]:{
                        querybuilderData(){
                            var updatePagination = _.throttle(function (builder) {
                                var rules = builder.queryBuilder('getRules');
                                if (rules) {
                                    var result = builder.queryBuilder('getMongo');
                                    controller.pagination.set({
                                        filters: result
                                    });
                                }
                            },2000);

                            return {
                                id:`builder_${generateRndString(20,20)}`,
                                changed(builder){
                                    updatePagination(builder);
                                },
                                rules:{},
                                filters: MalibunAction.data.queryFilters,
                                rendered(builder){
                                    updatePagination(builder);
                                }
                            };
                        }
                    },
                    malibunLogsRow:{
                        levelName(){
                            return MalibunLogger.levels[this.level];
                        }
                    }
                }
            });
        }

        actionView() {
            var controller = this;
            return super.actionView().extends({
                title: 'Глобальная запись "{model.message}"'
            });
        }

        actionCreate() {
            return null;
        }

        actionUpdate() {
            return null;
        }
    };

    malibunLogsGlobalController = new MalibunLogsGlobalController();
    malibunLogsGlobalController.init();
});