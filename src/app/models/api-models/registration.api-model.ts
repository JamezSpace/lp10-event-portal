import { PersonApiModel } from "./person.api-model";

interface EventRegistrationApiModel {
  _id: string;
  event_id: string;
  person_id: string;
  payer_id: string;
  transaction_ref: string;
  payment_id?: string;
  status: string;
  checked_in: boolean;
  created_at: string;
  modified_at: string;
}

interface Payer {
    id: number;
    name: string;
    email: string;
    expected_amount: number;
    transaction_ref: string;
    status: string; // ['pending', 'verified']
    created_at: Date | string;
    processed_at: Date | string;
}

interface VerifyRegistrationApiModel {
    payer: Payer;
    people: PersonApiModel[];
    registrations: EventRegistrationApiModel[];
    valid: boolean;
}

export type {
    EventRegistrationApiModel,
    VerifyRegistrationApiModel,
    Payer
}