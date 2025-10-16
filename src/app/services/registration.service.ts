import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RegistrationDataService } from './registration-data.service';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  constructor(private regDataService: RegistrationDataService) {}

  async fetchZones(): Promise<string[]> {
    try {
      const response = await fetch(`${environment.base_backend.url}/zones`, {
          mode: 'cors',
        }),
        data = await response.json();

      // data is an array of objects holding the zones ([{id, name}])
      return data.map((zone: { name: string }) =>
        // turn to title case
        zone.name.replace(
          /\w\S*/g,
          (txt: string) =>
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        )
      );
    } catch (error: any) {
      console.error(error);
      return [];
    }
  }

  async sendPersonDataToDatabase(): Promise<void | string[]> {
    try {
      const response = await fetch(`${environment.base_backend.url}/persons`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(
          this.regDataService.fetch_all_registered_persons_records()
        ),
      });

      const response_data = await response.json();

      return Object.values(response_data.ids);
    } catch (error: any) {
      console.error(error.message);
      return;
    }
  }

  async makePaymentWithPaystack(
    payers_email: string,
    total_amount_to_be_paid: number
  ) {
    try {
      const response = await fetch(
        `${environment.base_backend.url}/payments/paystack`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            email: payers_email,
            amount: total_amount_to_be_paid,
          }),
        }
      );

      const response_data = await response.json();

      // response_data looks like {success: boolean, message: string, data: paystack object}
      window.location.href = response_data.data.data.authorization_url;
    } catch (error: any) {
      console.error(error.message);
      return;
    }
  }

  async verifyPaymentWithPaystack(total_amount_to_be_paid: number) {
    try {
      const response = await fetch(
        `${environment.base_backend.url}/payments/paystack/verify?amount=${total_amount_to_be_paid}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );

      const response_data = await response.json();
      console.log(response_data);

      // at this stage, pass the user to next stage to download the receipt
    } catch (error: any) {
      console.error(error.message);
      return;
    }
  }

  async validatePayment(
    transaction_id: number,
    fee: number,
    ids_to_update_payment_status: string[]
  ): Promise<void | any> {
    try {
      const response = await fetch(
        `${environment.base_backend.url}/payments/verify/${transaction_id}`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: fee,
            ids: ids_to_update_payment_status,
          }),
        }
      );

      const response_data = await response.json();

      console.log(response_data);

      return response_data;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
