// Create front-end socket connection
var socket = io.connect('http://192.168.1.100:4000');

// Display actual temperature **************************************************
socket.on('tempChange', function(temp){
  //output.innerHTML = '<p><strong>Temp: '+ temp + '</p>';
  vueApp.temp = temp;
});
// *****************************************************************************
socket.on('outputUpdate', function(param){
  vueApp.outputPercent = param;
});

// *****************************************************************************
socket.on('elementOn', function(){
  vueApp.elementStatus = "ON";
  vueApp.elementStyle.backgroundColor = colours.brightgreen;
});

socket.on('elementOff', function(){
  vueApp.elementStatus = "OFF";
  vueApp.elementStyle.backgroundColor = colours.brightred;
});

// Pump On Button
socket.on('pumpOnButtonPressed',function(){ //listen for pump on button event from server (which originated from front-end)
  vueApp.changePumpOnButtonStyle(); //change button style
  vueApp.pumpStatus = "Pump ON"; //change pump status
});

// Pump Off Button
socket.on('pumpOffButtonPressed',function(){
  vueApp.changePumpOffButtonStyle();
  vueApp.pumpStatus = "Pump OFF";
});

// Send input temp button
socket.on('inputTempChanged', function(param){
  vueApp.sentInputTemp = param;
  vueApp.inputTemp = "";
});

// Send input percent button
socket.on('inputPercentChanged',function(param){
  vueApp.sentInputPercent = param;
  vueApp.inputPercent = '';
});

// Element Active/Live button
socket.on('elementLivePressed',function(){
  vueApp.changeElementLiveButtonStyle();
  vueApp.elementLiveStatus = "Live";
});

// Element Not Live button
socket.on('elementOffPressed',function(){
  vueApp.changeElementOffButtonStyle();
  vueApp.elementLiveStatus = "Not Live";
});

// Mash Mode button
socket.on('mashModeActive', function(){
  vueApp.mode = "Mash";
  vueApp.changeMashModeButtonStyle();
});

// Boil Mode button
socket.on('boilModeActive', function(){
  vueApp.changeBoilModeButtonStyle();
  vueApp.mode = "Boil";
});

socket.on('updateTemp', function(param){
  vueApp.sentInputTemp = param;
});
socket.on('updatePercent', function(param){
  vueApp.sentInputPercent = param;
});

// PID values on init
socket.on('PValue', function(param){
  vueApp.PvalueSet = param;
});
socket.on('IValue', function(param){
  vueApp.IvalueSet = param;
});
socket.on('DValue', function(param){
  vueApp.DvalueSet = param;
});
socket.on('windowSizeValue',function(param){
  vueApp.windowSizeValueSet = param;
});

// PID calc
socket.on('error', function(param){});
socket.on('dInput', function(param){});
