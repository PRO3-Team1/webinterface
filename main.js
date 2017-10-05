var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});
var listening_port = process.env.PORT || 80;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/robot', function(req, res){
  res.sendFile(__dirname + '/robot.html');
});

io.on('connection', function (socket) {
    console.log(socket.id + ": Connected");
    
    socket.emit("user_count", io.engine.clientsCount);
    
    socket.on('disconnect', function () {
        console.log(socket.id + ": Disconnected");
        socket.broadcast.emit("user_count", io.engine.clientsCount);
    });
    
    socket.on('start', function () {
        console.log(socket.id + ": Moving");
         socket.broadcast.emit("move");
    });
    socket.on('end', function () {
        console.log(socket.id + ": Stopped");
        socket.broadcast.emit("stop");
    });
    socket.on('move', function (force, angle) {
          socket.broadcast.emit('data', force, angle);
    });
});

http.listen(listening_port, '0.0.0.0', function(){
  console.log('listening on', listening_port);
});
