var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});

//var mqtt = require('mqtt')
//var client  = mqtt.connect('mqtt://test.mosquitto.org')

//client.on('connect', function () {
//	console.log("Connected to MQTT");
//})

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



app.get('/robot', function(req, res){
  res.sendFile(__dirname + '/robot.html');
});
io.on('connection', function (socket) {


    console.log('a user connected');

    socket.on('start', function () {
        console.log("Moving");
    });
    socket.on('end', function () {
        console.log("Stopped");
    });
    socket.on('move', function (force, angle) {
//        console.log(new Date().getTime()/1000 + '\t'+force + "\t"+ angle);
          socket.broadcast.emit('data', force, angle);
//	client.publish("homie/18fe34d4e680/robot/move/set", force +","+angle);
    });
});

http.listen(8000, function(){
  console.log('listening on *');
});
