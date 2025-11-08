import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { RecurringEvent } from '../../../interfaces/event.interfaces';

@Component({
  selector: 'app-new-recurring-event-dialog',
  imports: [],
  templateUrl: './new-recurring-event-dialog.component.html',
  styleUrl: './new-recurring-event-dialog.component.css',
})
export class NewRecurringEventDialogComponent {
    private dashboard_Service = inject(DashboardService)

    event_duration_options = [
        {
            label: "one day",
            value: 1
        },
        {
            label: "three days",
            value: 3
        },
        {
            label: "one week",
            value: 7
        }
    ]
    months = [
        'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'
    ]

    recurring_event!: RecurringEvent

    async submitEvent() {
        await this.dashboard_Service.createRecurringEvent(this.recurring_event)
    }
}
