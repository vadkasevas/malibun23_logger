Template.registerHelper('prettyJson', function (jsonString) {
    try{
        var json = JSON.parse(jsonString);
        if(_.isEmpty(json))
            return '';
        return pretty(json,4,'HTML');
    }
});