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
            const response = await fetch(`${environment.base_backend.url}/zones`, {
                mode: 'cors'
            }), data = await response.json()

            // data is an array of objects holding the zones ([{id, name}])
            return data.map((zone: { name: string }) => zone.name);
        } catch (error: any) {
            console.error(error);
            return []
        }
    }

    async sendPersonDataToDatabase(): Promise<void | string[]> {
        try {
            const response = await fetch(`${environment.base_backend.url}/persons`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(this.regDataService.fetch_all_registered_persons_records())
            })

            const response_data = await response.json()
            
            return Object.values(response_data.ids);
        } catch (error: any) {
            console.error(error.message);
            return
        }
    }

    async validatePayment(transaction_id: number, fee: number, ids_to_update_payment_status: string[]): Promise<void | any> {
        try {
            const response = await fetch(`${environment.base_backend.url}/payments/verify/${transaction_id}`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount: fee, ids: ids_to_update_payment_status }),
            })

            const response_data = await response.json()

            console.log(response_data);

            return response_data;
        } catch (error) {
            console.error(error);
            return
        }
    }
}
