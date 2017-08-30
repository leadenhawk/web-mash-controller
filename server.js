var DEBUG = true;

var express = require('express');
var socket = require('socket.io');
var five = require('johnny-five');
var EventEmitter = require('events').EventEmitter;

// A function I wrote that does the same as the Arduino millis() function
function millis() {
  var d = new Date();
  var n = d.getTime();
  return n;
}

var temp = 0;
var setTemp = 0;

// Setup JS event emitter
var event = new EventEmitter();

// Setup express app
var app = express();

// start the server
var server = app.listen(4000, function(){
  console.log('Server started, listening on port 4000...');
});

// Express - serve front-end files
app.use(express.static('public')); //serves the files located in the public folder

// Socket.io Setup & functionality
var io = socket(server);
io.on('connection', function(socket){
  console.log("A Browser has connected to the socket; ID:",socket.id);


  // listen for pumpButtonPressed event
  // socket.on('pumpButtonPressed',function() {
  //   if ( DEBUG ) { console.log('Pump button pressed!') };
  //   event.emit('PBP');
  // });

  socket.on('pumpOnButtonPressed',function() {
    if ( DEBUG ) { console.log('Pump ON button pressed!') };
    event.emit('turnPumpOn');
  });
  socket.on('pumpOffButtonPressed',function() {
    if ( DEBUG ) { console.log('Pump OFF button pressed!') };
    event.emit('turnPumpOff');
  });

  socket.on('inputTempChanged', function(param){
    if ( DEBUG ) { console.log('Set temp is now ' + param +' deg C')};
    setTemp = param;
    // event.emit('newSetTemp',setTemp);
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

// Johnny-five Setup & functionality
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

  // initialised the pump as off
  //var pumpState = false;

  // EventEmitter & J5 code - toggles the pump
  // event.on('PBP', function(){
  //   if (pumpState == true){
  //     pumpState = false;
  //     led.off();
  //     if ( DEBUG ) { console.log('turn off pump') };
  // }
  //   else if (pumpState == false){
  //     pumpState = true;
  //     led.on();
  //     if ( DEBUG ) { console.log('turn on pump') };
  //   }
  // });
  event.on('turnPumpOn', function(){
    led.on();
    if ( DEBUG ) { console.log('turn on pump') };
  });
  event.on('turnPumpOff', function(){
    led.off();
    if ( DEBUG ) { console.log('turn off pump') };
  });
  // Conversion from Brett Beauregard's PID tutorials
   // On/Off & Initialization tutorials not implemented(!)
   // Direction tutorial not implemented as not relevant

   // Ready to implement Proportional on Measurement
   // http://brettbeauregard.com/blog/2017/06/proportional-on-measurement-the-code/

   // variables
   var lastTime = millis();
   var Input, Output, Setpoint;
   var outputSum = 0, lastInput = 0;
   var kp, ki, kd;
   var SampleTime;
   var outMin, outMax;


   // Setup
   SetSampleTime(500);
   SetTunings(7500, 75, 0);

   //console.log(kp, kd, ki);
   var WindowSize = 5000;
   windowStartTime = millis();
   SetOutputLimits(0, WindowSize);


   // PID code
   function Compute() {
     if ( temp != undefined ) {
       //nathan added this to convert the Brett Beauregard code with existing code
       var Setpoint = setTemp;
       Input = temp;
       //console.log("temp: ", temp);
       //console.log("Setpoint: ", Setpoint);
       //console.log("Input: ", Input);


       // How long since we lasat calculated
       var now = millis();
       var timeChange = now - lastTime;
       //console.log("timeChange: ",timeChange);

       if(timeChange>=SampleTime) {
         // Compute all the working error variables
         var error = Setpoint - Input;
         //console.log("error: ", error);
         var dInput = (Input - lastInput);
         //console.log("Input: ", Input);
         //console.log("lastInput: ", lastInput);
         outputSum += (ki * error);
         //console.log("outputSum-ki: ", outputSum);

         // Compute PID Output
         outputSum -= kp * dInput;
         //console.log("kp: ", kp);
         //console.log("dInput: ", dInput);
         //console.log("outputSum-kp: ", outputSum);

         if ( outputSum > outMax ) { outputSum = outMax; }
         else if ( outputSum < outMin ) { outputSum = outMin; }

         // Compute Rest of PID Output
         Output = outputSum - kd * dInput;
         console.log("Output: ", Output);
         var outputPerCent = ((Output / WindowSize)*100);
         io.sockets.emit('outputUpdate', outputPerCent);

         if ( Output > outMax ) { Output = outMax; }
         else if ( Output < outMin ) { Output = outMin; }

         //Remember some variables for next time
         lastInput = Input;
         lastTime = now;
       }
     }
   }

   var Kp;
   var Ki;
   var Kd;

   function SetTunings(Kp, Ki, Kd) {
     var SampleTimeInSec = (SampleTime)/1000;
     kp = Kp;
     ki = Ki * SampleTimeInSec;
     kd = Kd / SampleTimeInSec;
   }

   var NewSampleTime;
   function SetSampleTime(NewSampleTime){
     if (NewSampleTime > 0) {
       var ratio  = NewSampleTime / SampleTime;
       ki *= ratio;
       kd /= ratio;
       SampleTime = NewSampleTime;
     }
   }

   var Min, Max;
   function SetOutputLimits(Min, Max){
     if ( Min > Max ) return;
     outMin = Min;
     outMax = Max;

     if ( Output > outMax ) { Output = outMax; }
     else if ( Output < outMin ) { Output = outMin; }

     if ( outputSum > outMax ) { outputSum = outMax; }
     else if ( outputSum < outMin ) { outputSum = outMin; }
   }


   //This is the function that calls the PID
   setInterval(function() {
     // call the PID code
     Compute();

   }, SampleTime);

   //This is the function that controls the relay
   setInterval(function() {
     // call the PID code
     //Compute();

     // turn the element on/off based on pid output (taken from Arduino PID RelayOutput Example)
     var now = millis();

     if ( now - windowStartTime > WindowSize ) { //time to shift the Relay Window
       windowStartTime += WindowSize;
     }

     if ( Output > now - windowStartTime ) {
       ele.on();       // turn on the element!
       //if ( DEBUG ) { console.log('element on') };
     } else {
       ele.off();       // turn off the element!
       //if ( DEBUG ) { console.log('element off') };
     }
   }, WindowSize);



});
