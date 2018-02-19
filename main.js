/* Dette er kode der kører på webserveren */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*',  pingInterval: 5000, pingTimeout: 2500,});

//Listening port er port 80 fra web servers perspektiv
//Accepter også port fra enviroment variable
var listening_port = process.env.PORT || 80; 

// Her henter vi 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/robot', function(req, res){
  res.sendFile(__dirname + '/robot.html');
});

/*
Event når der åbnes en connection.
I denne implementation af koden vil vi modtage data fra klienten og printe det ud
med console.log() funktionen og sende det til alle connectede klienter 
*/
io.on('connection', function (socket) {
    //Debug
    console.log(socket.id + ": Connected");
	
    // io.engine.clientsCount indeholder antallet af aktive connections
    //Send til alle
    socket.broadcast.emit("user_count", io.engine.clientsCount); 
    
    //Hvis der disconnectes. skriv hvem der disconnectede 
    socket.on('disconnect', function () {
        console.log(socket.id + ": Disconnected");
        socket.broadcast.emit("user_count", io.engine.clientsCount);
    });
    
    // Hvis joysticket betjenes
    socket.on('start', function () {
        console.log(socket.id + ": Start");
        socket.broadcast.emit("start");
    });
	
    // Hvis joysticket slippes,
    socket.on('end', function () {
        console.log(socket.id + ": End");
        socket.broadcast.emit("end");
    });
	
    // Hvis joystickets position ændres, skriv hvorti
    socket.on('move', function (force, angle) {
        console.log(socket.id + ": Move",force,angle)
        socket.broadcast.emit('move', force, angle);
    });
});

http.listen(listening_port, '0.0.0.0', function(){
    console.log('listening on', listening_port);
});
