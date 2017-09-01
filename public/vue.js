// Colours
var colours = {
  black: 'black',
  pink: 'pink',
  green: 'green',
  darkgreen: 'darkgreen'
}

// Button Styles
var darkgreenButton = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: colours.darkgreen,
  border: 'none',
  color: '#FFFFFF',
  textAlign: 'center',
  fontSize: '28px',
  padding: '20px',
  width: '200px',
  transition: 'all 0.5s',
  cursor: 'pointer',
  margin: '5px'
}

var pinkButton = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: colours.pink,
  border: 'none',
  color: '#FFFFFF',
  textAlign: 'center',
  fontSize: '28px',
  padding: '20px',
  width: '200px',
  transition: 'all 0.5s',
  cursor: 'pointer',
  margin: '5px'
}

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
    onButtonIsOffStyle: darkgreenButton,
    buttonCol: 'red'
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
    elementLive(){
      this.elementActive = true;
      //alert(this.elementActive);
      socket.emit("elementActive", this.elementActive);
    },
    elementOff(){
      this.elementActive = false;
      //alert(this.elementActive);
      socket.emit("elementOff", this.elementActive);
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
    buttonOn(){
      // this.fntSz++;
    },
    buttonOff(){
      // this.buttonColour = "red";
    },
    changeButtonStyle(){
      this.onButtonIsOffStyle = pinkButton;
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
