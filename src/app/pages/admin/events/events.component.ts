import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Event } from '../../../interfaces/event.interfaces';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { EventComponent } from '../../../components/event/event.component';

@Component({
  selector: 'app-events',
  imports: [MatTabsModule, EventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  private dashboard_service = inject(DashboardService);
  events = signal<Event[]>([
    {
      _id: '1',
      name: 'Annual Youth Conference',
      description:
        'A 3-day event focused on youth empowerment, workshops, and worship sessions.',
      type: 'recurring',
      venue: 'Lagos City Hall',
      duration: 3,
      month: 'August',
      start_date: '2025-08-12',
      created_at: '2025-07-01T10:30:00Z',
      modified_at: '2025-07-15T08:45:00Z',
    },
    {
      _id: '2',
      name: 'Leaders Retreat',
      description: 'A one-day leadership retreat for all regional leaders.',
      type: 'one-time',
      venue: 'Obudu Mountain Resort',
      duration: 1,
      start_date: '2025-11-05',
      created_at: '2025-09-20T14:00:00Z',
      modified_at: '2025-09-25T09:15:00Z',
    },
    {
      _id: '3',
      name: 'Monthly Prayer Meeting',
      description:
        'A recurring monthly meeting focused on intercessory prayer.',
      type: 'recurring',
      venue: 'Church Auditorium',
      duration: 1,
      month: 'Every month',
      start_date: '2025-10-01',
      created_at: '2025-08-10T11:20:00Z',
      modified_at: '2025-09-01T17:00:00Z',
    },
    {
      _id: '4',
      name: 'Christmas Outreach',
      description:
        'Community outreach with carols, gift distribution, and evangelism.',
      type: 'one-time',
      venue: 'Community Park',
      duration: 2,
      month: 'December',
      start_date: '2025-12-23',
      created_at: '2025-10-10T12:00:00Z',
      modified_at: '2025-10-25T09:30:00Z',
    },
    {
      _id: '5',
      name: 'Mid-Year Thanksgiving',
      description:
        'A celebration service marking the halfway point of the year.',
      type: 'one-time',
      venue: 'Main Auditorium',
      duration: 1,
      month: 'June',
      start_date: '2025-06-30',
      created_at: '2025-05-10T10:00:00Z',
      modified_at: '2025-05-12T13:45:00Z',
    },
  ]);

  async ngOnInit(): Promise<void> {
    // this.events.set(await this.dashboard_service.fetchEvents())
  }
}
