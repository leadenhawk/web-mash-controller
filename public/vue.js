// Vue code
var vueApp = new Vue({
  el: '#vueApp',
  data: {
    message: 'Hello Vue!',
    counter: 0,
    pumpStatus: 'Pump OFF',
    show: true,
    mash: true,
    temp: "n/a",
    inputTemp: 0,
    inputPerCent: 0,
    elementActive: false,
    outputPerCent: 0
  },
  methods: {
    changeMessageMethod(){
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
    }
  }
});
