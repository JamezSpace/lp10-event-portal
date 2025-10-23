import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RegistrationDataService } from './registration-data.service';
import { PaystackInit } from '../interfaces/payment.interfaces';
import { fetchJson } from '../../utils/service.utils';
import { ApiResponse } from '../interfaces/api-response.interfaces';

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
      const response_data = await fetchJson<ApiResponse<{ ids: string[] }>>(
        `${environment.base_backend.url}/persons`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify(
            this.regDataService.fetch_all_registered_persons_records()
          ),
        }
      );

      if (!response_data.data) throw new Error(response_data.error);

      return Object.values(response_data.data.ids);
    } catch (error: any) {
      console.error(error.message);
      return;
    }
  }

  async makePaymentWithPaystack(
    payers_name: string,
    payers_email: string,
    total_amount_to_be_paid: number
  ) {
    try {
      const response_data = await fetchJson<ApiResponse<PaystackInit>>(
        `${environment.base_backend.url}/payments/paystack`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          body: JSON.stringify({
            name: payers_name,
            email: payers_email,
            amount: total_amount_to_be_paid,
          }),
        }
      );

      if (!response_data.data) {
        return {success: false, error: 'Please check your internet connection.'};
      }

      // response_data looks like {success: boolean, message: string, data: paystack object}
      window.location.href = response_data.data.data.authorization_url;

      return {success: true, ref: response_data.data.data.reference};
    } catch (error: any) {
      console.error(error.message);
      return {success: false, error: error.message}
    }
  }

  async addTransactionRefToPersonsDetails(
    ids: string[],
    update_to_make: object
  ) {
    let response;

    try {
      ids.length === 1
        ? (response = await fetch(
            `${environment.base_backend.url}/persons/${ids[0]}`,
            {
              mode: 'cors',
              method: 'PUT',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(update_to_make),
            }
          ))
        : (response = await fetch(`${environment.base_backend.url}/persons`, {
            mode: 'cors',
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ids,
              updates: update_to_make,
            }),
          }));

      // no checking any backend response coz, backend is returning 204 status code - no content

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // may not need these two functions below
  async verifyPaymentWithPaystack() {
    try {
      const response = await fetch(
        `${environment.base_backend.url}/payments/paystack/verify`,
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
