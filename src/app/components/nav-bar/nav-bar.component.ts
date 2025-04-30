import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import 'iconify-icon';

@Component({
  selector: 'app-nav-bar',
  imports: [],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavBarComponent {
    links: string[] = ['home', 'events', 'socials', 'shop'];

    @ViewChild('navcontainer') navcontainer !: ElementRef

    toggleNavBar(e: any) {
      console.log(e.target)
      this.navcontainer.nativeElement.classList.toggle('active')
    }
}
