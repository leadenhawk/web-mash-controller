var express = require('express');

// Setup express app
var app = express();
var server = app.listen(4000, function(){
  console.log('listening to port 4000...');
});

// Static files
app.use(express.static('public'));
