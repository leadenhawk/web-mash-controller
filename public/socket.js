/*// Creating socket connection

// clear IP address input field...
document.getElementById("IP-text").value = "";

// connect button code to connect Socket...
var connectButton = document.getElementById('IP-button');
connectButton.addEventListener('click', function clickConnect(){
  var IPaddress = document.getElementById("IP-text").value;

  //make front-end connection **************************************************
  var socket = io.connect('http://192.168.1.'+IPaddress+':4000');
  socket.emit('connectButtonPressed'); //emits connectButtonPressed to server...

  socket.on('connectionMade', function(){ // once connectionMade received from server...
    document.getElementById("connect-text").innerHTML = "Socket connection made";
  });

  // Display actual temperature ************************************************
  socket.on('tempChange', function(temp){
    output.innerHTML = '<p><strong>Temp: '+ temp + '</p>';
  });
  // ***************************************************************************


  // Pump Button Code **********************************************************
  var pumpState = false;
  var pumpButton = document.getElementById('pumpButton');
  pumpButton.addEventListener('click', function(){
    socket.emit('pumpButtonPressed');
    togglePump(); //change the words on the pump button
  });

  // changes the words on the pump button
  function togglePump(){
    if (pumpState == false){
      pumpState = true;
      document.getElementById('pumpButton').innerHTML = "ON";
      return pumpState;
    } else if (pumpState == true) {
      pumpState = false;
      document.getElementById('pumpButton').innerHTML = "OFF";
      return pumpState;
    }
  }
  // ***************************************************************************

});
*/

// Socket Code *****************************************************************

//make front-end connection
var socket = io.connect('http://192.168.1.67:4000');

/*
// Query Dom
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    btn = document.getElementById('send'),
    output = document.getElementById('output');

// Emit events (send to server)
btn.addEventListener('click', function(){
  socket.emit('chat',{
    //this is the data that the server is listening for
    message: message.value,
    handle: handle.value
  });
});

// Listen for events
socket.on('chat', function(data){
  output.innerHTML += '<p><strong>'+data.handle+': </strong>'+data.message+'</p>';
});
*/

// Display actual temperature **************************************************
socket.on('tempChange', function(temp){
  //output.innerHTML = '<p><strong>Temp: '+ temp + '</p>';
  vueApp.temp = temp;
});
// *****************************************************************************
socket.on('outputUpdate', function(param){
  vueApp.outputPerCent = param;
});

// Pump Button Code ************************************************************
// var pumpState = false;
// var pumpButton = document.getElementById('pumpButton');
// pumpButton.addEventListener('click', function(){
//   socket.emit('pumpButtonPressed');
//   togglePump(); //change the words on the pump button
// });
//
// // changes the words on the pump button
// function togglePump(){
//   if (pumpState == false){
//     pumpState = true;
//     document.getElementById('pumpButton').innerHTML = "ON";
//     return pumpState;
//   } else if (pumpState == true) {
//     pumpState = false;
//     document.getElementById('pumpButton').innerHTML = "OFF";
//     return pumpState;
//   }
// }
// *****************************************************************************
