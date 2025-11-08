import { Component, Input } from '@angular/core';
import { UnifiedEvent } from '../../interfaces/event.interfaces';
import { formatDateRange } from '../../../utils/date.utils';

@Component({
  selector: 'app-event',
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  @Input({ required: true, alias: 'event' })
  event!: UnifiedEvent;

  @Input() 
  event_tag?: 'upcoming' | 'past' | 'recurring';

  format_date_range(date: string, duration: number) {
    return formatDateRange(date, duration);
  }
}
