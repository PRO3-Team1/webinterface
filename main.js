/* Dette er kode der kører på webserveren */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, { origins: '*:*'});

// Listening port er port 80 fra web servers perspektiv
var listening_port = process.env.PORT || 80; 

// Her henter vi 
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/robot', function(req, res){
  res.sendFile(__dirname + '/robot.html');
});

/* Hvis der åbnes en connection.
   I denne implementation af koden vil vi modtage data fra klienten og printe det ud
   med console.log() funktionen, i den endelige implementation vil vi behandle dataen
   og omsætte det til hvor hurtigt de to larvebånd skal dreje rundt, og i hvilken retning */
io.on('connection', function (socket) {
    console.log(socket.id + ": Connected");
	
    // io.engine.clientsCount indeholder antallet af aktive connections
    socket.emit("user_count", io.engine.clientsCount); 
    
	// Hvis der disconnectes. skriv hvem der disconnectede og hvor mange der nu er tilbage
    socket.on('disconnect', function () {
        console.log(socket.id + ": Disconnected");
        socket.broadcast.emit("user_count", io.engine.clientsCount);
    });
    
	// Hvis joysticket betjenes, skriv hvem der betjener det
    socket.on('start', function () {
        console.log(socket.id + ": Moving");
         socket.broadcast.emit("move");
    });
	
	// Hvis joysticket slippes, skriv hvem der slap det
    socket.on('end', function () {
        console.log(socket.id + ": Stopped");
        socket.broadcast.emit("stop");
    });
	
	// Hvis joystickets position ændres, skriv hvortil
    socket.on('move', function (force, angle) {
          socket.broadcast.emit('data', force, angle);
    });
});

http.listen(listening_port, '0.0.0.0', function(){
  console.log('listening on', listening_port);
});
