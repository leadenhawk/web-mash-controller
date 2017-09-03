var ctx = document.getElementById('myChart').getContext('2d');

var newLabels = [];
var newData = [];

setInterval(function() {
  var date = new Date();
  var s = date.getSeconds().toString();
  var m = date.getMinutes().toString();
  var h = date.getHours().toString();
  var time = h.concat(":").concat(m).concat(":").concat(s);
  // var time = hours+":"+minutes+":"+hours;
  console.log(time);
  newLabels.push(time);
  newData.push(Math.floor((Math.random() * 10) + 1));
  chart.update();
}, 5000);


var chart = new Chart(ctx, {


  // The type of chart we want to create
  type: 'line',

  // The data for our dataset
  data: {
    labels: newLabels,//["January", "February", "March"],
    datasets: [{
      label: "Temp",
      backgroundColor: colours.lightblue,
      borderColor: colours.baseblue,
      data: newData,//[0, 10, 5],
      fill: false,
    }]
  },

  // Configuration options go here
  options: {/*
        // remove animations
        animation: {
            duration: 0, // general animation time
        },
        hover: {
            animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize

        // remove bezier curves
        elements: {
            line: {
                tension: 0, // disables bezier curves
            }
        }
    */}

});
