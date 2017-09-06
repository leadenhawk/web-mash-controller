// Defines Colours
var colours = {
  black: 'black',
  pink: 'pink',
  green: 'green',
  yellow: 'yellow',
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
  darkblue: '#002D2D',
  bg: '#292929',
  brightgreen: '#34DC08',
  brightred: '#F9091B',
  brightyellow: '#FFD00A',
  darkyellow: '#AB8A00'
}

// Defines Base Styles

// base button style
var baseButton = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: colours.pink,
  border: 'none',
  color: '#FFFFFF',
  textAlign: 'center',
  fontSize: '16px',
  padding: '10px',
  width: '80px',
  transition: 'all 0.75s',
  cursor: 'pointer',
  margin: '5px'
};

// base Output Style
var baseOutputStyle = {
  display: 'inline-block',
  borderRadius: '4px',
  backgroundColor: colours.yellow,
  border: 'none',
  color: colours.bg,
  textAlign: 'center',
  fontSize: '16px',
  padding: '40px 0px 40px 0px',
  width: '100px',
  borderRadius: '50%',
  // transition: 'all 0.1s',
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
// var darkgreenButton = shallowCopy(baseButton);
// darkgreenButton.backgroundColor = colours.darkgreen;
// var basegreenButton = shallowCopy(baseButton);
// basegreenButton.backgroundColor = colours.basegreen;
// var darkredButton = shallowCopy(baseButton);
// darkredButton.backgroundColor = colours.darkred;
// var baseredButton = shallowCopy(baseButton);
// baseredButton.backgroundColor = colours.basered;
var notSelectedButton = shallowCopy(baseButton);
notSelectedButton.backgroundColor = colours.darkyellow;
var selectedButton = shallowCopy(baseButton);
selectedButton.backgroundColor = colours.brightyellow;
selectedButton.color = colours.black;

// Creates output styles
var elementOnStyleSet = shallowCopy(baseOutputStyle);
elementOnStyleSet.backgroundColor = colours.brightred;
var mashBoilStyleSet = shallowCopy(baseOutputStyle);
mashBoilStyleSet.backgroundColor = colours.brightgreen;
mashBoilStyleSet.color = colours.black;
// var elementLiveYesStyleSet = shallowCopy(baseOutputStyle);
// elementLiveYesStyleSet.backgroundColor = colours.basegreen;
// var elementLiveNoStyleSet = shallowCopy(baseOutputStyle);
// elementLiveNoStyleSet.backgroundColor = colours.basered;
var elementLiveStyleSet = shallowCopy(baseOutputStyle);
elementLiveStyleSet.backgroundColor = colours.brightred;
var pumpStatusStyleSet = shallowCopy(baseOutputStyle);
pumpStatusStyleSet.backgroundColor = colours.brightred;

var tempStyleSet = {fontSize: "26px", borderRadius: '5px', backgroundColor: colours.bg,	width: '100px', padding: '6px 10px',	margin: '4px 0', textAlign: 'center'};
var inputStyleSet = {fontSize: "18px", textAlign: 'center'};
var profileStyleSet = {fontSize: "20px", borderRadius: '5px', backgroundColor: colours.bg,	width: '300px', padding: '6px 10px',	margin: '4px 0', textAlign: 'center'};


// Vue code ********************************************************************
var vueApp = new Vue({
  el: '#vueApp',
  data: {
    counter: 0,
    pumpStatus: 'Pump OFF',
    show: true,
    temp: "n/a",
    inputTemp: "",
    sentInputTemp: 0,
    inputPercent: "",
    sentInputPercent: 0,
    elementLiveStatus: 'Not Live',
    elementActive: false,
    outputPerCent: 0,
    mode: "Mash",
    elementStatus: "OFF",
    pumpOnButtonStyle: notSelectedButton,
    pumpOffButtonStyle: selectedButton,
    elementLiveButtonStyle: notSelectedButton,
    elementOffButtonStyle: selectedButton,
    mashModeButtonStyle: selectedButton,
    boilModeButtonStyle: notSelectedButton,
    chartButtonStyle: selectedButton,
    sendInputButtonStyle: selectedButton,
    elementStyle: elementOnStyleSet,
    mashBoilStyle: mashBoilStyleSet,
    elementLiveStyle: elementLiveStyleSet,
    pumpStatusStyle: pumpStatusStyleSet,
    tempStyle: tempStyleSet,
    inputStyle: inputStyleSet,
    initialised: false,
    initiliseButtonStyle: selectedButton,
    timeNow: "xx:xx:xx",
    timerOn: false,
    temp1: "",
    time1: "",
    temp2: "",
    time2: "",
    temp3: "",
    time3: "",
    mins: 0,
    secs: 0,
    warning: false,
    PvalueSet: 0,
    IvalueSet: 0,
    DvalueSet: 0,
    windowSizeValueSet: 0,
    pError: 0,
    pTermValue: 0,
    stage1: "Stage 1"
  },
  computed: {
    min: function(){
      if (this.mins < 10){
        return '0' + this.mins;
      }
      return this.mins;
    },
    sec: function(){
      if (this.secs < 10){
        return '0' + this.secs;
      }
      return this.secs;
    }/*,
    error: function(){
      if (this.temp != 'n/a'){
        this.pError = this.sentInputTemp - this.temp;
        return this.pError;
      }
    },
    pTerm: function(){
      if (this.temp != 'n/a'){
        this.pTermValue = this.error * this.PvalueSet;
        return this.pTermValue;
      }
    }*/
  },
  methods: {
    // Pump On Button
    // pumpOnHandler(){
    //   this.pumpOnClicked();
    //   // this.changePumpOnButtonStyle();
    // },
    pumpOnClicked(){
      // this.pumpStatus = "Pump ON";
      socket.emit('pumpOnButtonPressed');
    },
    changePumpOnButtonStyle(){
      this.pumpOnButtonStyle = selectedButton;
      this.pumpOffButtonStyle = notSelectedButton;
      pumpStatusStyleSet.backgroundColor = colours.basegreen;
    },

    // Pump Off Button
    // pumpOffHandler(){
    //   this.pumpOffClicked();
    //   // this.changePumpOffButtonStyle();
    // },
    pumpOffClicked(){
      // this.pumpStatus = "Pump OFF";
      socket.emit('pumpOffButtonPressed');

    },
    changePumpOffButtonStyle(){
      this.pumpOnButtonStyle = notSelectedButton;
      this.pumpOffButtonStyle = selectedButton;
      pumpStatusStyleSet.backgroundColor = colours.brightred;
    },

    //Element Live Button
    // elementLiveHandler(){
    //   this.elementLiveClicked();
    //   // this.changeElementLiveButtonStyle();
    // },
    elementLiveClicked(){
      // this.elementActive = true;
      // socket.emit("elementActive", this.elementActive);
      socket.emit("elementLivePressed");
    },
    changeElementLiveButtonStyle(){
      this.elementLiveButtonStyle = selectedButton;
      this.elementOffButtonStyle = notSelectedButton;
      elementLiveStyleSet.backgroundColor = colours.basegreen;
    },

    // Element Off Button
    // elementOffHandler(){
    //   this.elementOffClicked();
    //   // this.changeElementOffButtonStyle();
    // },
    elementOffClicked(){
      // this.elementActive = false;
      socket.emit("elementOffPressed", this.elementActive);
    },
    changeElementOffButtonStyle(){
      this.elementOffButtonStyle = selectedButton;
      this.elementLiveButtonStyle = notSelectedButton;
      elementLiveStyleSet.backgroundColor = colours.brightred;
    },

    // Mash Mode Button
    // mashModeHandler(){
    //   this.mashMode();
      // this.changeMashModeButtonStyle();
    // },
    mashMode(){
      // this.mode = "Mash";
      socket.emit("mashModeActive")
    },
    changeMashModeButtonStyle(){
      this.mashModeButtonStyle = selectedButton;
      this.boilModeButtonStyle = notSelectedButton;
      mashBoilStyleSet.backgroundColor = colours.basegreen;
    },

    // Boil Mode Button
    // boilModeHandler(){
    //   this.boilMode();
      // this.changeBoilModeButtonStyle();
    // },
    boilMode: function(){
      // this.mode = "Boil";
      socket.emit("boilModeActive")
    },
    changeBoilModeButtonStyle(){
      this.mashModeButtonStyle = notSelectedButton;
      this.boilModeButtonStyle = selectedButton;
      mashBoilStyleSet.backgroundColor = colours.brightred;
    },

    // Send temp to arduino button
    sendInputTemp(){
      socket.emit('inputTempChanged', this.inputTemp);
      // this.sentInputTemp = this.inputTemp;
    },

    // Send percent to arduino button
    sendInputPercent(){
      socket.emit('inputPercentChanged', this.inputPercent);
      // this.sentInputPercent = this.inputPercent;
    },

    initialiseClicked(){
      this.initialised = true;
      socket.emit('initilise');

    },

    getTimeNow: function(){
      this.intervalid1 = setInterval(() => {
        var date = new Date();
        var s = date.getSeconds().toString();
        if (s < 10 ){
          s = "0"+s;
        }
        var m = date.getMinutes().toString();
        if (m < 10 ){
          m = "0"+m;
        }
        var h = date.getHours().toString();
        if (h < 10 ){
          h = "0"+h;
        }
        this.timeNow = h.concat(":").concat(m).concat(":").concat(s);
        // alert(this.timeNow);
      }, 1000);
    },

    startCountdown: function(){

      if(this.time1 === ""){
        this.warning = true;
        return;
      }
      this.warning = false;
      this.timerOn = true;
      this.mins = this.time1;
      this.secs = 0;

      socket.emit('inputTempChanged', this.temp1);

      var temp1min = (this.temp1 - 0.75);
      var temp1max = (this.temp1 + 1)-((this.temp1 * 10)-this.temp1);

      this.intervalid2 = setInterval(() => {
        if ( ( this.temp >= temp1min ) && ( this.temp <= temp1max ) ) {
          if (this.secs === 0){
            this.mins--;

            this.secs = 60;
          }
          this.secs--;
          if (this.mins === 0){
            if (this.secs === 0){

              clearInterval(this.intervalid2);
              if (this.temp2 === ""){
                this.timerOn = false;
                alert('Mash profile finished');
                return;
              }
              this.secondStageCountdown();
            }
          }
        }
      }, 1000);
    },

    secondStageCountdown: function(){

      this.mins = this.time2;
      this.secs = 0;

      socket.emit('inputTempChanged', this.temp2);
      var temp2min = (this.temp2 - 0.75);
      var temp2max = (this.temp2 + 1)-((this.temp2 * 10)-this.temp2);

      this.intervalid3 = setInterval(() => {
        if ( ( this.temp >= temp2min ) && ( this.temp <= temp2max ) ) {
          if (this.secs === 0){
            this.mins--;

            this.secs = 60;
          }
          this.secs--;
          if (this.mins === 0){
            if (this.secs === 0){
              clearInterval(this.intervalid3);
              if (this.temp3 === ""){
                this.timerOn = false;
                alert('Mash profile finished');
                return;
              }
              this.thirdStageCountdown();
            }
          }
        }
      }, 1000);
    },

    thirdStageCountdown: function(){
      this.mins = this.time3;
      this.secs = 0;

      socket.emit('inputTempChanged', this.temp3);
      var temp3min = (this.temp3 - 0.75);
      var temp3max = (this.temp3 + 1)-((this.temp3 * 10)-this.temp3);

      this.intervalid4 = setInterval(() => {
        if ( ( this.temp >= temp3min ) && ( this.temp <= temp3max ) ) {
          if (this.secs === 0){
            this.mins--;

            this.secs = 60;
          }
          this.secs--;
          if (this.mins === 0){
            if (this.secs === 0){
              clearInterval(this.intervalid4);
              this.timerOn = false;
              alert('Mash profile finished');
            }
          }
        }
      }, 1000);
    },

    stopCountdown: function(){
      this.timerOn = false;
      clearInterval(this.intervalid2);
      clearInterval(this.intervalid3);
      clearInterval(this.intervalid4);
    }
  },
  mounted : function(){
    this.getTimeNow();

  }
});
