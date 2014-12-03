"use strict";

var helpers = new require('./helpers');
helpers.checkConfigExist();

var config = require('./configs/config.json');
var amqp = new require('amqp');
var util = new require("util");
var elastic = new require('./elastic');
var intel = new require('./logger');
var sendGrid = new require('./sendGrid');

var countMessagesPerBulk = 0;
var messageBuffer = [];

//Time limit to flush messages to elasticsearch
// 5 sec in ms
var TIME_LIMIT_TO_FLUSH = 5000;

var connection = amqp.createConnection(config.amqp);

connection.on('ready', function () {
    intel.getLogger('app').info('connection: ready');
    // Use the default 'amq.topic' exchange
    connection.queue('toElastic', function (q) {

        q.bind('toElastic', function () {
            intel.getLogger('app').info('queue bounded to exchange');
        });

        // Receive messages
        q.subscribe({ack: true, prefetchCount: 1000}, function (message, headers, deliveryInfo, messageObject) {
            var str = message.data.toString();
            countMessagesPerBulk++;

            var elasticBulkMessage = helpers.fromAmqpJSONToElasticBulkFormat(str);
            elasticBulkMessage.forEach(function (item) {
                messageBuffer.push(item);
            });

            messageObject.acknowledge();
        });
    });
    // Send Email
    connection.queue('email', function(queue) {

        queue.bind('email');

        queue.subscribe({ack: true}, function(message) {
            var emailObject = JSON.parse(message.data.toString());

            if (sendGrid.send(emailObject)) {
                message.acknowledge();
                intel.getLogger('app').info('message send::' + emailObject.to);
            } else {
                intel.getLogger('app').error(emailObject);
            }

        });
    });
});

setInterval(sendBufferToElastic, TIME_LIMIT_TO_FLUSH);

function sendBufferToElastic(){
    if(bufferMessageEmpty()){
        return;
    }

    intel.getLogger('app').info('Bulk size: ' + countMessagesPerBulk);
    countMessagesPerBulk = 0;

    elastic.indexBulk(messageBuffer, function (err, resp) {
        if(err){
            intel.getLogger('elastic').error(err);
        }
    });

    messageBuffer = [];
}

function bufferMessageEmpty() {
    return messageBuffer.length === 0;
}

process.on('exit', function () {
    intel.getLogger('app').info("Closing...");
    if(connection){
        connection.disconnect();
    }
});


process.on('SIGINT', function() {
    process.exit();
});

process.on('uncaughtException', function(err) {
    intel.getLogger('app.errors').error(err);
});