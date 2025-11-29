import { Component, inject, OnInit } from '@angular/core';
import { Statistics } from '../../../models/ui-models/statistics.ui-model';
import { StatComponent } from '../../../components/stat/stat.component';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';

@Component({
  selector: 'app-overview',
  imports: [StatComponent, BaseChartDirective],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  private dashboard_service = inject(DashboardService);
  registrations = this.dashboard_service.registrations;
  statistics = this.dashboard_service.statistics

  async ngOnInit(): Promise<void> {
    if (this.registrations().length === 0)
      await this.dashboard_service.fetchEventRegistrations();
  }

  chartData: ChartConfiguration<'line'>['data'] = {
    labels: ['week 1', 'week 2', 'week 3', 'week 4'],
    datasets: [
      {
        data: [30, 50, 40, 75],
        label: 'Number of Registered persons',
        fill: true, // ✅ enables the area under the line
        tension: 0.25,
        backgroundColor: 'rgba(204, 184, 182, 0.5)',
        borderColor: '#804e49',
      },
    ],
  };

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        display: false,
      },
    },
  };
}
