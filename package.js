Package.describe({
    name: 'malibun23:logger',
    version: '0.0.36',
    summary: 'logger',
    git: 'https://github.com/vadkasevas/malibun23_logger',
    documentation: null
});

Npm.depends({
    "babel-plugin-transform-decorators-legacy": "1.3.4"
});

Package.onUse(function(api) {
    api.versionsFrom('1.2.1');

    api.use('ecmascript');
    api.use('underscore@1.0.9');
    api.use('mongo');
    api.use('templating', 'client');
    api.use('aldeed:simple-schema@1.5.3',['client','server']);
    api.use('aldeed:autoform@5.8.1','client');
    api.use('malibun23:stack@0.0.34');

    api.addFiles([
        'models/MalibunLoggerTags/client/_form.html',
        'models/MalibunLoggerTags/client/index.html',

        'models/MalibunLogs/client/index.html',
        'models/MalibunLogs/client/view.html',

        'models/MalibunLogsGlobal/client/index.html',
        'models/MalibunLogsGlobal/client/view.html',
        'client/prettyHelper.js'
    ],['client']);

    api.addFiles([
        'MalibunLogger.js',
        'models/MalibunLoggerTags/MalibunLoggerTags.js',
        'models/MalibunLoggerTags/schema.js',
        'models/MalibunLoggerTags/malibunLoggerTagsController.js',

        'models/MalibunLogs/MalibunLogs.js',
        'models/MalibunLogs/malibunLogsController.js',

        'models/MalibunLogsGlobal/MalibunLogsGlobal.js',
        'models/MalibunLogsGlobal/malibunLogsGlobalController.js'

    ]);
    api.addFiles(['server.js', 'models/MalibunLoggerTags/server/server.js'],['server']);
    api.export(['MalibunLoggerTags','MalibunLogs','MalibunLogsGlobal','MalibunLogger','malibunLogsController']);




});