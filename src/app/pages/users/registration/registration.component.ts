import {
  OnInit,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  Signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgeCategoryComponent } from '../../../components/age-category/age-category.component';
import { PaymentDialogComponent } from '../../../components/dialogs/payment-dialog/payment-dialog.component';
import { RegistrationDataService } from '../../../services/users/registration-data/registration-data.service';
import { RegistrationService } from '../../../services/users/registration/registration.service';
import { toggleLoader } from '../../../../utils/components.utils';
import { PersonUiModel } from '../../../models/ui-models/person.ui-model';
import { PersonDTO } from '../../../models/dtos/person.dto';

@Component({
  selector: 'app-registration',
  imports: [
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule,
    AgeCategoryComponent,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  reg_data_service = inject(RegistrationDataService);
  readonly dialog = inject(MatDialog);

  constructor(private reg_service: RegistrationService) {}

  async ngOnInit(): Promise<void> {
    // cookies were used to store the zones data for 2 minutes, so that it doesn't have to be fetched from the backend every time the page is refreshed. This is to prevent overloading the backend with requests.
    const zonesCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('zones='));

    // Check if the cookie exists and is not expired
    if (!zonesCookie) {
      const zones_from_backend = await this.reg_service.fetchZones();

      // Set zones in cookies with a 2-minute expiry
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 2 * 60 * 1000); // 2 minutes in milliseconds
      document.cookie = `zones=${encodeURIComponent(
        JSON.stringify(zones_from_backend)
      )}; expires=${expiryDate.toUTCString()}; path=/`;

      this.zones.set(zones_from_backend);
    } else {
      const zones = JSON.parse(decodeURIComponent(zonesCookie.split('=')[1]));
      this.zones.set(zones);
    }

    this.zones().length === 0
      ? this.lp10_origin_data.get('zone')?.disable()
      : this.lp10_origin_data.get('zone')?.enable();
  }

  openSnackBar(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }

  current_step = signal(1);
  progress_value_step_1: number = 20;
  progress_value_step_2: number = 0;
  date_of_event: String = 'Friday 24th November, 2024';
  time_of_event: String = '8am';
  venue: String = 'LP10 Provincial HQ';
  address: String = 'No 1, Omotoye estate, Mulero Agege';

  total_fee = this.reg_data_service.get_total_fee_of_all_registration;

  total_number_registering = this.reg_data_service.get_total_number_registering;

  current_registration: Signal<number> = computed(() => {
    return this.reg_data_service.get_total_number_registering() ? 1 : 0;
  });

  registration_data = new FormGroup({
    first_name: new FormControl(null, [
      Validators.required,
      Validators.pattern('[a-zA-Z]*'),
    ]),
    last_name: new FormControl(null, [
      Validators.required,
      Validators.pattern('[a-zA-Z]*'),
    ]),
    gender: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.email, Validators.required]),
    age: new FormControl<number | null>(null, [
      Validators.min(5),
      Validators.max(70),
      Validators.required,
    ]),
  });

  origin: string = 'lp10';
  zones = signal<string[]>([]);

  onLp10Selection() {
    this.origin = 'lp10';
  }

  onNonLp10Selection() {
    this.origin = 'non-lp10';
  }

  onNonRccg() {
    this.origin = 'non-rccg';
  }

  lp10_origin_data = new FormGroup({
    zone: new FormControl('', Validators.required),
    parish: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  nonlp10_origin_data = new FormGroup({
    region: new FormControl('', Validators.required),
    province: new FormControl('', Validators.required),
  });

  nonrccg_origin_data = new FormGroup({
    denomination: new FormControl('', Validators.required),
    details: new FormControl(''),
  });

  get allFieldsChanged(): boolean {
    return Object.values(this.registration_data.controls).every(
      (control) => control.dirty
    );
  }

  resetAllFormData() {
    this.lp10_origin_data.reset();
    this.nonlp10_origin_data.reset();
    this.nonrccg_origin_data.reset();

    this.registration_data.reset();
    this.clearAllErrorsOnFormControls(this.registration_data);
  }

  clearAllErrorsOnFormControls(form_group: FormGroup) {
    for (const control in form_group.controls) {
      if (!Object.hasOwn(form_group.controls, control)) continue;

      const c = form_group.controls[control];

      c.setErrors(null);
    }
  }

  deactivate_registration_breakdown: boolean = false;
  persons_ids: number[] = [0];
  database_saved_ids: string[] = [];

  logControlsAndValidity() {
    switch (this.origin) {
      case 'lp10':
        console.log(`Zone valid: ${this.lp10_origin_data.controls.zone.valid}`);
        console.log(
          `Parish valid: ${this.lp10_origin_data.controls.parish.valid}`
        );
        break;
      case 'non-lp10':
        console.log(
          `Pronvince valid: ${this.nonlp10_origin_data.controls.province.valid}`
        );
        console.log(
          `Region valid: ${this.nonlp10_origin_data.controls.region.valid}`
        );
        break;
      case 'non-rccg':
        console.log(
          `Denomination valid: ${this.nonrccg_origin_data.controls.denomination.valid}`
        );
        console.log(
          `Details valid: ${this.nonrccg_origin_data.controls.details.valid}`
        );
        break;
    }

    console.log(`Age valid: ${this.registration_data.controls.age.valid}`);
    console.log(`Email valid: ${this.registration_data.controls.email.valid}`);
    console.log(
      `First name valid: ${this.registration_data.controls.first_name.valid}`
    );
    console.log(
      `Last name valid: ${this.registration_data.controls.last_name.valid}`
    );
    console.log(
      `Gender valid: ${this.registration_data.controls.gender.valid}`
    );
  }

  allNecessaryFieldsValid() {
    if (this.registration_data.invalid) return false;

    let valid: boolean = true;
    switch (this.origin) {
      case 'lp10':
        valid = !this.lp10_origin_data.invalid;
        break;
      case 'non-lp10':
        valid = !this.nonlp10_origin_data.invalid;
        break;
      case 'non-rccg':
        valid = !this.nonrccg_origin_data.invalid;
        break;
      default:
        break;
    }

    if (!valid)
      this.openSnackBar(
        'Almost there! Please fill out all required fields in the Origin section.',
        '',
        5000
      );
    return valid;
  }

  async saveData() {
    // this triggers origin formgroup validation on submit of the form
    switch (this.origin) {
      case 'lp10':
        this.lp10_origin_data.markAllAsTouched();
        break;
      case 'non-lp10':
        this.nonlp10_origin_data.markAllAsTouched();
        break;
      case 'non-rccg':
        this.nonrccg_origin_data.markAllAsTouched();
        break;
    }

    // DEBUG
    // this.logControlsAndValidity();

    if (!this.allNecessaryFieldsValid()) return;

    const person: PersonUiModel = {
      id: this.persons_ids[this.persons_ids.length - 1],
      first_name: new String(
        this.registration_data.value.first_name
      ).toString(),
      last_name: new String(this.registration_data.value.last_name).toString(),
      email: new String(this.registration_data.value.email).toString(),
      gender: new String(this.registration_data.value.gender).toString(),
      year_of_birth:
        new Date().getFullYear() -
        parseInt(new String(this.registration_data.value.age).toString()),
      origin: this.origin,
      parish:
        (this.origin === 'lp10' && this.lp10_origin_data.value.parish) || '',
      zone: (this.origin === 'lp10' && this.lp10_origin_data.value.zone) || '',
      region:
        (this.origin === 'non-lp10' && this.nonlp10_origin_data.value.region) ||
        undefined,
      province:
        (this.origin === 'non-lp10' &&
          this.nonlp10_origin_data.value.province) ||
        this.origin,
      denomination:
        (this.origin === 'non-rccg' &&
          this.nonrccg_origin_data.value.denomination) ||
        undefined,
      details:
        (this.origin === 'non-rccg' &&
          this.nonrccg_origin_data.value.details) ||
        undefined
    };

    // that is, if the length of the array (number of saved data) is more than 1
    if (
      this.persons_ids.length !== 1 &&
      this.current_registration() + 1 === this.persons_ids.length
    )
      this.reg_data_service.update_person_record(person);
    else
      this.persons_ids.push(this.reg_data_service.add_persons_record(person));

    // in other words, if registration is more than a single person
    if (this.current_registration() !== this.total_number_registering()) {
      this.current_registration = signal(this.current_registration() + 1);

      // disable changing registration data once a single person's data has been submitted
      this.deactivate_registration_breakdown = true;
      this.resetAllFormData();

      return;
    }

    const saved_ids = await this.reg_service.sendPersonDataToDatabase();

    // store up the ids of the persons just saved into the database in the array so paymentStatus can easily be updated for each of them after payment
    if (saved_ids) this.database_saved_ids = saved_ids;

    this.previewData();
  }

  @ViewChild('pagesContainer')
  pagesContainer!: ElementRef<HTMLElement>;

  @ViewChild('mainContainer')
  mainContainer!: ElementRef<HTMLElement>;

  transition_duration: number = 400;

  nextStep() {
    this.current_step.update((num) => ++num);

    // move to next page
    // this.pagesContainer.nativeElement.style.transform = this.current_step() !== 3 ?
    //      `translateX(calc(-100% + 19px))` : `translateX(calc(-200% + 19px))`

    const pages_container = this.pagesContainer.nativeElement;

    if (this.current_step() !== 3) {
      pages_container.classList.add('transform');
      pages_container.classList.add('translate-x-[calc(-100%+19px)]');
      pages_container.classList.add('max-[465px]:translate-x-[calc(-101%)]');
    } else {
      pages_container.classList.add('transform');
      pages_container.classList.add('translate-x-[calc(-200%+19px)]');
      pages_container.classList.add('max-[465px]:translate-x-[calc(-200%)]');
    }

    // scroll to the top on the next page
    setTimeout(() => {
      window.scrollBy({ top: -1000, behavior: 'smooth' });
    }, this.transition_duration);
  }

  previousStep() {
    if (this.current_step() === 1) return;
    this.current_step.update((num) => --num);

    const pages_container = this.pagesContainer.nativeElement;

    // move to previous page
    pages_container.classList.replace(
      'translate-x-[calc(-100%+19px)]',
      'translate-x-0'
    );
    pages_container.classList.replace(
      'max-[465px]:translate-x-[calc(-101%)]',
      'translate-x-0'
    );
  }

  previewData() {
    this.nextStep();

    console.log('data registration preview');
  }

  payers_name = signal<string>('');
  payers_email = signal<string>('');
  openDialogToMakePaymentForMultiplePersons(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result', result);

      if (result !== undefined) {
        this.payers_name.update((data) => result.payers_name);
        this.payers_email.update((data) => result.payers_email);
      }

      this.initPayment();
    });
  }

  goToMakePaymentStep() {
    if (
      this.reg_data_service.fetch_all_registered_persons_records().length === 1
    ) {
      // show loader
      toggleLoader(this.loader);
      this.initPayment();
      return;
    }

    this.openDialogToMakePaymentForMultiplePersons();
  }

  async initPayment() {
    const persons: PersonDTO[] = 
      this.reg_data_service.fetch_all_registered_persons_records();

    console.log(
      'Ids of persons just saved to the database',
      this.database_saved_ids
    );

    const transaction_response =
      persons.length > 1
        ? await this.reg_service.makePaymentWithCredo(
            this.payers_name(),
            this.payers_email(),
            this.reg_data_service.get_total_fee_of_all_registration(),
            this.database_saved_ids
          )
        : await this.reg_service.makePaymentWithCredo(
            persons[0].last_name,
            persons[0].email,
            this.reg_data_service.get_total_fee_of_all_registration(),
            this.database_saved_ids
          );

    // hide loader
    toggleLoader(this.loader);
    if(!transaction_response) return 
    
    if (!transaction_response.success) {
      this.openSnackBar(transaction_response.error, '', 5000);
      return;
    }

    if (transaction_response.ref) {
      const updated = await this.reg_service.addTransactionRefToPersonsDetails(
        this.database_saved_ids,
        {
          transaction_ref: transaction_response.ref,
        }
      );
    }

    return;
  }

  @ViewChild('loader')
  loader!: ElementRef<HTMLDivElement>;
}
