import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { HerosComponent } from './pages/heros/heros.component';

export const routes: Routes = [
    {
        path: '',
        component: HerosComponent
    }, 
    {
        path: 'campout',
        component: RegistrationComponent
    }
];
