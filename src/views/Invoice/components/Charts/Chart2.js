import React from 'react';
import { Bar } from 'react-chartjs-2';

const data = {
  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      backgroundColor: 'rgb(0, 153, 255)',
      data: [21.41, 26.35, 31.29, 36.23, 39.46, 39.46, 41.11, 39.46, 34.52, 27.87, 21.41, 18.12],
      borderWidth: 0
    }
  ]
};

const Chart1 = () => (
  <div>
    <Bar
      data={data}
      height={250}
      options={{
        animation: {
          duration: 0,
          onComplete: function() {
            var chartInstance = this.chart,
              ctx = chartInstance.ctx;
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function(dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function(bar, index) {
                var data = dataset.data[index];
                ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
            });
          }
        },
        responsive: true,
        legend: false,
        tooltips: false,
        hover: { mode: null },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: false
              },
              ticks: {
                min: 0,
                stepSize: 45,
                callback: label => {
                  return `${label} kWh`;
                }
              }
            }
          ]
        }
      }}
    />
  </div>
);

export default Chart1;
