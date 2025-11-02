import { Component, Input } from '@angular/core';
import { Statistics } from '../../interfaces/registration.interfaces';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css',
})
export class StatComponent {
    @Input({required: true, alias: 'stat'})
    statistics!: Statistics[]
}
