var socketio = require('socket.io')
 
// Listen on port 3636
var io = socketio.listen(3636)

io.sockets.on('connection', function (client) {
    // Broadcast a user's message to everyone else in the room
    client.on('send', function (data) {
        io.sockets.emit('message', data)
    }) 
})