import { Component, inject, Input } from '@angular/core';
import { formatDateRange } from '../../../utils/date.utils';
import { ServiceToComponentDataHandling } from '../../models/service-component.model';
import { DashboardService } from '../../services/admin/dashboard/dashboard.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { UnifiedEventUIModel } from '../../models/ui-models/events.ui-model';

@Component({
  selector: 'app-event',
  imports: [],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  private dashboardService = inject(DashboardService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialog);

  @Input({ required: true, alias: 'event' })
  event!: UnifiedEventUIModel;

  isRegistrationComplete() {    
    if (this.event.platform === 'on-site' && this.event.venue) return true;

    return false;
  }

  @Input()
  event_tag?: 'upcoming' | 'past' | 'recurring';

  format_date_range(date: string, duration: number) {
    return formatDateRange(date, duration);
  }

  openDeleteDialog() {
    const deleteDialog = this.dialogRef.open(DeleteDialogComponent, {
      hasBackdrop: true,
    });

    deleteDialog.afterClosed().subscribe(async (user_choice) => {
      if (user_choice.choice) await this.deleteEvent();
    });
  }

  async deleteEvent() {
    let service_response!: ServiceToComponentDataHandling;

    if (this.event_tag === 'recurring') {
      const response = await this.dashboardService.deleteRecurringEvent(
        this.event._id!
      );

      service_response = response;
    } else if (this.event_tag === 'upcoming') {
      const response = await this.dashboardService.deleteEvent(this.event._id!);

      service_response = response;
    }

    if (service_response.error)
      this.snackBar.open(`${service_response.error}`, '', { duration: 3000 });
  }
}
