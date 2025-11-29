import { BaseEventModel } from "../api-models/event.api-model";

export enum EventType {
  'recurring',
  'one-time',
}

interface EventUIModel extends BaseEventModel {
  _id: string;
  type: 'recurring' | 'one-time';
  recurring_event_id?:string;
  teachers_fee?: number;
  teens_fee?: number;
  children_fee?: number;
}

interface UnifiedEventUIModel extends BaseEventModel {
    _id: string;
    type: number;
    duration_in_days?: number;
}

export type {
    EventUIModel,
    UnifiedEventUIModel
}