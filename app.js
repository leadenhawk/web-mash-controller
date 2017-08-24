var express = require('express');
var socket = require('socket.io');

// Setup express app
var app = express();
var server = app.listen(4000, function(){
  console.log('listening to port 4000...');
});

// Static files
app.use(express.static('public')); //serves the files located in the public folder

// Socket Setup
var io = socket(server);

io.on('connection', function(socket){
  console.log("made socket connection",socket.id);
});
