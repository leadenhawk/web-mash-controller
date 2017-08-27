// Socket Code *******************************************************************

//make front-end connection
var socket = io.connect('http://192.168.1.100:4000');

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

socket.on('tempChange', function(temp){
  output.innerHTML = '<p><strong>Temp: '+ temp + '</p>';
});

// Pump Button Code
var pumpOn = false;
var pumpButton = document.getElementById('pumpButton');
pumpButton.addEventListener('click', function(){
  socket.emit('pumpButtonPressed');
    /*if (pumpOn == false){
      pumpOn != pumpOn;
      console.log(pumpOn);
      console.log("ON")
      pumpButton.innerHTML = "<p>Pump ON</p>";
    }
    else if (pumpOn == true){
      pumpOn != pumpOn;
      console.log(pumpOn);
      console.log("OFF");
      pumpButton.innerHTML = "<p>Pump OFF</p>";
    }*/

});
