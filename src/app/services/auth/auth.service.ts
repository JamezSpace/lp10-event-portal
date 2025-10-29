import { Injectable, signal } from '@angular/core';
import { Admin } from '../../interfaces/admin.interfaces';
import { environment } from '../../../environments/environment';
import { UserType } from '../../interfaces/auth.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  // making default user type here to be user (admin - 0, user - 1) to prevent accidental access to admin page, hence, user must truly be an admin for this to change
  user_type = signal<UserType>(0)

  async login(admin_credentials: Admin) {
    try {
      // REMOVE! This is only used for local testing
      return 1;

      const response = await fetch(
        `${environment.base_backend.url}/admin/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(admin_credentials),
        }
      );

      const result = await response.json();
      if (result.token && (result.user || result.admin)) {
        localStorage.setItem('access_token', result.token);
      } else return 0;

      // change user signed in type to 'admin'
      if(result.admin) this.user_type.set(0)

      return 1;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  logout() {}
}
