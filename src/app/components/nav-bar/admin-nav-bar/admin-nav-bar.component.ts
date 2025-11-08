import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavBarMenu } from '../../../interfaces/nav-bar-menu.interfaces';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/admin/auth/auth.service';
import { UserNavBarComponent } from '../user-nav-bar/user-nav-bar.component';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [MatMenuModule, RouterModule, UserNavBarComponent],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css',
})
export class AdminNavBarComponent {
  private auth_service = inject(AuthService);
  private router = inject(Router);
  currentUrl = signal(this.router.url);

  // 🧭 keep currentUrl updated reactively whenever navigation ends
  constructor() {
    // listen to router events and update the signal
    effect(() => {
      const sub = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentUrl.set(event.urlAfterRedirects);
        }
      });

      // cleanup on destroy
      return () => sub.unsubscribe();
    });
  }

  userNavBarNeeded = computed(() => {
    return !this.currentUrl().startsWith('/admin');
  });

  authPage = computed(() => {
    return this.currentUrl().includes("/admin/auth")
  })

  sub_navbar_menus: NavBarMenu[] = [
    {
      label: 'overview',
      route: '/admin/dashboard',
    },
    {
      label: 'events',
      route: '/admin/events',
    },
    {
      label: 'events registrations',
      route: '/admin/events-reg',
    },
  ];

  @ViewChild('mobile_nav_bar')
  mobile_nav_bar!: ElementRef<HTMLDivElement>;

  toggleNavBarVisibility() {
    this.mobile_nav_bar.nativeElement.classList.toggle('opened')
  }

  async logout() {
    await this.auth_service.logout();
    this.router.navigateByUrl('/admin/dashboard')
  }
}
