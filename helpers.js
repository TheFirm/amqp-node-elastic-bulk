var tools = {};

module.exports = tools;

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