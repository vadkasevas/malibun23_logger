import { action } from 'meteor/malibun23:stack';

MalibunCollection.ready('malibunLogs', function () {
    MalibunLogsController = class MalibunLogsController extends MalibunController {
        constructor() {
            super(MalibunLogs);
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

        @action
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
                                label: MalibunLogs.schema.label('tag'),
                                type: 'string',
                                input:'select',
                                values:_.pluck( MalibunLoggerTags.find().fetch(), 'name')
                            },{
                                id: `level`,
                                label: MalibunLogs.schema.label('level'),
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
                                label: MalibunLogs.schema.label('message'),
                                type: 'string'
                            },{
                                id: `dataString`,
                                label: MalibunLogs.schema.label('dataString'),
                                type: 'string'
                            },{
                                id: `server_id`,
                                label: MalibunLogs.schema.label('server_id'),
                                type: 'string'
                            },{
                                id: `worker_id`,
                                label: MalibunLogs.schema.label('worker_id'),
                                type: 'integer'
                            },{
                                id: `user_id`,
                                label: MalibunLogs.schema.label('user_id'),
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
                title: 'Просмотр логов',
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

        @action
        actionView() {
            var controller = this;
            return super.actionView().extends({
                title: 'Просмотр записи лога "{model.message}"'
            });
        }

        @action
        actionCreate() {
            var controller = this;
            var template = this.getTemplate('_form');
            var formType = 'insert';
            var formId = this.name + formType;

            return super.actionCreate().extends({
                template: template,
                data(){
                    return {
                        formType: formType,
                        formId: formId,
                    }
                },
                title: 'Создать новый',
                hooks: {
                    [formId]: {
                        onSuccess(formType, result) {
                            Router.go(controller.getRoute('index'));
                        }
                    }
                }
            });
        }

        @action
        actionUpdate() {
            return null;
        }
    }

    malibunLogsController = new MalibunLogsController();
    malibunLogsController.init();
});