import { Injectable, signal } from '@angular/core';
import { Event, RecurringEvent } from '../../../interfaces/event.interfaces';
import { fetchJson } from '../../../../utils/service.utils';
import { environment } from '../../../../environments/environment';
import { PersonEntityWithPayer } from '../../../interfaces/person.interface';
import { ApiResponse } from '../../../interfaces/api-response.interfaces';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  events = signal<Event[]>([]);
  recurring_events = signal<RecurringEvent[]>([]);
  pagination = signal({ page: 1, limit: 10, total: 0 });

  async fetchEvents(): Promise<Event[]> {
    try {
      const response_data = await fetchJson<Event[]>(
        `${environment.base_backend.url}/events`,
        {
          mode: 'cors',
        }
      );

      this.events.set(response_data);
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
      const response_data = await fetchJson<
        ApiResponse<PersonEntityWithPayer[]>
      >(qr_code_text, {
        mode: 'cors',
      });

      return response_data.data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async fetchRecurringEvents(): Promise<RecurringEvent[]> {
    try {
      const response_data = await fetchJson<RecurringEvent[]>(
        `${environment.base_backend.url}/recurring-events`,
        {
          mode: 'cors',
        }
      );

      this.recurring_events.set(response_data)
      return response_data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async createEvent(event: Event) {
    try {
      const response_data = await fetchJson<ApiResponse<Event[]>>(
        `${environment.base_backend.url}/recurring-events`,
        {
          mode: 'cors',
        }
      );

      if(!response_data.success) 
        throw new Error(response_data.error)
      else
        this.events.update(existing_events => [...existing_events, event])
    } catch (error) {
      console.error(error);
    }
  }

  async createRecurringEvent(recurring_event: RecurringEvent) {
    try {
      const response = await fetchJson<ApiResponse<RecurringEvent[]>>(
        `${environment.base_backend.url}/recurring-events`,
        {
          mode: 'cors',
          body: JSON.stringify(recurring_event),
        }
      );

      if(!response.success) 
        throw new Error(response.error)
      else
        this.recurring_events.update(existing_events => [...existing_events, recurring_event])
    } catch (error) {
      console.error(error);
    }
  }
}
