
{
  var ctx = document.getElementById('myChart').getContext('2d');

  var chartStart = false;

  function startChartFunction() {
    document.getElementById('chartStartButton').style.visibility = "hidden";
    chartStart = true;
    chartRun = true;
  };

  var chartTimeLabels = [];

  var chartActualTempData = [];
  var chartSetTempData = [];
  var chartOutputPercentData = [];

  setInterval(function() {
    if (chartStart === true){
      // get current time
      var date = new Date();
      var s = date.getSeconds().toString();
      var m = date.getMinutes().toString();
      var h = date.getHours().toString();
      var time = h.concat(":").concat(m).concat(":").concat(s);

      // add current time to chart's label array
      chartTimeLabels.push(time);

      chartActualTempData.push(vueApp.temp);
      chartSetTempData.push(vueApp.sentInputTemp);
      chartOutputPercentData.push(vueApp.outputPercent);

      chart.update();
    }
  }, 5000);


  var chart = new Chart(ctx, {

    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
      labels: chartTimeLabels,//["January", "February", "March"],
      datasets: [{
        label: "Actual Temp",
        backgroundColor: colours.lightgreen,
        borderColor: colours.basegreen,
        data: chartActualTempData,//[0, 10, 5],
        fill: false,
        yAxisID: "y-axis-1",
        radius: 0
      },{
        label: "Set Temp",
        backgroundColor: colours.lightblue,
        borderColor: colours.baseblue,
        borderDash: [5],
        data: chartSetTempData,
        fill: false,
        yAxisID: "y-axis-1",
        radius: 0,
      }/*,{
        label: "Output",
        backgroundColor: colours.lightred,
        borderColor: colours.basered,
        data: chartOutputPercentData,
        fill: false,
        yAxisID: "y-axis-2",
        radius: 0
      }*/]
    },

    // Configuration options go here
    options: {

      scales: {
        yAxes: [{
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "left",
          id: "y-axis-1",
        }/*, {
          type: "linear", // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
          display: true,
          position: "right",
          id: "y-axis-2",
          // grid line settings
          gridLines: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        }*/],
      },
      // remove animations
      // animation: {
      //   duration: 0, // general animation time
      // },
      // hover: {
      //   animationDuration: 0, // duration of animations when hovering an item
      // },
      responsiveAnimationDuration: 0, // animation duration after a resize

      // remove bezier curves
      elements: {
        line: {
          tension: 0, // disables bezier curves
        }
      }
    }

  });
}
