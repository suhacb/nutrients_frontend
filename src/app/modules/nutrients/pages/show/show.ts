import { Component } from '@angular/core';
import { NutrientsStore } from '../../store/nutrients.store';

@Component({
  selector: 'app-show',
  standalone: false,
  templateUrl: './show.html',
  styleUrl: './show.scss'
})
export class NutrientShowPage {

  constructor(public store: NutrientsStore) {}
}
