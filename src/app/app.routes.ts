import { Routes } from '@angular/router';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HerosComponent } from './pages/heros/heros.component';

export const routes: Routes = [
    {
        path: '',
        component: HerosComponent
    }, 
    {
        path: 'convention-2025',
        component: RegistrationComponent
    }
];
