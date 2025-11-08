import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { RecurringEvent } from '../../../interfaces/event.interfaces';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { Event } from '../../../interfaces/event.interfaces';

@Component({
  selector: 'app-new-event-dialog',
  imports: [MatSelectModule],
  templateUrl: './new-event-dialog.component.html',
  styleUrl: './new-event-dialog.component.css',
})
export class NewEventDialogComponent implements OnInit {
  private dashboard_service = inject(DashboardService);
  event_type = signal<string>('null');
  recurring_events = signal<RecurringEvent[]>([
    {
      _id: 'evt001',
      name: 'Annual Tech Conference',
      description:
        'A yearly gathering of tech enthusiasts and professionals to discuss emerging technologies.',
      month: 'March',
      duration_in_days: 3,
      created_at: '2025-01-10T09:00:00Z',
      modified_at: '2025-01-15T14:30:00Z',
    },
    {
      _id: 'evt002',
      name: 'Summer Coding Bootcamp',
      description:
        'An intensive coding bootcamp for beginners held every summer.',
      month: 'July',
      duration_in_days: 14,
      created_at: '2025-02-20T11:45:00Z',
      modified_at: '2025-02-22T16:00:00Z',
    },
    {
      _id: 'evt003',
      name: 'End-of-Year Hackathon',
      description:
        'A competitive hackathon event to wrap up the year with innovation and creativity.',
      month: 'December',
      duration_in_days: 2,
      created_at: '2025-03-05T08:20:00Z',
      modified_at: '2025-03-06T10:00:00Z',
    },
  ]);

  async ngOnInit(): Promise<void> {}

  onChangeEventType(event: any) {
    let event_type_selected = event.target.dataset.type;

    this.event_type.set(event_type_selected);
  }

  new_event!: Event;
  async submitEvent() {
    await this.dashboard_service.createEvent(this.new_event);
  }
}
