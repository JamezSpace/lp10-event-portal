import { computed, Injectable, Signal, signal } from '@angular/core';
import { BulkRegistrationData } from '../models/registration-data.model';
import { Person } from '../models/person.model';

@Injectable({
    providedIn: 'root'
})
export class RegistrationDataService {

    constructor() { }

    registration_data = signal<BulkRegistrationData>({
        teenager: 0, children: 0, teacher: 0
    })

    registration_pricing = signal<BulkRegistrationData>({
        teenager: 2000,
        children: 1000,
        teacher: 2000
    })

    private registered_persons = signal<Person[]>([])

    view_registration_data(): BulkRegistrationData {
        return this.registration_data()
    }

    get_total_number_registering: Signal<number> = computed(() => {
        return this.registration_data().children + this.registration_data().teenager + this.registration_data().teacher;
    })

    reset_registration_data() {
        this.registration_data.set({
            teenager: 0, children: 0, teacher: 0
        })
    }

    get_total_fee_of_all_registration: Signal<number> = computed(() => {
        let children_fee = this.registration_data().children * this.registration_pricing().children

        let teens_fee = this.registration_data().teenager * this.registration_pricing().teenager

        let teachers_fee = this.registration_data().teacher * this.registration_pricing().teacher

        return children_fee + teachers_fee + teens_fee;
    })

    update_registration_data(
        category: string,
        num: number
    ): void {
        if (category === 'children') {
            this.registration_data.set({
                ...this.registration_data(),
                children: num
            })
        }
        else if (category === 'teenager')
            this.registration_data.set({
                ...this.registration_data(),
                teenager: num
            })
        else
            this.registration_data.set({
                ...this.registration_data(),
                teacher: num
            })

        return;
    }

    fetch_all_registered_persons_records(): Person[] {
        return this.registered_persons();
    }

    editedPersonId(person: Person) {
        if (person.id !== 0) {
            // find the id of the last person in the array and add one to it
            person.id = this.registered_persons()[this.registered_persons().length - 1].id + 1
        }

        return person
    }

    add_persons_record(person: Person) {
        this.registered_persons().push(this.editedPersonId(person))
    }
}
