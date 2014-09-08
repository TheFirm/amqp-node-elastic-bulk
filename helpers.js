var tools = {};

module.exports = tools;

var fs = require('fs');

var CONST = {
    CONFIG_PATH: 'configs/config.json'
};

/**
 * Converts AMQP message string to ElasticSearch Bulk format
 * @param {String} str AMQP message
 * @returns {Array} Array of json objects
 */
tools.fromAmqpJSONToElasticBulkFormat = function (str) {
    var jsonObj = JSON.parse(str);
    var elasticBulkAction = {
        _index: jsonObj._index,
        _type: jsonObj._type,
        _id: jsonObj._id
    };
    var elasticBulkData = jsonObj.data;

    return [
        {index: elasticBulkAction},
        elasticBulkData
    ];
};

tools.checkConfigExist = function () {
    fs.exists(CONST.CONFIG_PATH, function(exists) {
        if (!exists) {
            console.log('Missing config.json file, copy it from config-example.json');
            process.exit(-1);
        }
    });
};