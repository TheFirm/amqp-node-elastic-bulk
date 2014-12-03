/**
 * Created by dmitrii on 03.12.14.
 */
var sendgrid  = require('sendgrid');
var config = require('./configs/config.json');

var client = sendgrid(config.sendgrid.user, config.sendgrid.pass);

var send = function (payload) {
    client.send(payload, function(err, json) {
        if (!err) return true;
    });
    return true;
};

module.exports = {
    send: send
};
