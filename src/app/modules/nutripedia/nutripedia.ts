import { Component, OnDestroy, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NutrientsStore } from '../nutrients/store/nutrients.store';
import { IngredientsStore } from '../ingredients/store/ingredients.store';
import { MatTableDataSource } from '@angular/material/table';
import { NutritionFact } from '../ingredients/contracts/NutritionFact';

export type PediaCategory = 'nutrients' | 'ingredients';

@Component({
  selector: 'app-nutripedia',
  standalone: false,
  templateUrl: './nutripedia.html',
  styleUrl: './nutripedia.scss'
})
export class NutripediaPage implements OnInit, OnDestroy {
  category: PediaCategory = 'nutrients';
  activeId: number | null = null;
  displayedColumns = ['name', 'amount'];
  dataSource = new MatTableDataSource<NutritionFact>([]);

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public nutrientsStore: NutrientsStore,
    public ingredientsStore: IngredientsStore,
  ) {
    effect(() => {
      this.dataSource.data = this.ingredientsStore.ingredient()?.nutritionFacts ?? [];
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.category = (params['category'] as PediaCategory) ?? 'nutrients';
      this.activeId = params['id'] ? +params['id'] : null;

      if (this.activeId) {
        if (this.category === 'nutrients') {
          this.nutrientsStore.show(this.activeId).subscribe();
        } else {
          this.ingredientsStore.show(this.activeId).subscribe();
        }
      } else {
        this.nutrientsStore.setNutrient(null);
        this.ingredientsStore.setIngredient(null);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  onCategoryChange(category: PediaCategory): void {
    this.router.navigate(['/nutripedia', category]);
  }

  onEntrySelect(id: number): void {
    this.router.navigate(['/nutripedia', this.category, id]);
  }

  onSearch(query: string): void {
    if (this.category === 'nutrients') {
      this.nutrientsStore.search(query);
    } else {
      this.ingredientsStore.search(query);
    }
  }
}
