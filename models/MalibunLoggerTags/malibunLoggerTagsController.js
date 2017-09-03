MalibunCollection.ready('malibunLoggerTags', function () {
    MalibunLoggerTagsController = class MalibunLoggerTagsController extends MalibunController {
        constructor() {
            super(MalibunLoggerTags);
            this.pagination = new Meteor.Pagination(this.collection, {
                itemTemplate: this.getTemplate('Row'),
                templateName: this.getTemplate('Index'),
                perPage: 10,
                auth: (skip, sub) => {
                    return this.collection.adminAuth(this.pagination, skip, sub);
                },
                table: {
                    class: "table",
                    //fields: [],
                    header: [
                        this.collection.schema.label('name'),
                    ],
                    wrapper: "table-wrapper"
                },
                availableSettings: { sort: true,filters: true },

            });
        }

        actionIndex() {
            var controller = this;
            return super.actionIndex().extends({
                waitOn: function () {
                    return []
                },
                data: function () {
                },
                title: 'Тэги логирования',
                rendered(){
                    controller.pagination.requestPage(1);
                }
            });
        }

        actionView() {
            return null;
        }

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
                title: 'Создать новый тэг логирования',
                hooks: {
                    [formId]: {
                        onSuccess(formType, result) {
                            Router.go(controller.getRoute('index'));
                        }
                    }
                }
            });
        }

        actionUpdate() {
            var controller = this;
            var template = this.getTemplate('_form');
            var formType = 'update';
            var formId = this.name + formType;

            return super.actionUpdate().extends({
                template: template,
                data(){
                    return {
                        formType: formType,
                        formId: formId,
                        model: controller.collection.findOne(this.params._id)
                    }
                },
                title: 'Изменить "{model.name}"',
                hooks: {
                    [formId]: {
                        onSuccess(formType, result) {
                            Router.go(controller.getRoute('index'));
                        }
                    }
                }
            });
        }
    };

    malibunLoggerTagsController = new MalibunLoggerTagsController();
    malibunLoggerTagsController.init();
});