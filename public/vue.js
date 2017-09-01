// Colours
var colours = {
  black: 'black',
  pink: 'pink',
  green: 'green',
  lightred: '#FF5C5C',
  basered: '#EB1C1C',
  midred: '#A40404',
  darkred: '#4B0000',
  lightgreen: '#BCEF56',
  basegreen: '#9BDB1A',
  midgreen: '#679904',
  darkgreen: '#2F4600',
  lightblue: '#3AA1A1',
  baseblue: '#118D8D',
  midblue: '#036262',
  darkblue: '#002D2D'
}

// Button Styles
var baseButton = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: 'purple',
  border: 'none',
  color: '#FFFFFF',
  textAlign: 'center',
  fontSize: '16px',
  padding: '10px',
  width: '100px',
  transition: 'all 0.5s',
  cursor: 'pointer',
  margin: '5px'
};

var darkgreenButton = baseButton;
var basegreenButton = baseButton;
var darkredButton = baseButton;
var baseredButton = baseButton;
darkgreenButton.backgroundColor = "black";
basegreenButton.backgroundColor = 'yellow';

var darkblueButton = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: colours.baseblue,
  border: 'none',
  color: '#FFFFFF',
  textAlign: 'center',
  fontSize: '16px',
  padding: '10px',
  width: '100px',
  transition: 'all 0.5s',
  cursor: 'pointer',
  margin: '5px'
};

var baseblueButton = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: colours.baseblue,
  border: 'none',
  color: '#FFFFFF',
  textAlign: 'center',
  fontSize: '16px',
  padding: '10px',
  width: '100px',
  transition: 'all 0.5s',
  cursor: 'pointer',
  margin: '5px'
};

// Vue code ********************************************************************
var vueApp = new Vue({
  el: '#vueApp',
  data: {
    message: 'Hello Vue!',
    counter: 0,
    pumpStatus: 'Pump OFF',
    show: true,
    temp: "n/a",
    inputTemp: 0,
    sentInputTemp: 0,
    inputPercent: 0,
    sentInputPercent: 0,
    elementActive: false,
    outputPerCent: 0,
    mode: "Mash",
    mash: true,
    elementStatus: "Element OFF",
    // onButtonIsOffStyle: darkgreenButton,
    buttonCol: 'red',
    pumpOnButtonStyle: darkgreenButton,
    pumpOffButtonStyle: darkredButton,
    elementLiveButtonStyle: darkgreenButton,
    elementOffButtonStyle: baseredButton,
    mashModeButtonStyle: baseblueButton,
    boilModeButtonStyle: darkblueButton,
    chartButtonStyle: darkblueButton,
    sendInputButtonStyle: darkblueButton
  },
  methods: {
    changeMessageMethod: function(){
      this.message = "Changed the Vue message!";
    },
    pumpOnClicked(){
      this.pumpStatus = "Pump ON";
      socket.emit('pumpOnButtonPressed');
    },
    pumpOffClicked(){
      this.pumpStatus = "Pump OFF";
      socket.emit('pumpOffButtonPressed');
    },
    sendInputTemp(){
      socket.emit('inputTempChanged', this.inputTemp);
      this.sentInputTemp = this.inputTemp;
    },
    sendInputPercent(){
      socket.emit('inputPercentChanged', this.inputPercent);
      this.sentInputPercent = this.inputPercent;
    },

    //Element Live Button
    elementLiveHandler(){
      this.elementLive();
      this.changeElementLiveButtonStyle();
    },
    elementLive(){
      this.elementActive = true;
      socket.emit("elementActive", this.elementActive);
    },
    changeElementLiveButtonStyle(){
      this.elementLiveButtonStyle = basegreenButton;
      this.elementOffButtonStyle = darkredButton;
    },

    // Element Off Button
    elementOffHandler(){
      this.elementOff();
      this.changeElementOffButtonStyle();
    },
    elementOff(){
      this.elementActive = false;
      socket.emit("elementOff", this.elementActive);
    },
    changeElementOffButtonStyle(){
      this.elementOffButtonStyle = baseredButton;
      this.elementLiveButtonStyle = darkgreenButton;
    },

    mashMode(){
      this.mash = true;
      this.mode = "Mash";
      socket.emit("mashModeActive")
    },
    boilMode: function(){
      this.mash = false;
      this.mode = "Boil";
      socket.emit("boilModeActive")
    },
    method1: function(arg){
      alert('method1: ', arg);
    },
    method1: function(arg){
      alert('method2: ', arg);
    },
    handler: function(arg1, arg2){
      this.method1(arg1);
      this.method2(arg2);
    }
  }
});
