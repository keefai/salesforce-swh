import React from 'react';
import 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';
import { formatNumber } from '../../../../common/helpers';
import style from './style.module.scss';

const Chart1 = ({ data, annotationData }) => {
  const chartData = {
    labels: data ? data.Savings.map((d, i) => i + 1) : [],
    datasets: [
      {
        label: 'Export Credit',
        backgroundColor: 'rgb(144, 219, 244)',
        data: data ? data.Savings.map(d => d.ExportCumulative) : [],
        borderWidth: 0
      },
      {
        label: 'Direct Usage Savings',
        backgroundColor: 'rgb(0, 153, 255)',
        data: data ? data.Savings.map(d => d.DirectCumulative) : [],
        borderWidth: 0
      },
      {
        label: 'Initial Solar System Cost',
        backgroundColor: 'rgb(255, 45, 45)',
        borderWidth: 0
      }
    ]
  };

  return (
    <div className={style.chart}>
      <div className={style.heading}>Return on Investment & Savings Analysis*</div>
      <div>
        <Bar
          data={chartData}
          height={250}
          options={{
            responsive: true,
            legend: {
              position: 'bottom',
              onClick: e => e.stopPropagation()
            },
            scales: {
              xAxes: [
                {
                  stacked: true,
                  gridLines: {
                    display: false
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'years'
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
                    callback: label => {
                      return `$${formatNumber(label)}`;
                    }
                  }
                }
              ]
            },
            annotation: {
              annotations: [
                {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: annotationData,
                  borderColor: 'rgb(255, 45, 45)',
                  borderWidth: 3,
                  label: {
                    enabled: true,
                    position: 'top',
                    yAdjust: -16,
                    // content: data ? `ROI in ${data.PaybackPeriodYears} Years` : '',
                    content: `$${formatNumber(annotationData)}`,
                    backgroundColor: 'transparent',
                    fontColor: 'red',
                    fontSize: 16
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

export default Chart1;

/*

            annotation: {
              annotations: [
                {
                  type: 'line',
                  mode: 'horizontal',
                  scaleID: 'y-axis-0',
                  value: data ? data.InitialCost : 0,
                  borderColor: 'rgb(255, 45, 45)',
                  borderWidth: 3,
                  label: {
                    enabled: true,
                    position: 'top',
                    yAdjust: -16,
                    content: data ? `ROI in ${data.PaybackPeriodYears} Years` : '',
                    backgroundColor: 'transparent',
                    fontColor: 'red',
                    fontSize: 16
                 }
                }
              ]
            }
*/