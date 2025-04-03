import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RegistrationDataService } from './registration-data.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    
    constructor(private regDataService: RegistrationDataService) { }

    async fetchZones(): Promise<string[]> {
        try {
            const response = await fetch(`${environment.base_backend.url}/zones`),
                data = await response.json()

            return data;
        } catch (error) {
            console.error(error);
            return []
        }
    }

    async sendToDatabase(): Promise<void> {
        try {
            const response = await fetch(`${environment.base_backend.url}/zones`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: "cors",
                body: JSON.stringify(this.regDataService.fetch_all_registered_persons_records())
            })

            const response_data = await response.json()
            
            console.log(response_data);
        } catch (error) {
            console.error(error);
            return
        }
    }
}
