import React from 'react';
import 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';

const data = {
	labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	datasets: [
		{
			label: 'Export Credit',
			backgroundColor: 'rgb(144, 219, 244)',
			data: [2000, 3000, 3500, 5000, 5500, 7500, 9500, 10000, 11500, 12500],
			borderWidth: 0,
		},
		{
			label: 'Direct Usage Savings',
			backgroundColor: 'rgb(0, 153, 255)',
			data: [500, 2000, 3500, 5000, 7000, 7500, 8000, 10000, 11000, 12500],
			borderWidth: 0,
		},
		{
			label: 'Initial Solar System Cost',
			backgroundColor: 'rgb(255, 45, 45)',
			borderWidth: 0,
		}
	]
};

const Chart1 = () => (
	<div>
		<Bar
			data={data}
			height={230}
			options={{
				animation: false,
				responsive: true,
				legend: {
					position: 'bottom',
					onClick: (e) => e.stopPropagation()
				},
				tooltips: false,
				scales: {
					xAxes: [{
						stacked: true,
						gridLines: {
							display: false
						},
						scaleLabel: {
							display: true,
							labelString: 'years'
						}
					}],
					yAxes: [{
						stacked: true,
						gridLines: {
							display: false
						},
						ticks: {
							min: 0,
							stepSize: 2500,
							callback: (label) => {
								return `$${label}`;
							}
						}
					}]
				},
				annotation: {
					annotations: [{
						type: 'line',
						mode: 'horizontal',
						scaleID: 'y-axis-0',
						value: 12500,
						borderColor: 'rgb(255, 45, 45)',
						borderWidth: 3
					}]
				}
			}}
		/>
	</div>
);

export default Chart1;