import { Injectable, signal } from '@angular/core';
import { Event } from '../../../interfaces/event.interfaces';
import { fetchJson } from '../../../../utils/service.utils';
import { environment } from '../../../../environments/environment';
import { PersonEntityWithPayer } from '../../../interfaces/person.interface';
import { ApiResponse } from '../../../interfaces/api-response.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  pagination = signal({ page: 1, limit: 10, total: 0 });

  async fetchEvents(): Promise<Event[]> {
    try {
      const response_data = await fetchJson<Event[]>(
        `${environment.base_backend.url}/events`,
        {
          mode: 'cors',
        }
      );

      return response_data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async fetchPersonsCheckedIn(
    page: number = 1,
    limit: number = 10
  ): Promise<PersonEntityWithPayer[]> {
    try {
      const response_data = await fetchJson<PersonEntityWithPayer[]>(
        `${environment.base_backend.url}/persons?page=${page}&limit=${limit}`,
        {
          mode: 'cors',
        }
      );

      return response_data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async verifyRegistration(qr_code_text: string) {
    try {
      const response_data = await fetchJson<ApiResponse<PersonEntityWithPayer[]>>(
        qr_code_text,
        {
          mode: 'cors',
        }
      );

      return response_data.data
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message)
    }
  }
}
