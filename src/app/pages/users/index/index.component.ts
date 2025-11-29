import { Component, inject } from '@angular/core';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-index',
  imports: [RouterLink, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
    private dashboard_service = inject(DashboardService);

    async navigateToRegistration(){
        await this.dashboard_service.fetchLiveEvent();
    }
}
