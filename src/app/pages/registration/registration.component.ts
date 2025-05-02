import { AfterViewInit, ChangeDetectorRef, Component, computed, ElementRef, inject, QueryList, signal, Signal, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { AgeCategoryComponent } from "../../components/age-category/age-category.component";
import { Person } from '../../models/person.model';
import { RegistrationDataService } from '../../services/registration-data.service';
import { RegistrationService } from '../../services/registration.service';
import { environment } from '../../../environments/environment';
declare var FlutterwaveCheckout: any;

@Component({
    selector: 'app-registration',
    imports: [MatProgressBarModule, MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule, MatFormFieldModule, FormsModule, AgeCategoryComponent, ReactiveFormsModule],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css'
})
export class RegistrationComponent implements AfterViewInit {
    reg_data_service = inject(RegistrationDataService);

    constructor(private regService: RegistrationService, private cdr: ChangeDetectorRef) { }

    async ngAfterViewInit(): Promise<void> {
        this.zones.set(await this.regService.fetchZones())
    }

    current_step = signal(1);
    progress_value_step_1: number = 20;
    progress_value_step_2: number = 0;
    date_of_event: String = "Friday 24th November, 2024";
    time_of_event: String = "8am";
    venue: String = "LP10 Provincial HQ";
    address: String = "No 1, Omotoye estate, Mulero Agege";

    total_fee = this.reg_data_service.get_total_fee_of_all_registration;

    total_number_registering = this.reg_data_service.get_total_number_registering;

    current_registration: Signal<number> = computed(() => {
        return this.reg_data_service.get_total_number_registering() ? 1 : 0;
    })

    registration_data = new FormGroup({
        first_name: new FormControl('', Validators.required),
        last_name: new FormControl('', Validators.required),
        gender: new FormControl('', Validators.required),
        email: new FormControl('', Validators.email),
        age: new FormControl('', [Validators.min(5), Validators.max(25)])
    })

    origin: string = 'lp10'
    zones = signal<string[]>(['']);

    onLp10Selection() {
        this.origin = 'lp10'
    }

    onNonLp10Selection() {
        this.origin = 'non-lp10'
    }

    onNonRccg() {
        this.origin = 'non-rccg'
    }

    lp10_origin_data = new FormGroup({
        zone: new FormControl('', Validators.required),
        parish: new FormControl('', Validators.required)
    })

    nonlp10_origin_data = new FormGroup({
        region: new FormControl('', Validators.required),
        province: new FormControl('', Validators.required)
    })

    nonrccg_origin_data = new FormGroup({
        denomination: new FormControl('', Validators.required),
        details: new FormControl('')
    })

    @ViewChildren('gender') gender_btns !: QueryList<ElementRef>;
    resetAllFormData(all: boolean) {
        // considering this functionality is needed for both saving person data and final submission, an 'all' parameter is needed to know if to clear all or partially all. If all is true, it means it is final submission, hence even the registration data needs to reset
        if (all) this.reg_data_service.reset_registration_data()

        // reset all form values
        this.lp10_origin_data.setValue({
            parish: '',
            zone: ''
        })
        this.nonlp10_origin_data.setValue({
            region: '',
            province: ''
        })
        this.nonrccg_origin_data.setValue({
            denomination: '',
            details: ''
        })
        this.registration_data.setValue({
            first_name: '',
            age: '',
            gender: '',
            last_name: '',
            email: ''
        })
    }

    deactivate_registration_breakdown: boolean = false
    new_person_id: number = 0;

    async saveData() {
        if (!this.registration_data.errors === null) return

        if (this.registration_data.dirty) { }

        // fetch all invalid form fields in the origin section
        let invalids: FormControl<string | null>[] = []

        if (this.origin === 'lp10' && this.lp10_origin_data.invalid) {
            if (this.lp10_origin_data.controls.parish.invalid) invalids.push(this.lp10_origin_data.controls.parish)

            if (this.lp10_origin_data.controls.zone.invalid) invalids.push(this.lp10_origin_data.controls.zone)

            return
        }
        else if (this.origin === 'non-lp10' && this.nonlp10_origin_data.invalid) {
            if (this.nonlp10_origin_data.controls.province.invalid) invalids.push(this.nonlp10_origin_data.controls.province)

            if (this.nonlp10_origin_data.controls.region.invalid) invalids.push(this.nonlp10_origin_data.controls.region)

            return
        }
        else if (this.origin === 'non-rccg' && this.nonrccg_origin_data.controls.denomination.invalid) {
            invalids.push(this.nonrccg_origin_data.controls.denomination)

            return
        }

        const person: Person = {
            id: this.new_person_id,
            first_name: new String(this.registration_data.value.first_name).toString(),
            last_name: new String(this.registration_data.value.last_name).toString(),
            email: new String(this.registration_data.value.email).toString(),
            gender: new String(this.registration_data.value.gender).toString(),
            year_of_birth: new Date().getFullYear() - parseInt(new String(this.registration_data.value.age).toString()),
            origin: this.origin,
            parish: this.origin === 'lp10' && this.lp10_origin_data.value.parish || '',
            zone: this.origin === 'lp10' && this.lp10_origin_data.value.zone || '',
            region: this.origin === 'non-lp10' && this.nonlp10_origin_data.value.region || '',
            province: this.origin === 'non-lp10' && this.nonlp10_origin_data.value.province || '',
            denomination: this.origin === 'non-rccg' && this.nonrccg_origin_data.value.denomination || '',
            details: this.origin === 'non-rccg' && this.nonrccg_origin_data.value.details || ''
        }

        if (this.new_person_id !== 0) this.reg_data_service.update_person_record(person)
        else this.new_person_id = this.reg_data_service.add_persons_record(person);

        console.log(this.reg_data_service.fetch_all_registered_persons_records());

        // in other words, if registration is more than a single person
        if (this.current_registration() !== this.total_number_registering()) {
            this.current_registration = signal(this.current_registration() + 1)

            // disable changing registration data once a single person's data has been submitted
            this.deactivate_registration_breakdown = true
            this.resetAllFormData(false)

            return
        }

        await this.regService.sendToDatabase()
        // this.resetAllFormData(true)
        this.previewData()
    }

    @ViewChild('pagesContainer')
    pagesContainer!: ElementRef<HTMLElement>;

    @ViewChild('mainContainer')
    mainContainer!: ElementRef<HTMLElement>;

    transition_duration: number = 400;

    nextStep() {
        this.current_step.update(num => ++num)

        // move to next page
        this.pagesContainer.nativeElement.style.transform = `translateX(calc(-100% + 19px))`

        // scroll to the top on the next page
        setTimeout(() => {
            window.scrollBy({ top: -1000, behavior: 'smooth' })
        }, this.transition_duration)
    }

    previousStep() {
        if (this.current_step() === 1) return
        this.current_step.update(num => --num)

        // move to previous page
        this.pagesContainer.nativeElement.style.transform = `translateX(calc(0%))`

        // listener for edit on the form

    }

    previewData() {
        this.nextStep();

        console.log("data registration preview");
    }

    makePayment() {
        const person: Person[] = this.reg_data_service.fetch_all_registered_persons_records()

        if(person.length > 1) FlutterwaveCheckout({
            public_key: environment.flutterwave.publick_key,
            tx_ref: new String().concat('lp10_convention_', Date.now().toString()),
            amount: 5000,
            currency: 'NGN',
            payment_options: 'card, banktransfer, account, opay, ussd',
            callback: (response: any) => {
                console.log(response);
                
                if(response.status === 'successful') this.onPaymentSuccess(response)
            },
            onclose: () => { onPayment() },
            customizations: {
                title: 'LP10 Event Portal',
                description: 'RCCG Convention 2025 with LP10'
            },
        });
        else FlutterwaveCheckout({
            public_key: environment.flutterwave.publick_key,
            tx_ref: new String().concat('lp10_convention_', Date.now().toString()),
            amount: 5000,
            currency: 'NGN',
            payment_options: 'card, banktransfer, account, opay, ussd',
            callback: (response: any) => {
                console.log(response);
                
                if(response.status === 'successful') this.onPayment(response)
            },
            onclose: this.onPayment(),
            customer: {
                email: person[0].email,
                name: person[0].first_name,
            },
            customizations: {
                title: 'LP10 Event Portal',
                description: 'RCCG Convention 2025 with LP10'
            },
        });
    }

    onPayment(resp: any) {
        this.nextStep();
    }
}
