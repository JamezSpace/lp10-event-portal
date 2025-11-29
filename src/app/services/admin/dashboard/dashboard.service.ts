import { computed, Injectable, Signal, signal } from '@angular/core';
import { fetchJson } from '../../../../utils/service.utils';
import { environment } from '../../../../environments/environment';
import { ServiceToComponentDataHandling } from '../../../models/service-component.model';
import { ApiResponse } from '../../../models/api-models/response.api-model';
import {
  EventRegistrationApiModel,
  VerifyRegistrationApiModel,
} from '../../../models/api-models/registration.api-model';
import { Statistics } from '../../../models/ui-models/statistics.ui-model';
import { RecurringEventApiModel } from '../../../models/api-models/recurring-event.api-model';
import { RecurringEventUiModel } from '../../../models/ui-models/recurring-events.ui-model';
import { RecurringEventDTO } from '../../../models/dtos/recurring-event.dto';
import {
  EventRegistrationUiModel,
  VerifyRegistrationUiModel,
} from '../../../models/ui-models/registration.ui-model';
import { EventDTO } from '../../../models/dtos/event.dto';
import { EventApiModel } from '../../../models/api-models/event.api-model';
import { EventUIModel } from '../../../models/ui-models/events.ui-model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  events = signal<EventUIModel[]>([]);
  recurring_events = signal<RecurringEventUiModel[]>([]);
  persons_checked_in = signal<EventRegistrationApiModel[]>([]);
  registrations = signal<EventRegistrationUiModel[]>([]);
  live_event = signal<EventApiModel | null>(null);
  pagination = signal({ page: 1, limit: 10, total: 0, pages: 0 });
  statistics: Signal<Statistics[]> = computed(() => [
    {
      label: 'total registrations',
      value: this.registrations().length || 0,
      type: 'others',
    },
    {
      label: 'total revenue',
      value: 240800,
      type: 'currency',
    },
    {
      label: 'checked-in attendance',
      value: this.persons_checked_in().length || 0,
      type: 'others',
    },
  ]);

  async fetchEvents(): Promise<void> {
    try {
      const response_data = await fetchJson<ApiResponse<EventApiModel[]>>(
        `${environment.base_backend.url}/events`,
        {
          mode: 'cors',
        }
      );

      if (!response_data.success || !response_data.data) return;

      this.events.set(this.transformEventApiArrayToUi(response_data.data));
    } catch (error) {
      console.error(error);
    }
  }

  async fetchLiveEvent() {
    try {
      const response_data = await fetchJson<ApiResponse<EventApiModel>>(
        `${environment.base_backend.url}/events/live`,
        {
          mode: 'cors',
        }
      );

      // continue here to fetch the live event
      if (!response_data.success || !response_data.data) return;

      localStorage.setItem('live_event_id', response_data.data._id!);
        this.live_event.set(response_data.data);
    //   // convert EventApiModel to EventDTO first by stripping timestamps and _id property
    //   const stripped_timestamps = this.stripApiTimestamps(response_data.data);

    //   const { _id, ...event_dto } = stripped_timestamps;

    //   this.live_event.set(
    //     this.transformEventDTOToUiReadyData(response_data.data._id, event_dto)
    //   );
    } catch (error) {
      console.error(error);
    }
  }

  async fetchEventRegistrations(): Promise<void> {
    try {
      const response_data = await fetchJson<
        ApiResponse<EventRegistrationApiModel[]>
      >(`${environment.base_backend.url}/registrations`, {
        mode: 'cors',
      });

      if (!response_data.success) throw new Error(response_data.error);

      if (response_data.data)
        this.registrations.set(this.stripApiTimestamps(response_data.data));
    } catch (error) {
      console.error(error);
    }
  }

  async checkPersonIn(person: VerifyRegistrationUiModel) {
    try {
      const response_data = await fetchJson<
        ApiResponse<EventRegistrationApiModel>
      >(`${environment.base_backend.url}/registrations`, {
        method: 'PUT',
        mode: 'cors',
        body: JSON.stringify(person),
      });

      if (response_data.success) {
        console.log('successful');
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  async fetchPersonsCheckedIn(
    page: number = 1,
    limit: number = 10
  ): Promise<void> {
    try {
      const response_data = await fetchJson<
        ApiResponse<EventRegistrationApiModel[]>
      >(
        `${environment.base_backend.url}/registrations?page=${page}&limit=${limit}`,
        {
          mode: 'cors',
        }
      );

      // this actually appends to persons (assuming persons exists in redis)
      this.persons_checked_in.update((prev_persons) => {
        return [
          ...prev_persons,
          ...this.stripApiTimestamps(response_data.data!),
        ].filter((data) => data.checked_in === true);
      });
      this.pagination.set(response_data.pagination!);
    } catch (error) {
      console.error(error);
    }
  }

  async verifyRegistration(qr_code_text: string) {
    try {
      const response_data = await fetchJson<
        ApiResponse<VerifyRegistrationApiModel[]>
      >(qr_code_text, {
        mode: 'cors',
      });

      return response_data.data;
    } catch (error: any) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  stripApiTimestamps(data: any[] | any) {
    // this is the base conversion of api models to ui models
    if (Array.isArray(data)) {
      const [{ created_at, modified_at, ...data_without_timestamps }] = data;

      return [data_without_timestamps];
    } else {
      const { created_at, modified_at, ...data_without_timestamps } = data;

      return data_without_timestamps;
    }
  }

  async fetchRecurringEvents(): Promise<void> {
    try {
      const response_data = await fetchJson<
        ApiResponse<RecurringEventApiModel[]>
      >(`${environment.base_backend.url}/recurring-events`, {
        mode: 'cors',
      });

      if (!response_data.success) throw new Error(response_data.error);

      if (response_data.data)
        this.recurring_events.set(this.stripApiTimestamps(response_data.data));
    } catch (error) {
      console.error(error);
    }
  }

  transformEventDTOToUiReadyData(
    event_id: string,
    dto: EventDTO
  ): EventUIModel {
    const teachers = dto.price.find((p) => p.category === 'teachers')?.amount;
    const teens = dto.price.find((p) => p.category === 'teens')?.amount;
    const children = dto.price.find((p) => p.category === 'children')?.amount;

    return {
      ...dto,
      type: dto.type as 'recurring' | 'one-time',
      _id: event_id,
      teachers_fee: teachers,
      teens_fee: teens,
      children_fee: children,
    };
  }

  transformEventApiToUi(event: EventApiModel): EventUIModel {
    const { created_at, modified_at, price, ...rest } = event;

    const priceMap = Object.fromEntries(
      price.map((p) => [p.category, p.amount])
    ) as Record<string, number | undefined>;

    return {
      ...rest,
      teachers_fee: priceMap['teachers'],
      teens_fee: priceMap['teens'],
      children_fee: priceMap['children'],
    };
  }

  transformEventApiArrayToUi(events: EventApiModel[]): EventUIModel[] {
    return events.map(this.transformEventApiToUi);
  }

  async createEvent(event: EventDTO): Promise<ServiceToComponentDataHandling> {
    try {
      const response_data = await fetchJson<ApiResponse<EventApiModel>>(
        `${environment.base_backend.url}/events`,
        {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(event),
        }
      );

      if (response_data.success) {
        this.events.update((existing_events) => [
          ...existing_events,
          this.transformEventDTOToUiReadyData(response_data.data!._id!, event),
        ]);

        return { success: true };
      }

      throw new Error(response_data.error);
    } catch (error: any) {
      console.error(error);

      return { success: false, error: error.message };
    }
  }

  async createRecurringEvent(recurring_event: RecurringEventDTO) {
    try {
      const response = await fetchJson<ApiResponse<RecurringEventApiModel[]>>(
        `${environment.base_backend.url}/recurring-events`,
        {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify(recurring_event),
        }
      );

      if (!response.success) throw new Error(response.error);
      else
        this.recurring_events.update((existing_events) => [
          ...existing_events,
          this.stripApiTimestamps(recurring_event),
        ]);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async deleteRecurringEvent(event_id: string) {
    try {
      const response = await fetch(
        `${environment.base_backend.url}/recurring-events/${event_id}`,
        {
          method: 'DELETE',
          mode: 'cors',
        }
      );

      if (response.status === 204) {
        this.recurring_events.update((existing_events) =>
          existing_events.filter((event) => event._id !== event_id)
        );

        return { success: true };
      }

      throw new Error("Couldn't delete recurring event");
    } catch (error: any) {
      console.error(error);

      return { success: false, error: error.message };
    }
  }

  async deleteEvent(event_id: string) {
    try {
      const response = await fetch(
        `${environment.base_backend.url}/events/${event_id}`,
        {
          method: 'DELETE',
          mode: 'cors',
        }
      );

      if (response.status === 204) {
        this.events.update((existing_events) =>
          existing_events.filter((event) => event._id !== event_id)
        );

        return { success: true };
      }

      throw new Error("Couldn't delete event");
    } catch (error: any) {
      console.error(error);

      return { success: false, error: error.message };
    }
  }
}
