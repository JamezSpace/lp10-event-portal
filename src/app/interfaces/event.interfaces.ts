export interface Event {
    _id: string;
    name: string;
    description: string;
    type: string; // 'recurring' or 'one-time'
    venue: string;
    duration: number; // in days
    month?: string;
    start_date?: string;
    created_at: string;
    modified_at: string;
}

export interface EventTicket {
    _id: string,
    name: string,
    date: Date,
    venue: string
}