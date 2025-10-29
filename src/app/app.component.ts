import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { UserNavBarComponent } from './components/nav-bar/user-nav-bar/user-nav-bar.component';
import { AdminNavBarComponent } from './components/nav-bar/admin-nav-bar/admin-nav-bar.component';
import { AuthService } from './services/auth/auth.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, UserNavBarComponent, AdminNavBarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    readonly auth_service = inject(AuthService);

    async ngAfterViewInit() {
        await fetch(environment.base_backend.url, {
            mode: 'cors'
        });
    }

    user_type = computed(() => {
        return this.auth_service.user_type() === 1 ? 'user' : 'admin'
    })

}
