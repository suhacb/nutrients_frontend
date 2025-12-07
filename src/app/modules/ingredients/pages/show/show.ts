import { Component, effect } from '@angular/core';
import { IngredientsStore } from '../../store/ingredients.store';
import { MatTableDataSource } from '@angular/material/table';
import { NutritionFact } from '../../contracts/NutritionFact';

@Component({
  selector: 'app-ingredient-show-page',
  standalone: false,
  templateUrl: './show.html',
  styleUrl: './show.scss'
})
export class IngredientShowPage {
  public displayedColumns: string[];
  public dataSource = new MatTableDataSource<NutritionFact>([]);

  constructor(public store: IngredientsStore) {
    this.displayedColumns = ['name', 'amount'];
    effect(() => {
      const facts = this.store.ingredient()?.nutritionFacts ?? [];
      this.dataSource.data = facts;
    });
  }

}
