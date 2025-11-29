import { PersonApiModel } from '../api-models/person.api-model';
import { EventRegistrationApiModel, Payer } from '../api-models/registration.api-model';

interface EventRegistrationUiModel {
  event_id: string;
  person_id: string;
  transaction_ref: string;
}

interface VerifyRegistrationUiModel
  extends Pick<Payer, 'name' | 'email' | 'expected_amount'>,
    Pick<
      PersonApiModel,
      'first_name' | 'last_name' | 'gender' | 'year_of_birth' | 'origin'
    >, Pick<EventRegistrationApiModel, 'checked_in'> {}

export type { EventRegistrationUiModel, VerifyRegistrationUiModel };
