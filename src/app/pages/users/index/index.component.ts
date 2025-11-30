import { Component, inject } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { RegistrationDataService } from '../../../services/users/registration-data/registration-data.service';

@Component({
  selector: 'app-index',
  imports: [RouterLink, RouterModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
    private registration_data_service = inject(RegistrationDataService);

    async navigateToRegistration(){
        await this.registration_data_service.fetchLiveEvent();
    }
}
