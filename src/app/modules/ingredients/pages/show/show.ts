import { Component } from '@angular/core';
import { IngredientsStore } from '../../store/ingredients.store';

@Component({
  selector: 'app-ingredient-show-page',
  standalone: false,
  templateUrl: './show.html',
  styleUrl: './show.scss'
})
export class IngredientShowPage {
  constructor(public store: IngredientsStore) {}
}
