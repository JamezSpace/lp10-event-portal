import { Component, inject, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { DashboardService } from '../../../services/admin/dashboard/dashboard.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  extractDateComponentsFromFormControl,
  extractNumberValueFromFormControl,
  extractStringValueFromFormControl,
} from '../../../../utils/components.utils';
import { MatDialogRef } from '@angular/material/dialog';
import { ServiceToComponentDataHandling } from '../../../models/service-component.model';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-new-event-dialog',
  imports: [MatSelectModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './new-event-dialog.component.html',
  styleUrl: './new-event-dialog.component.css',
})
export class NewEventDialogComponent {
  private snackBar = inject(MatSnackBar);
  private dashboard_service = inject(DashboardService);
  private event_dialog = inject(MatDialogRef<NewEventDialogComponent>);
  event_type = signal<string>('recurring');
  platform_selected = signal<string>('on-site');
  recurring_events = this.dashboard_service.recurring_events;
  events = this.dashboard_service.events;

  onChangeEventType(event: any) {
    let event_type_selected = event.target.dataset.type;

    this.event_type.set(event_type_selected);
  }

  onSelectPlatform(platform_type: any) {
    this.platform_selected.set(platform_type);
  }

  //   onSelectRecurringEvent(event: any) {
  //     // this.recurring_event_selected.set(event);
  //     console.log(event.target.value);

  //   }

  is_date_selected_valid = signal(true);
  onInput(event: any) {
    let date_selected = event.target.value;

    if (new Date(date_selected).getTime() < Date.now())
      this.is_date_selected_valid.set(false);
    else this.is_date_selected_valid.set(true);
  }

  is_paid_event = signal(false);

  new_event_form_data = new FormGroup({
    event_name: new FormControl(null, Validators.required),
    description: new FormControl(null, Validators.required),
    date_of_event: new FormControl(null, Validators.required),
    time_of_event: new FormControl(null, Validators.required),
    venue: new FormControl(null),

    teachers_fee: new FormControl(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(10000),
    ]),
    teens_fee: new FormControl(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(10000),
    ]),
    children_fee: new FormControl(null, [
      Validators.required,
      Validators.min(1000),
      Validators.max(10000),
    ]),

    recurring_event_selected: new FormControl(null),
  });

  isRecurringeventFormdataValid() {
    // check the specific fields for recurring events
  }

  isOnetimeeventFormdataValid() {
    if (
      this.new_event_form_data.controls.event_name.invalid ||
      this.new_event_form_data.controls.date_of_event.invalid ||
      this.new_event_form_data.controls.time_of_event.invalid
    )
      return false;

    return true;
  }

  arePaymentFieldsFilled() {
    if (
      this.new_event_form_data.controls.teachers_fee.invalid ||
      this.new_event_form_data.controls.teens_fee.invalid ||
      this.new_event_form_data.controls.children_fee.invalid
    )
      return false;

    return true;
  }

  isLiveEvent = signal(false);
  toggleLiveEventStatus(){
    this.isLiveEvent.set(!this.isLiveEvent());
  }

  async submitEvent() {
    let service_response!: ServiceToComponentDataHandling;

    if (
      this.event_type() === 'one-time' &&
      !this.isOnetimeeventFormdataValid()
    ) {
      this.snackBar.open('Please fill out all fields', 'OK', {
        duration: 3000,
      });
      return;
    } else if (
      this.event_type() === 'one-time' &&
      !this.is_date_selected_valid
    ) {
      this.snackBar.open('Please select a valid date', 'OK', {
        duration: 3000,
      });
      return;
    } else if (this.is_paid_event() && !this.arePaymentFieldsFilled()) {
      this.snackBar.open('Please fill in the prices for the paid event', 'OK', {
        duration: 3000,
      });
      return;
    }

    if (this.event_type() === 'recurring') {
      let res: any =
        this.new_event_form_data.controls.recurring_event_selected.value;

      const response = await this.dashboard_service.createEvent({
        name: res.name,
        recurring_event_id: res._id,
        platform: this.platform_selected(),
        paid_event: this.is_paid_event(),
        type: 'recurring',
        year: new Date().getFullYear(),
        live: this.isLiveEvent(),
        venue: extractStringValueFromFormControl(
          this.new_event_form_data.controls.venue
        ),
        price: [
          {
            category: 'teacher',
            amount: extractNumberValueFromFormControl(
              this.new_event_form_data.controls.teachers_fee
            ),
          },
          {
            category: 'teenager',
            amount: extractNumberValueFromFormControl(
              this.new_event_form_data.controls.teens_fee
            ),
          },
          {
            category: 'child',
            amount: extractNumberValueFromFormControl(
              this.new_event_form_data.controls.children_fee
            ),
          },
        ],
      });

      service_response = response;
    } else {
      const response = await this.dashboard_service.createEvent({
        name: extractStringValueFromFormControl(
          this.new_event_form_data.controls.event_name
        ),
        type: 'one-time',
        platform: this.platform_selected(),
        paid_event: this.is_paid_event(),
        year: extractDateComponentsFromFormControl(
          this.new_event_form_data.controls.date_of_event
        )?.year,
        venue: extractStringValueFromFormControl(
          this.new_event_form_data.controls.venue
        ),
        live: this.isLiveEvent(),
        start_date: extractDateComponentsFromFormControl(
          this.new_event_form_data.controls.date_of_event
        )?.date,
        start_time: extractStringValueFromFormControl(
          this.new_event_form_data.controls.time_of_event
        ),
        price: [
          {
            category: 'teacher',
            amount: extractNumberValueFromFormControl(
              this.new_event_form_data.controls.teachers_fee
            ),
          },
          {
            category: 'teenager',
            amount: extractNumberValueFromFormControl(
              this.new_event_form_data.controls.teens_fee
            ),
          },
          {
            category: 'child',
            amount: extractNumberValueFromFormControl(
              this.new_event_form_data.controls.children_fee
            ),
          },
        ],
      });

      service_response = response;
    }

    if (service_response.error) {
      return this.snackBar.open(service_response.error, '', { duration: 3000 });
    }

    if (service_response.success) return this.event_dialog.close();
  }
}
