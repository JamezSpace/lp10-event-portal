import { Component, Input, Signal } from '@angular/core';
import { Statistics } from '../../models/ui-models/statistics.ui-model';

@Component({
  selector: 'app-stat',
  imports: [],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.css',
})
export class StatComponent {
    @Input({required: true, alias: 'statistic'})
    statistics!: Signal<Statistics[]>;
}
