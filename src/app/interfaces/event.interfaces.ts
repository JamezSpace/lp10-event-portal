interface Event {
  _id: string;
  name: string;
  venue: string;
  type: 'recurring' | 'one-time';
  recurring_event_id?: string;
  start_date?: string;
  created_at: string;
  modified_at: string;
}

interface RecurringEvent {
    _id: string;
    name: string;
    description: string;
    month: string;
    duration_in_days: number;
    created_at: string;
    modified_at: string;
}

interface UnifiedEvent {
  _id: string;
  name: string;
  description?: string;
  type: 'recurring' | 'one-time';
  venue?: string;
  duration_in_days?: number;
  month?: string;
  start_date?: string;
  created_at: string;
  modified_at: string;
}

interface EventTicket {
  _id: string;
  name: string;
  date: Date;
  venue: string;
}

export type { Event, EventTicket, RecurringEvent, UnifiedEvent };
