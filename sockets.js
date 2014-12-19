var io = require('socket.io').listen(3001);
var intel = new require('./logger');

var socketid_room = {};

io.sockets.on('connection', function (socket) {
    intel.getLogger('app').info('IO connection', socket.id);
    socketid_room[socket.id] = [];

    socket.on('disconnect', function () {
        intel.getLogger('app').info('IO disconect', socket.id);
        delete socketid_room[socket.id];
    });
    socket.on('typing', function (data) {
        data.s_id = socket.id;
        intel.getLogger('app').info("on typing", data, socket.id);

        if(isDefined(data.room_id)){
            socket.broadcast.to(getRoomNameById(data.room_id)).emit("typing", data);
        }
    });

    socket.on('info', function (data) {
        intel.getLogger('app').info("on info", data, socket.id);

        if(isDefined(data.room_id)){
            var drid = data.room_id;
            intel.getLogger('app').info("on info room_id #", drid);
            socket.join(getRoomNameById(drid));
            socketid_room[socket.id].push(drid);
        }
    });
});

function getRoomNameById(id){
    return 'room#'. id
}

function isDefined(obj){
    return typeof obj != 'undefined';
}

module.exports = io;