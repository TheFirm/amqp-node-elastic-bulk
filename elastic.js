var elasticsearch = require('elasticsearch');

var client = elasticsearch.Client({
    host: 'localhost:9200'
});

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

