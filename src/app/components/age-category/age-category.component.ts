import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
import { RegistrationDataService } from '../../services/users/registration-data/registration-data.service';
import { BulkRegistrationData } from '../../models/ui-models/registration-data.ui-model';

@Component({
  selector: 'age-category',
  imports: [],
  templateUrl: './age-category.component.html',
  styleUrl: './age-category.component.css'
})
export class AgeCategoryComponent {

    constructor(private registration_data_service: RegistrationDataService){ }


    @Input({required: true}) 
    category: keyof BulkRegistrationData = 'teenager';

    category_number: Signal<number> = computed(() => {
        return this.registration_data_service.view_registration_data()[this.category];
    });


    addOne(): void {
        this.registration_data_service.update_registration_data(this.category, this.category_number() + 1);
        // this.category_number++;
    }

    subtractOne(): void {
        if(this.category_number() === 0) return
        
        // this.category_number--;
        this.registration_data_service.update_registration_data(this.category, this.category_number() - 1);
    }
}
