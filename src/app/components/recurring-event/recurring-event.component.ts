import { Component, inject, Input } from '@angular/core';
import { RecurringEventUiModel } from '../../models/ui-models/recurring-events.ui-model';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceToComponentDataHandling } from '../../models/service-component.model';
import { DashboardService } from '../../services/admin/dashboard/dashboard.service';

@Component({
  selector: 'app-recurring-event',
  imports: [],
  templateUrl: './recurring-event.component.html',
  styleUrl: './recurring-event.component.css',
})
export class RecurringEventComponent {
  private dashboardService = inject(DashboardService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialog);

  openDeleteDialog() {
    const deleteDialog = this.dialogRef.open(DeleteDialogComponent, {
      hasBackdrop: true,
    });

    deleteDialog.afterClosed().subscribe(async (user_choice) => {
      if (user_choice.choice) await this.deleteEvent();
    });
  }
  @Input({ required: true, alias: 'event' })
  event!: RecurringEventUiModel;

  async deleteEvent() {
    let service_response!: ServiceToComponentDataHandling;

    const response = await this.dashboardService.deleteRecurringEvent(
      this.event._id!
    );

    service_response = response;

    if (service_response.error)
      this.snackBar.open(`${service_response.error}`, '', { duration: 3000 });
  }
}
