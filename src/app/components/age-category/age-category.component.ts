import { Component } from '@angular/core';

@Component({
  selector: 'age-category',
  imports: [],
  templateUrl: './age-category.component.html',
  styleUrl: './age-category.component.css'
})
export class AgeCategoryComponent {
    category: String = 'teenager';
    categoryNum: Number = 0;
}
