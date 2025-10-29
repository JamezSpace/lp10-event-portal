import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HerosComponent } from './pages/heros/heros.component';
import { HelpComponent } from './pages/help/help.component';
import { PaymentStatusComponent } from './pages/payment-status/payment-status.component';
import { EventTicketComponent } from './pages/event-ticket/event-ticket.component';

export const routes: Routes = [
    {
        path: '',
        component: HerosComponent
    }, 
    {
        path: 'convention-2025',
        component: RegistrationComponent
    },
    {
        path: 'help',
        component: HelpComponent
    },
    {
        path: 'payment-status',
        component: PaymentStatusComponent
    },
    {
        path: 'event-ticket',
        component: EventTicketComponent
    }
];
