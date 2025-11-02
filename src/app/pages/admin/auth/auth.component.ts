import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/admin/auth/auth.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-auth',
  imports: [MatProgressSpinner, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
    private authService = inject(AuthService);
    private snackBar = inject(MatSnackBar);
    private router = inject(Router);

    ngOnInit(): void {
        if(localStorage.getItem("access_token")) 
            localStorage.removeItem("access_token")
    }

    email = '';
    password = '';
    loading = signal(false)

    async login() {
        this.loading.set(true);

        const success_status = await this.authService.login({
            email: this.email.toLowerCase(),
            password: this.password
        })

        this.loading.set(false);
        if (success_status == 1) {
          this.router.navigateByUrl('/admin/dashboard')
        } else if (success_status == 0) {
          this.snackBar.open("Invalid Email and Password Combination", "", {
              duration: 3000
          })
        } else {
          this.snackBar.open("Oops! Something big went wrong", "okay")
        }
    }
}
