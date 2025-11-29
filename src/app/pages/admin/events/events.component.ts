import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { 
    EventType,
    EventUIModel,
    UnifiedEventUIModel
} from '../../../models/ui-models/events.ui-model';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { EventComponent } from '../../../components/event/event.component';
import { MatDialog } from '@angular/material/dialog';
import { NewEventDialogComponent } from '../../../components/dialogs/new-event-dialog/new-event-dialog.component';
import { NewRecurringEventDialogComponent } from '../../../components/dialogs/new-recurring-event-dialog/new-recurring-event-dialog.component';
import { RecurringEventComponent } from "../../../components/recurring-event/recurring-event.component";
import { RecurringEventUiModel } from '../../../models/ui-models/recurring-events.ui-model';

@Component({
  selector: 'app-events',
  imports: [MatTabsModule, EventComponent, RecurringEventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  private dashboard_service = inject(DashboardService);
  private dialog_ref = inject(MatDialog);

  events: Signal<UnifiedEventUIModel[]> = computed(() => {
    return this.normalizeEvents(this.dashboard_service.events(), this.dashboard_service.recurring_events())
  });

  // 💡 Computed signals for filtering
  upcoming_events = computed(() =>
    this.events().filter((e) => this.isUpcoming(e.start_date))
  );

  past_events = computed(() =>
    this.events().filter((e) => e.type !== 0 && this.isPast(e.start_date))
  );

  recurring_events = computed(() =>
    this.dashboard_service.recurring_events().map((r_event) => {
      return { ...r_event, type: EventType.recurring };
    })
  );

  async ngOnInit(): Promise<void> {
    try {
      if (this.dashboard_service.events().length === 0)
        await this.dashboard_service.fetchEvents();

      if (this.dashboard_service.recurring_events().length === 0)
        await this.dashboard_service.fetchRecurringEvents();

    //   const events = this.dashboard_service.events,
    //     recurring = this.dashboard_service.recurring_events;

    //   this.events.set(this.normalizeEvents(events(), recurring()));
    } catch (error) {
      console.error('Failed to fetch dashboard events:', error);
    }
  }

  normalizeEvents(
    events: EventUIModel[],
    recurringEvents: RecurringEventUiModel[]
  ): UnifiedEventUIModel[] {
    if (events.length === 0) return [];

    return events.map((e) => {
      const recurring = e.recurring_event_id
        ? recurringEvents.find((r) => r._id === e.recurring_event_id)
        : undefined;

        return {
          _id: e._id,
          name: recurring?.name ?? e.name,
          description: recurring?.description,
          platform: e.platform,
          paid_event: e.paid_event,
          type: EventType[e.type],
          venue: e.venue,
          year: e.year,
          live: e.live,
          duration_in_days: recurring?.duration_in_days,
          month: recurring?.month,
          start_date: e.start_date,
        };

    //   let m = {
    //     _id: e._id,
    //     name: recurring?.name ?? e.name,
    //     description: recurring?.description ?? e.description,
    //     type: EventType[e.type],
    //     venue: e.venue,
    //     duration_in_days: recurring?.duration_in_days,
    //     month: recurring?.month,
    //     start_date: e.start_date,
    //   };

    //   console.log(m);

    //   return {
    //     name: 'jam',
    //     type: 1,
    //     start_date: new Date().toISOString()
    //   };
    });
  }

  isUpcoming(date?: string): boolean {
    // this allows newly created events yet without a start date to show in the interface
    if (!date) return true;
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

  active_tab = signal('upcoming');
  toggleActiveTab(event: any) {
    switch (event.index) {
      case 0:
        this.active_tab.set('upcoming');
        break;
      case 2:
        this.active_tab.set('recurring');
        break;
    }
  }
}
