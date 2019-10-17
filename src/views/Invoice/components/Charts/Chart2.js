import React from 'react';
import Chart from 'chart.js';
import { Bar } from 'react-chartjs-2';
import style from './style.module.scss';

const Chart2 = ({ data }) => {
  const chartData = {
    labels: data ? data.MonthlyProduction.map(d => d.month) : [],
    datasets: [
      {
        backgroundColor: 'rgb(0, 153, 255)',
        data: data ? data.MonthlyProduction.map(d => Number(d.production).toFixed(2)) : [],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className={style.chart}>
      <div className={style.heading}>Estimated Average Daily Power Production (kWh)*</div>
      <div>
        <Bar
          data={chartData}
          height={250}
          options={{
            animation: {
              onComplete: function() {
                var chartInstance = this.chart,
                  ctx = chartInstance.ctx;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(102, 102, 102, 1)';
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
    </div>
  );
};

export default Chart2;
