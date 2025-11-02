import { Component, Input } from '@angular/core';
import { Event } from '../../interfaces/event.interfaces';
import { formatDateRange } from '../../../utils/date.utils';

@Component({
  selector: 'app-event',
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  @Input({ required: true, alias: 'event' })
  event!: Event;

  @Input()
  event_tag!: string | undefined;

  format_date_range(date: string, duration: number) {
    return formatDateRange(date, duration);
  }
}
