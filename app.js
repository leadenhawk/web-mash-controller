var express = require('express');
var socket = require('socket.io');
var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;

// Setup JS event emitter
var event = new EventEmitter();

// Setup express app
var app = express();
var server = app.listen(4000, function(){
  console.log('listening on port 4000...');
});

// Express - serve front-end files
app.use(express.static('public')); //serves the files located in the public folder

// Socket Setup
var io = socket(server);
io.on('connection', function(socket){
  console.log("A Browser has connected to the socket; ID:",socket.id);

  // listen for pumpButtonPressed event
  socket.on('pumpButtonPressed',function(){
    console.log('Pump button pressed!');
    event.emit('PBP');
  });
});

/*
  //listen for events from front-end
  socket.on('chat',function(data){
    //this function describes what to do once event arrives
    io.sockets.emit('chat',data);//emit to all sockets (plural)
  });
});
*/

// Setup Johnny-five
var board = new five.Board();
board.on("ready", function() {
  console.log("Arduino is active!");

  // set physical pins on arduino
  var led = new five.Led(11);  // Arduino pin 11 - led (in place of pump)
  var ele = new five.Led(9);   // Arduino pin 9 - led (in place of element)
  var thermo = new five.Thermometer({
    controller: "DS18B20",
    pin: 10   //Arduino pin 10 - DS18B20
  });

  // J5 code - this reads the thermometer and stores it in variable temp
  thermo.on("change", function() {
    temp = this.celsius;

    // Socket.io code - this emits the temp
    io.sockets.emit('tempChange', temp);
  });

  var pumpState = false;
  event.on('PBP', function(){
    if (pumpState == true){
      pumpState = false;
      led.off();
      console.log('turn off pump');
    }
    else if (pumpState == false){
      pumpState = true;
      led.on();
      console.log('turn on pump');
    }
  });
});
