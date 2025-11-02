import { computed, Injectable, Signal, signal } from '@angular/core';
import { Person, PersonEntity } from '../../../interfaces/person.interface';
import { BulkRegistrationData } from '../../../interfaces/registration-data.interface';

@Injectable({
    providedIn: 'root'
})
export class RegistrationDataService {

    constructor() { }

    registration_data = signal<BulkRegistrationData>({
        teenager: 0, children: 0, teacher: 0
    })

    registration_pricing = signal<BulkRegistrationData>({
        teenager: 5000,
        children: 5000,
        teacher: 5000
    })

    private registered_persons = signal<Person[]>([])

    view_registration_data(): BulkRegistrationData {
        return this.registration_data()
    }

    get_total_number_registering: Signal<number> = computed(() => {
        return this.registration_data().children + this.registration_data().teenager + this.registration_data().teacher;
    })

    reset_registration_data(): void {
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

    fetch_all_registered_persons_records(): PersonEntity[] {
        const registered_persons_without_id = this.registered_persons().map(({ id, ...person_without_id }) => person_without_id);
        
        return registered_persons_without_id;
    }

    editedPersonId(person: Person): Person {
        const registeredPersons = this.registered_persons();
        const lastId = registeredPersons.length > 0
            ? registeredPersons[registeredPersons.length - 1].id
            : 0;

        return { ...person, id: lastId + 1 };
    }

    add_persons_record(person: Person): number {
        const new_person = this.editedPersonId(person);

        this.registered_persons.update(prev => [...prev, new_person]);

        return new_person.id;
    }

    update_person_record(person_to_update: Person) {
        this.registered_persons.update(prev =>
            prev.map(person =>
                person.id === person_to_update.id ? { ...person, ...person_to_update } : person
            )
        );
    }
}
