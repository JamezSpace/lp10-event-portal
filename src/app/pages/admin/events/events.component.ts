import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  Event,
  RecurringEvent,
  UnifiedEvent,
} from '../../../interfaces/event.interfaces';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { EventComponent } from '../../../components/event/event.component';
import { MatDialog } from '@angular/material/dialog';
import { NewEventDialogComponent } from '../../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { NewRecurringEventDialogComponent } from '../../../components/dialogs/new-recurring-event-dialog/new-recurring-event-dialog.component';

@Component({
  selector: 'app-events',
  imports: [MatTabsModule, EventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  private dashboard_service = inject(DashboardService);
  private dialog_ref = inject(MatDialog);

  events = signal<UnifiedEvent[]>([]);

  // 💡 Computed signals for filtering
  upcoming_events = computed(() =>
    this.events().filter(
      (e) => e.type !== 'recurring' && this.isUpcoming(e.start_date)
    )
  );

  past_events = computed(() =>
    this.events().filter(
      (e) => e.type !== 'recurring' && this.isPast(e.start_date)
    )
  );

  recurring_events = computed(() =>
    this.events().filter((e) => e.type === 'recurring')
  );

  async ngOnInit(): Promise<void> {
    try {
      if (this.dashboard_service.events().length === 0) {
        await this.dashboard_service.fetchEvents();
      }
      if (this.dashboard_service.recurring_events().length === 0) {
        await this.dashboard_service.fetchRecurringEvents();
      }

      const events = this.dashboard_service.events,
        recurring = this.dashboard_service.recurring_events;

      this.events.set(this.normalizeEvents(events(), recurring()));
    } catch (error) {
      console.error('Failed to fetch dashboard events:', error);
    }
  }

  normalizeEvents(
    events: Event[],
    recurringEvents: RecurringEvent[]
  ): UnifiedEvent[] {
    return events.map((e) => {
      const recurring = e.recurring_event_id
        ? recurringEvents.find((r) => r._id === e.recurring_event_id)
        : undefined;

      return {
        _id: e._id,
        name: recurring?.name ?? e.name,
        description: recurring?.description,
        type: e.type,
        venue: e.venue,
        duration_in_days: recurring?.duration_in_days,
        month: recurring?.month,
        start_date: e.start_date,
        created_at: e.created_at,
        modified_at: e.modified_at,
      };
    });
  }

  isUpcoming(date?: string): boolean {
    if (!date) return false;
    const today = new Date();
    return new Date(date) >= today;
  }

  isPast(date?: string): boolean {
    if (!date) return false;
    const today = new Date();
    return new Date(date) < today;
  }

  openNewEventDialog() {
    const new_event_dialog = this.dialog_ref.open(NewEventDialogComponent, {
      hasBackdrop: true,
      panelClass: 'dialog-responsive',
    });
  }

  openNewRecurringeventDialog() {
    const recurring_event_dialog = this.dialog_ref.open(
      NewRecurringEventDialogComponent,
      {
        hasBackdrop: true,
        panelClass: 'dialog-responsive',
      }
    );
  }
}
