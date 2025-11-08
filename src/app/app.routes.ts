import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/users/registration/registration.component';
import { HelpComponent } from './pages/users/help/help.component';
import { PaymentStatusComponent } from './pages/users/payment-status/payment-status.component';
import { EventTicketComponent } from './pages/users/event-ticket/event-ticket.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthComponent } from './pages/admin/auth/auth.component';
import { IndexComponent } from './pages/users/index/index.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
  },
  {
    path: 'convention-2025',
    component: RegistrationComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: 'payment-status',
    component: PaymentStatusComponent,
  },
  {
    path: 'event-ticket',
    component: EventTicketComponent,
  },
  {
    path: 'admin/auth',
    component: AuthComponent,
  },
  {
    path: 'admin',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/admin/overview/overview.component').then(
            (page) => page.OverviewComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./pages/admin/events/events.component').then(
            (page) => page.EventsComponent
          ),
      },
      {
        path: 'events-reg',
        loadComponent: () =>
          import('./pages/admin/events-reg/events-reg.component').then(
            (page) => page.EventsRegComponent
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
    ],
  },
];
