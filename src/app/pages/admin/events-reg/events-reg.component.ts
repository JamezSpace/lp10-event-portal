import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { StatComponent } from '../../../components/stat/stat.component';
import { Statistics } from '../../../models/ui-models/statistics.ui-model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { computeAgeFromDob } from '../../../../utils/date.utils';
import { MatDialog } from '@angular/material/dialog';
import { VerifyRegistrationDialogComponent } from '../../../components/dialogs/verify-registration-dialog/verify-registration-dialog.component';
import { VerifyRegistrationUiModel } from '../../../models/ui-models/registration.ui-model';

@Component({
  selector: 'app-events-reg',
  imports: [StatComponent, MatPaginatorModule],
  templateUrl: './events-reg.component.html',
  styleUrl: './events-reg.component.css',
})
export class EventsRegComponent implements OnInit {
  private dashboard_service = inject(DashboardService);
  private dialog = inject(MatDialog);
  registrations = this.dashboard_service.registrations
  statistics = this.dashboard_service.statistics

  loading = signal(true)

  async ngOnInit(): Promise<void> {
      if(this.registrations().length === 0)
        await this.dashboard_service.fetchEventRegistrations()
  }

  persons_checked_in = this.dashboard_service.persons_checked_in
  persons_details = signal<VerifyRegistrationUiModel[]>([]);
  pagination = this.dashboard_service.pagination;

  onPageChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.dashboard_service.fetchPersonsCheckedIn(page, limit);
  }

  constructFullName(first_name: string, last_name: string) {
    return new String().concat(last_name, ' ', first_name);
  }

  getAge(year_of_birth: number) {
    return computeAgeFromDob(year_of_birth)
  }

  // to open the qr code scanning and verification dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(VerifyRegistrationDialogComponent, {
        panelClass: 'dialog-responsive'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        // receive data of all checked in from the dialog
        console.log("result after dialog closed: ", result);

      }
    });
  }

  // qr code scanning logic
  async verifyRegistration() {
    this.openDialog()
  }
}
