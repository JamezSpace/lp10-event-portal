interface BaseEventModel {
  name: string;
  paid_event: boolean;
  year: number;
  platform: string;
  venue?: string;
  live: boolean,
  start_date?: string;
  start_time?: string;
}

interface EventApiModel extends BaseEventModel {
  _id: string;
  type: 'recurring' | 'one-time';
  price: { category: string; amount: number }[];
  recurring_event_id?: string;
  created_at: string;
  modified_at: string;
}

export type {
    BaseEventModel,
    EventApiModel
}