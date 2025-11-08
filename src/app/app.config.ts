import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { routes } from './app.routes';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// init firebase
const firebaseConfig: FirebaseOptions = {
  apiKey: environment.firebase.api_key,
  appId: environment.firebase.app_id,
  authDomain: environment.firebase.auth_domain,
  messagingSenderId: environment.firebase.messaging_sender_id,
  projectId: environment.firebase.project_id,
  storageBucket: environment.firebase.storage_bucket,
  measurementId: environment.firebase.measurement_id
};

export const firebase_app = initializeApp(firebaseConfig);
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
    { 
        provide: MAT_DIALOG_DEFAULT_OPTIONS, 
        useValue: { hasBackdrop: true }
    },
    provideCharts(withDefaultRegisterables()),
  ],
};
