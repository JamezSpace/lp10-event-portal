import {
  Component,
  ElementRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { StatComponent } from '../../../components/stat/stat.component';
import { Statistics } from '../../../interfaces/registration.interfaces';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { PersonEntityWithPayer } from '../../../interfaces/person.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { computeAgeFromDob } from '../../../../utils/date.utils';
import { MatDialog } from '@angular/material/dialog';
import { VerifyRegistrationDialogComponent } from '../../../components/dialogs/verify-registration-dialog/verify-registration-dialog.component';

@Component({
  selector: 'app-events-reg',
  imports: [StatComponent, MatPaginatorModule],
  templateUrl: './events-reg.component.html',
  styleUrl: './events-reg.component.css',
})
export class EventsRegComponent {
  private dashboard_service = inject(DashboardService);
  private dialog = inject(MatDialog);

  statistics: Statistics[] = [
    {
      label: 'total registrations',
      value: 1204,
      type: 'others',
    },
    {
      label: 'total revenue',
      value: 240800,
      type: 'currency',
    },
    {
      label: 'checked-in attendance',
      value: 94,
      type: 'others',
    },
  ];

  persons = signal<PersonEntityWithPayer[]>([]);
  pagination = this.dashboard_service.pagination;
  async fetchPersonsCheckedIn(page: number = 1, limit: number = 10): Promise<void> {
    try {
      this.persons.set(await this.dashboard_service.fetchPersonsCheckedIn(page, limit));
    } catch (error) {
      console.error('Failed to fetch Persons in component:', error);
    }
  }

  onPageChange(event: PageEvent) {
    const page = event.pageIndex + 1;
    const limit = event.pageSize;
    this.fetchPersonsCheckedIn(page, limit);
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
