import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import 'iconify-icon';

@Component({
  selector: 'nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavBarComponent {
    links: string[] = ['home', 'events', 'socials', 'shop'];
}
