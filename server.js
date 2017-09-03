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
var manPercent = 0;
var elementState = 0;
var inAuto = 1;
var pumpState = 0;

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

  socket.on('pumpOnButtonPressed',function() {  //listen for pump on button press from the socket
    if ( DEBUG ) { console.log('Pump ON button pressed!') };
    event.emit('turnPumpOn'); //emit turn pump on to J5
    io.sockets.emit('pumpOnButtonPressed');//emit received message back down ALL sockets
  });
  socket.on('pumpOffButtonPressed',function() {
    if ( DEBUG ) { console.log('Pump OFF button pressed!') };
    event.emit('turnPumpOff');
    io.sockets.emit('pumpOffButtonPressed');
  });


  socket.on('inputTempChanged', function(param){
    if ( DEBUG ) { console.log('Set temp is now ' + param +' deg C')};
    setTemp = param;
    io.sockets.emit('inputTempChanged', param);
  });
  socket.on('inputPercentChanged', function(param){
    if ( DEBUG ) { console.log('Set output is now ' + param +' %')};
    manPercent = param;
    io.sockets.emit('inputPercentChanged', param);
  });


  socket.on('elementLivePressed', function(){
    if ( DEBUG ) { console.log('Element Live')};
    elementState = 1;
    io.sockets.emit('elementLivePressed');
  });

  socket.on('elementOffPressed', function(){
    if ( DEBUG ) { console.log('Element Not Live')};
    elementState = 0;
    event.emit('turnElementOff');
    io.sockets.emit('elementOffPressed');
  });


  socket.on('mashModeActive', function(){
    inAuto = 1;
    io.sockets.emit('mashModeActive');
  });

  socket.on('boilModeActive', function(){
    inAuto = 0;
    io.sockets.emit('boilModeActive');
  });

  // Initilise all sockets with current hardware states
  socket.on('initilise', function(){
    if (inAuto === 1){
      io.sockets.emit('mashModeActive');
    }
    else if (inAuto === 0){
      io.sockets.emit('boilModeActive');
    };
    if (elementState === 1){
      io.sockets.emit('elementLivePressed');
    }
    else if (elementState === 0){
      io.sockets.emit('elementOffPressed');
    };
    if (pumpState === 1){
      io.sockets.emit('pumpOnButtonPressed');
    }
    else if (pumpState === 0){
      io.sockets.emit('pumpOffButtonPressed');
    };
    io.sockets.emit('inputTempChanged', setTemp);
    io.sockets.emit('inputPercentChanged', manPercent);
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
    pumpState = 1;
    led.on();
    if ( DEBUG ) { console.log('turn on pump') };
  });
  event.on('turnPumpOff', function(){
    pumpState = 0;
    led.off();
    if ( DEBUG ) { console.log('turn off pump') };
  });

  // this event atually controls the element
  event.on('turnElementOn', function(param){
    if (elementState == 1) {
      //if ( DEBUG ) { console.log("element Live"); }
      io.sockets.emit('elementOn');
      ele.on();
    } else {
      //if ( DEBUG ) { console.log("element Inactive"); }
      io.sockets.emit('elementOff');
      ele.off();
    }
  });
  event.on('turnElementOff', function(){
    //if ( DEBUG ) { console.log("turn element off"); }
    io.sockets.emit('elementOff');
    ele.off();
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
   var Kp = 7500, Ki = 75, Kd = 0;

   // Setup
   SetSampleTime(50);
   SetTunings(Kp, Ki, Kd);

   //console.log(kp, kd, ki);
   var WindowSize = 5000;
   windowStartTime = millis();
   SetOutputLimits(0, WindowSize);

   // PID code
   function Compute() {
     if(!inAuto) return; // doesn't calc PID when in manual mode
     if(elementState == 0) return; //turns off the PID calcs when the master switch is off
     if ( temp != undefined ) {
       //nathan added this to convert the Brett Beauregard code with existing code
       var Setpoint = setTemp;
       Input = temp;

       // How long since we last calculated
       var now = millis();
       var timeChange = now - lastTime;
       if ( timeChange >= SampleTime ) {

         // Compute all the working error variables
         var error = Setpoint - Input;
         var dInput = (Input - lastInput);

         // Compute I Output
         outputSum += (ki * error);

         // Compute P Output
         outputSum -= kp * dInput;
         if ( outputSum > outMax ) { outputSum = outMax; }
         else if ( outputSum < outMin ) { outputSum = outMin; }

         // Compute D Output and sum PID Output
         Output = outputSum - kd * dInput;
         //console.log("Output: ", Output);
         if ( Output > outMax ) { Output = outMax; }
         else if ( Output < outMin ) { Output = outMin; }

         var outputPercent = ((Output / WindowSize)*100);
         io.sockets.emit('outputUpdate', outputPercent);

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




   // This function is for controlling the element in Manual mode
   function manualMode() {
     if(inAuto) return;
     Output = manPercent * ( WindowSize / 100 );
     var outputAsPercent = (Output / WindowSize)*100;
     io.sockets.emit('outputUpdate', outputAsPercent);

   }

   //This is the function that calls the (PID & manual) code and controls the relay

   /*First we decide on a window size (5000mS say.) We then
    * set the pid to adjust its output between 0 and that window
    * size.  Lastly, we add some logic that translates the PID
    * output into "Relay On Time" with the remainder of the
    * window being "Relay Off Time"*/

    setInterval(function() {
      // only 1 of the following will actually run
      Compute();     // call the PID mode code
      manualMode();  // call the Manual mode code

     // turn the element on/off based on pid output (taken from Arduino PID RelayOutput Example)
     var now = millis();

     if ( now - windowStartTime > WindowSize ) { //time to shift the Relay Window
       windowStartTime += WindowSize;
     }

     if ( Output > now - windowStartTime ) {
       event.emit('turnElementOn'); // turn on the element!
     } else {
       event.emit('turnElementOff');
     }
   }, SampleTime);



});
