import { Component } from '@angular/core';
import { Statistics } from '../../../interfaces/registration.interfaces';
import { StatComponent } from '../../../components/stat/stat.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-overview',
  imports: [StatComponent, BaseChartDirective],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent {
  statistics: Statistics[] = [
    {
      label: 'total registrations',
      value: 1204,
      type: 'others',
    },
    {
      label: 'total revenue',
      value: 240800,
      type: 'currency',
    },
    {
      label: 'checked-in attendance',
      value: 94,
      type: 'others',
    },
  ];

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['week 1', 'week 2', 'week 3', 'week 4'],
    datasets: [
      { 
        data: [30, 50, 40, 75], 
        label: 'Number of Registered persons',
        fill: true, // ✅ enables the area under the line
        tension: 0.25,
        backgroundColor: 'rgba(204, 184, 182, 0.5)',
        borderColor: '#804e49'
    },
    ],
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    devicePixelRatio: 2,
    plugins: {
        legend: {
            display: false
        }
    }
  };
}
