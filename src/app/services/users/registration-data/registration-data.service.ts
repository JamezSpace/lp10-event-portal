import { computed, Injectable, Signal, signal } from '@angular/core';
import { PersonDTO } from '../../../models/dtos/person.dto';
import { PersonUiModel } from '../../../models/ui-models/person.ui-model';
import { BulkRegistrationData } from '../../../models/ui-models/registration-data.ui-model';
import { EventApiModel } from '../../../models/api-models/event.api-model';
import { environment } from '../../../../environments/environment';
import { fetchJson } from '../../../../utils/service.utils';
import { ApiResponse } from '../../../models/api-models/response.api-model';

@Injectable({
  providedIn: 'root',
})
export class RegistrationDataService {
  live_event = signal<EventApiModel | null>(null);

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

      
      localStorage.setItem('event', JSON.stringify(response_data.data));
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

  registration_data = signal<BulkRegistrationData>({
    teenager: 0,
    children: 0,
    teacher: 0,
  });

  private registered_persons = signal<PersonUiModel[]>([]);

  view_registration_data(): BulkRegistrationData {
    return this.registration_data();
  }

  get_total_number_registering: Signal<number> = computed(() => {
    return (
      this.registration_data().children +
      this.registration_data().teenager +
      this.registration_data().teacher
    );
  });

  reset_registration_data(): void {
    this.registration_data.set({
      teenager: 0,
      children: 0,
      teacher: 0,
    });
  }

  get_total_fee_of_all_registration: Signal<number> = computed(() => {
    if(!this.live_event()) return 0
    const event_pricing = this.live_event()!.price;


    let children_fee =
      this.registration_data().children *
      event_pricing.filter((category) => category.category === 'child')[0]
        .amount;

    let teens_fee =
      this.registration_data().teenager *
      event_pricing.filter((category) => category.category === 'teenager')[0]
        .amount;

    let teachers_fee =
      this.registration_data().teacher *
      event_pricing.filter((category) => category.category === 'teacher')[0]
        .amount;

    return children_fee + teachers_fee + teens_fee;
  });

  update_registration_data(category: string, num: number): void {
    if (category === 'children') {
      this.registration_data.set({
        ...this.registration_data(),
        children: num,
      });
    } else if (category === 'teenager')
      this.registration_data.set({
        ...this.registration_data(),
        teenager: num,
      });
    else
      this.registration_data.set({
        ...this.registration_data(),
        teacher: num,
      });

    return;
  }

  fetch_all_registered_persons_records(): PersonDTO[] {
    const registered_persons_without_id = this.registered_persons().map(
      ({ id, ...person_without_id }) => person_without_id
    );

    return registered_persons_without_id;
  }

  editedPersonId(person: PersonUiModel): PersonUiModel {
    const registeredPersons = this.registered_persons();
    const lastId =
      registeredPersons.length > 0
        ? registeredPersons[registeredPersons.length - 1].id
        : 0;

    return { ...person, id: lastId + 1 };
  }

  add_persons_record(person: PersonUiModel): number {
    const new_person = this.editedPersonId(person);

    this.registered_persons.update((prev) => [...prev, new_person]);

    return new_person.id;
  }

  update_person_record(person_to_update: PersonUiModel) {
    this.registered_persons.update((prev) =>
      prev.map((person) =>
        person.id === person_to_update.id
          ? { ...person, ...person_to_update }
          : person
      )
    );
  }
}
