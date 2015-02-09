var intel = new require('../logger');
var config = require('../configs/config.json').sockets;
var io = require('socket.io').listen(config.port);

var socketid_room = {};

io.set('force new connection', true);
io.set('transports', [
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
    , 'polling'
]);

io.sockets.on('connection', function (socket) {
    intel.getLogger('app').info('IO connection', socket.id);
    socketid_room[socket.id] = [];

    socket.on('disconnect', function () {
        intel.getLogger('app').info('IO disconect', socket.id);
        delete socketid_room[socket.id];
    });

    socket.on('typing', function (data) {
        data.s_id = socket.id;
        intel.getLogger('app').info("on typing in room " + data.room_id, data, socket.id);

        if(isDefined(data.room_id)){
            socket.broadcast.to(getRoomNameById(data.room_id)).emit("typing", data);
        }
    });

    socket.on('info', function (data) {
        intel.getLogger('app').info("on info", data, socket.id);

        if(isDefined(data.room_id)){
            intel.getLogger('app').info("on info room_id #", data.room_id);
            socket.join(getRoomNameById(data.room_id));
            socketid_room[socket.id].push(data.room_id);
        }
    });
});

function getRoomNameById(id) {
    return 'room#'+ id
}

function isDefined(obj) {
    return typeof obj != 'undefined';
}

module.exports = io;