import {
  OnInit,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  QueryList,
  signal,
  Signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  EmailValidator,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { AgeCategoryComponent } from '../../components/age-category/age-category.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { FlutterwaveCallbackResponse } from '../../interfaces/payment.interfaces';
import { Person } from '../../interfaces/person.interface';
import { RegistrationDataService } from '../../services/registration-data.service';
import { RegistrationService } from '../../services/registration.service';
declare var FlutterwaveCheckout: any;

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
  reg_data_service = inject(RegistrationDataService);
  readonly dialog = inject(MatDialog);

  constructor(
    private reg_service: RegistrationService,
    private cdr: ChangeDetectorRef
  ) {}

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
    first_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    last_name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z]*')]),
    gender: new FormControl(null, Validators.requiredTrue),
    email: new FormControl('', [Validators.email, Validators.required]),
    age: new FormControl(null, [
      Validators.min(5),
      Validators.max(25),
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
    parish: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
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

  resetFormGroup(form: FormGroup) {
    form.reset();
  }

  resetAllFormData(all: boolean) {
    // considering this functionality is needed for both saving person data and final submission, an 'all' parameter is needed to know if to clear all or partially all. If all is true, it means it is final submission, hence even the registration data needs to reset
    if (all) this.reg_data_service.reset_registration_data();

    this.lp10_origin_data.reset();
    this.nonlp10_origin_data.reset();
    this.nonrccg_origin_data.reset();
    this.registration_data.reset({
      first_name: '',
      last_name: '',
      gender: null,
      email: '',
      age: null,
    });
  }

  deactivate_registration_breakdown: boolean = false;
  persons_ids: number[] = [0];
  database_saved_ids: string[] = [];

  async saveData() {
    console.log('Errors', this.registration_data.invalid);
    console.log('Invalid', this.registration_data.invalid);

    if (this.registration_data.invalid) return;

    const person: Person = {
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
        '',
      province:
        (this.origin === 'non-lp10' &&
          this.nonlp10_origin_data.value.province) ||
        '',
      denomination:
        (this.origin === 'non-rccg' &&
          this.nonrccg_origin_data.value.denomination) ||
        '',
      details:
        (this.origin === 'non-rccg' &&
          this.nonrccg_origin_data.value.details) ||
        '',
      hasPaid: false,
    };

    // that is, if the length of the array (number of saved data) is more than 1
    if (
      this.persons_ids.length !== 1 &&
      this.current_registration() + 1 === this.persons_ids.length
    )
      this.reg_data_service.update_person_record(person);
    else
      this.persons_ids.push(this.reg_data_service.add_persons_record(person));

    console.log(this.reg_data_service.fetch_all_registered_persons_records());

    // in other words, if registration is more than a single person
    if (this.current_registration() !== this.total_number_registering()) {
      this.current_registration = signal(this.current_registration() + 1);

      // disable changing registration data once a single person's data has been submitted
      this.deactivate_registration_breakdown = true;
      this.resetAllFormData(false);

      return;
    }

    const saved_ids = await this.reg_service.sendPersonDataToDatabase();

    // store up the ids of the persons just saved into the database in the array so paymentStatus can easily be updated for each of them after payment
    if (saved_ids) this.database_saved_ids = saved_ids;

    // this.resetAllFormData(true)
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
      pages_container.classList.add('phone-screen:translate-x-[calc(-101%)]');
    } else {
      pages_container.classList.add('transform');
      pages_container.classList.add('translate-x-[calc(-200%+19px)]');
      pages_container.classList.add('phone-screen:translate-x-[calc(-200%)]');
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
      'phone-screen:translate-x-[calc(-101%)]',
      'translate-x-0'
    );
  }

  previewData() {
    this.nextStep();

    console.log('data registration preview');
  }

  payers_name = signal<string>('');
  payers_email = signal<string>('');
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Result', result);

      if (result !== undefined) {
        this.payers_name.update((data) => result.payers_name);
        this.payers_email.update((data) => result.payers_email);
      }

      this.makePaymentWithFlutterwave();
    });
  }

  goToMakePaymentStep() {
    if (
      this.reg_data_service.fetch_all_registered_persons_records().length === 1
    )
      {
        this.makePaymentWithPaystack();
        return }

    this.openDialog();
  }

  protected flutter_response: FlutterwaveCallbackResponse | undefined;
  successful_payment = signal(false);

  makePaymentWithFlutterwave() {
    const persons: Person[] =
      this.reg_data_service.fetch_all_registered_persons_records();

    const commonPaymentParams = {
      public_key: environment.flutterwave.publick_key,
      tx_ref: `lp10_convention_${Date.now()}`,
      amount: this.reg_data_service.get_total_fee_of_all_registration(),
      currency: 'NGN',
      payment_options: 'banktransfer, card, account, opay',
      onclose: () => {
        this.onFlutterWindowClosure();
      },
      customizations: {
        title: 'LP10 Event Portal',
        description: 'RCCG Convention 2025 with LP10',
      },
    };

    if (persons.length > 1) {
      const modal = FlutterwaveCheckout({
        ...commonPaymentParams,
        customer: {
          email: this.payers_email(),
          name: this.payers_name(),
        },
        callback: (response: FlutterwaveCallbackResponse) => {
          console.log(response);

          this.flutter_response = response;
          this.onFlutterWindowClosure();
          modal.close();
        },
      });
    } else {
      const modal = FlutterwaveCheckout({
        ...commonPaymentParams,
        customer: {
          email: persons[0].email,
          name: persons[0].first_name,
        },
        callback: (response: FlutterwaveCallbackResponse) => {
          console.log(response);

          this.flutter_response = response;
          this.onFlutterWindowClosure();
          modal.close();
        },
      });
    }
  }

  async makePaymentWithPaystack() {
    const persons: Person[] =
      this.reg_data_service.fetch_all_registered_persons_records();

    persons.length > 1
      ? this.reg_service.makePaymentWithPaystack(
          this.payers_email(),
          this.reg_data_service.get_total_fee_of_all_registration()
        )
      : this.reg_service.makePaymentWithPaystack(
          persons[0].email,
          this.reg_data_service.get_total_fee_of_all_registration()
        );
    
    return
  }

  @ViewChild('loader')
  loader!: ElementRef<HTMLDivElement>;

  toggleLoader() {
    if (this.loader.nativeElement.classList.contains('flex'))
      this.loader.nativeElement.classList.replace('flex', 'hidden');
    else this.loader.nativeElement.classList.replace('hidden', 'flex');
  }

  async onFlutterWindowClosure() {
    if (typeof this.flutter_response === 'undefined') return;
    // if (this.flutter_response.status !== 'successful') return

    this.toggleLoader();

    // verify payment from server as recommended by flutterwave
    const payment_verification = await this.reg_service.validatePayment(
      this.flutter_response.transaction_id,
      this.flutter_response.amount,
      this.database_saved_ids
    );
    if (payment_verification.status !== 'valid') {
      console.log('payment is not valid from backend');
      this.toggleLoader();
      return;
    }

    this.successful_payment.update(() => true);
    this.nextStep();
    this.toggleLoader();
  }
}
