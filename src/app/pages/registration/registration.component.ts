import { Component } from '@angular/core';
import { AgeCategoryComponent } from "../../components/age-category/age-category.component";

@Component({
  selector: 'app-registration',
  imports: [AgeCategoryComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
    date_of_event: String = "Friday 24th November, 2024";
    time_of_event:String = "8am";
    venue:String = "LP10 Provincial HQ";
    address:String = "No 1, Omotoye estate, Mulero Agege";
}
