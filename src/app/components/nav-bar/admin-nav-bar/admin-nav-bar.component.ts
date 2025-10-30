import { Component } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavBarMenu } from '../../../interfaces/nav-bar-menu.interfaces';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [MatMenuModule, RouterModule],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.css',
})
export class AdminNavBarComponent {
  sub_navbar_menus: NavBarMenu[] = [
    {
      label: 'overview',
      route: '/dashboard',
    },
    {
      label: 'events',
      route: '/events',
    },
  ];

  toggleNavBarVisibility() {
    // this.side_nav.nativeElement.classList.toggle('opened')
  }

  logout() {}
}
