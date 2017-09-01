// Defines Colours
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

// Defines Button Styles
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

// Function that copies objects
function shallowCopy( original )
{
    // First create an empty object with same prototype of our original source
    var clone = Object.create( Object.getPrototypeOf( original ) ) ;
    var i , keys = Object.getOwnPropertyNames( original ) ;
    for ( i = 0 ; i < keys.length ; i ++ )
    {
        // copy each property into the clone
        Object.defineProperty( clone , keys[ i ] ,
            Object.getOwnPropertyDescriptor( original , keys[ i ] )
        ) ;
    }
    return clone ;
}

// Creates different coloured buttons
var darkgreenButton = shallowCopy(baseButton);
darkgreenButton.backgroundColor = colours.darkgreen;

var basegreenButton = shallowCopy(baseButton);
basegreenButton.backgroundColor = colours.basegreen;

var darkredButton = shallowCopy(baseButton);
darkredButton.backgroundColor = colours.darkred;

var baseredButton = shallowCopy(baseButton);
baseredButton.backgroundColor = colours.basered;

var darkblueButton = shallowCopy(baseButton);
darkblueButton.backgroundColor = colours.darkblue;

var baseblueButton = shallowCopy(baseButton);
baseblueButton.backgroundColor = colours.baseblue;


// Vue code ********************************************************************
var vueApp = new Vue({
  el: '#vueApp',
  data: {
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
    buttonCol: 'red',
    pumpOnButtonStyle: darkgreenButton,
    pumpOffButtonStyle: baseredButton,
    elementLiveButtonStyle: darkgreenButton,
    elementOffButtonStyle: baseredButton,
    mashModeButtonStyle: basegreenButton,
    boilModeButtonStyle: darkredButton,
    chartButtonStyle: baseblueButton,
    sendInputButtonStyle: baseblueButton
  },
  methods: {
    // Pump On Button
    pumpOnHandler(){
      this.pumpOnClicked();
      this.changePumpOnButtonStyle();
    },
    pumpOnClicked(){
      this.pumpStatus = "Pump ON";
      socket.emit('pumpOnButtonPressed');
    },
    changePumpOnButtonStyle(){
      this.pumpOnButtonStyle = basegreenButton;
      this.pumpOffButtonStyle = darkredButton;
    },

    // Pump Off Button
    pumpOffHandler(){
      this.pumpOffClicked();
      this.changePumpOffButtonStyle();
    },
    pumpOffClicked(){
      this.pumpStatus = "Pump OFF";
      socket.emit('pumpOffButtonPressed');
    },
    changePumpOffButtonStyle(){
      this.pumpOnButtonStyle = darkgreenButton;
      this.pumpOffButtonStyle = baseredButton;
    },

    // Send temp to arduino button
    sendInputTemp(){
      socket.emit('inputTempChanged', this.inputTemp);
      this.sentInputTemp = this.inputTemp;
    },

    // Send percent to arduino button
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

    // Mash Mode Button
    mashModeHandler(){
      this.mashMode();
      this.changeMashModeButtonStyle();
    },
    mashMode(){
      this.mash = true;
      this.mode = "Mash";
      socket.emit("mashModeActive")
    },
    changeMashModeButtonStyle(){
      this.mashModeButtonStyle = basegreenButton;
      this.boilModeButtonStyle = darkredButton;
    },

    // Boil Mode Button
    boilModeHandler(){
      this.boilMode();
      this.changeBoilModeButtonStyle();
    },
    boilMode: function(){
      this.mash = false;
      this.mode = "Boil";
      socket.emit("boilModeActive")
    },
    changeBoilModeButtonStyle(){
      this.mashModeButtonStyle = darkredButton;
      this.boilModeButtonStyle = basegreenButton;
    }
  }
});
