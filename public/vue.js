// Vue code
var vueApp = new Vue({
  el: '#vueApp',
  data: {
    message: 'Hello Vue!',
    counter: 0,
    pumpStatus: 'Pump OFF',
    show: true,
    mash: true,
    temp: "n/a"
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
    }
  }
});
