var elasticsearch = require('elasticsearch');
var config = require('./configs/config.json');

var client = elasticsearch.Client(config.elastic);

/**
 * Send data to elasticsearch bulk API
 * @param {Array} body
 * @param {function} callback
 */
var indexBulk = function (body, callback) {
    client.bulk({
        body: body
    }, callback);
};

module.exports = {
    client: client,
    indexBulk: indexBulk
};

