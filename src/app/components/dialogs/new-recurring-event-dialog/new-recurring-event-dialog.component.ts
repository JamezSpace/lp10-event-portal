import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import { extractNumberValueFromFormControl, extractStringValueFromFormControl } from '../../../../utils/components.utils';

@Component({
  selector: 'app-new-recurring-event-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './new-recurring-event-dialog.component.html',
  styleUrl: './new-recurring-event-dialog.component.css',
})
export class NewRecurringEventDialogComponent {
    private snackBar = inject(MatSnackBar)
    private dashboard_Service = inject(DashboardService)
    private dialogRef = inject(MatDialogRef<NewRecurringEventDialogComponent>)

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

    recurring_event = new FormGroup({
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        month: new FormControl('', Validators.required),
        duration_in_days: new FormControl(null, Validators.required)
    })

    async submitEvent(event: any) {
        event.preventDefault()

        if(this.recurring_event.invalid) {
            this.snackBar.open("Incomplete Credentials!", '', {duration: 3000})
            return
        }

        const saved = await this.dashboard_Service.createRecurringEvent({
            name: extractStringValueFromFormControl(this.recurring_event.controls.name),
            month: extractStringValueFromFormControl(this.recurring_event.controls.month),
            description: extractStringValueFromFormControl(this.recurring_event.controls.description),
            duration_in_days: extractNumberValueFromFormControl(this.recurring_event.controls.duration_in_days)
        })

        saved ? this.dialogRef.close() : this.snackBar.open("Oops! Something went wrong...", '', {duration: 3000})
    }
}
