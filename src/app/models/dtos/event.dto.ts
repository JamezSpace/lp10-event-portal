import { BaseEventModel } from "../api-models/event.api-model";

export interface EventDTO extends BaseEventModel {
    type: string;
    price: { category: string; amount: number }[];
    recurring_event_id?: string;
}