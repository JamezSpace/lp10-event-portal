import { inject, Injectable, signal } from '@angular/core';
import { Admin } from '../../../interfaces/admin.interfaces';
import { environment } from '../../../../environments/environment';
import { UserType } from '../../../interfaces/auth.interfaces';
import { firebase_app } from '../../../app.config';
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = getAuth(firebase_app);
  userLoggedIn = signal(false);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) this.userLoggedIn.set(true);
    });
  }

  // making default user type here to be user (admin - 0, user - 1) to prevent accidental access to admin page, hence, user must truly be an admin for this to change
  user_type = signal<UserType>(0);

  async login(admin_credentials: Admin) {
    try {
    //   REMOVE! This is only used for local testing
    //     return {
    //     success: 1
    //   };

      const user_credential = await signInWithEmailAndPassword(
        this.auth,
        admin_credentials.email,
        admin_credentials.password
      );

      if (user_credential.user.uid) this.user_type.set(0);

      return {
        success: 1
      };
    } catch (error: any) {
      console.error(error);
      return {
        success: 0,
        reason: error.message,
      };
    }
  }

  async logout() {
    this.auth.signOut();
  }
}
