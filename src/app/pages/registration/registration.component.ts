import { AfterViewInit, Component, computed, ElementRef, inject, QueryList, signal, Signal, ViewChildren } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormBuilder } from '@angular/forms';
import { AgeCategoryComponent } from "../../components/age-category/age-category.component";
import { RegistrationService } from '../../services/registration.service';
import { RegistrationDataService } from '../../services/registration-data.service';
import { Person } from '../../models/person.model';

@Component({
    selector: 'app-registration',
    imports: [MatProgressBarModule, MatInputModule, MatSelectModule, MatButtonModule, MatStepperModule, MatFormFieldModule, FormsModule, AgeCategoryComponent, ReactiveFormsModule],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.css'
})
export class RegistrationComponent implements AfterViewInit {
    reg_data_service = inject(RegistrationDataService);

    constructor(private regService: RegistrationService) { }

    async ngAfterViewInit(): Promise<void> {
        this.zones.set(await this.regService.fetchZones())
    }

    next: Signal<boolean> = false;
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

    user_gender: string = ''

    setGender(e: any) {
        this.user_gender = e.target.id
    }

    @ViewChildren('gender') gender_btns !: QueryList<ElementRef>;
    resetAllFormData(all: boolean) {
        // considering this functionality is needed for both saving person data and final submission, an 'all' parameter is needed to know if to clear all or partially all. If all is true, it means it is final submission, hence even the registration data needs to reset
        if (all) this.reg_data_service.reset_registration_data()

        // reset gender
        this.user_gender = ''

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
            last_name: '',
            email: ''
        })

        this.gender_btns.forEach(btn => {
            btn.nativeElement.checked = false;
        })
    }

    deactivate_registration_breakdown: boolean = false
    async saveData() {        
        if (!this.registration_data.errors === null || this.user_gender === '') return

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
            id: 0,
            first_name: new String(this.registration_data.value.first_name).toString(),
            last_name: new String(this.registration_data.value.last_name).toString(),
            email: new String(this.registration_data.value.email).toString(),
            gender: this.user_gender,
            year_of_birth: new Date().getFullYear() - parseInt(new String(this.registration_data.value.age).toString()),
            origin: this.origin,
            parish: this.origin === 'lp10' && this.lp10_origin_data.value.parish || '',
            zone: this.origin === 'lp10' && this.lp10_origin_data.value.zone || '',
            region: this.origin === 'non-lp10' && this.nonlp10_origin_data.value.region || '',
            province: this.origin === 'non-lp10' && this.nonlp10_origin_data.value.province || '',
            denomination: this.origin === 'non-rccg' && this.nonrccg_origin_data.value.denomination || '',
            details: this.origin === 'non-rccg' && this.nonrccg_origin_data.value.details || ''
        }

        this.reg_data_service.add_persons_record(person);

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
        this.resetAllFormData(true)
        this.previewData()
    }

    @ViewChildren("btn")
    stepper_btn !: ElementRef<MatStepper>;

    previewData() {
        console.log("data registration preview");
        this.stepper_btn.nativeElement.next()

    }
}
