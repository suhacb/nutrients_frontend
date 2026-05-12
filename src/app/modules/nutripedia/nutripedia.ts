import { Component, OnDestroy, OnInit, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NutrientsStore } from '../nutrients/store/nutrients.store';
import { IngredientsStore } from '../ingredients/store/ingredients.store';
import { RecipesStore } from '../recipes/store/recipes.store';
import { MatTableDataSource } from '@angular/material/table';
import { NutritionFact } from '../ingredients/contracts/NutritionFact';
import { Nutrient } from '../nutrients/contracts/Nutrient';
import { NutrientProfileRow } from '../recipes/contracts/NutrientProfile';

export type PediaCategory = 'nutrients' | 'ingredients' | 'recipes';

@Component({
  selector: 'app-nutripedia',
  standalone: false,
  templateUrl: './nutripedia.html',
  styleUrl: './nutripedia.scss'
})
export class NutripediaPage implements OnInit, OnDestroy {
  category: PediaCategory = 'nutrients';
  activeId: number | null = null;
  searchQuery = '';
  displayedColumns = ['name', 'amount'];
  dataSource = new MatTableDataSource<NutritionFact>([]);

  readonly nutrientProfileView = signal<'total' | 'per_portion'>('total');

  readonly profileRows = computed<NutrientProfileRow[]>(() => {
    const profile = this.recipesStore.nutrientProfile();
    if (!profile) return [];
    return this.nutrientProfileView() === 'total' ? profile.total : profile.perPortion;
  });

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public nutrientsStore: NutrientsStore,
    public ingredientsStore: IngredientsStore,
    public recipesStore: RecipesStore,
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
        } else if (this.category === 'ingredients') {
          this.ingredientsStore.show(this.activeId).subscribe();
        } else {
          this.nutrientProfileView.set('total');
          this.recipesStore.show(this.activeId).subscribe(() => {
            this.recipesStore.loadNutrientProfile(this.activeId!).subscribe();
          });
        }
      } else {
        this.nutrientsStore.setNutrient(null);
        this.ingredientsStore.setIngredient(null);
        this.recipesStore.setRecipe(null);
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
    this.searchQuery = query;
    if (this.category === 'nutrients') {
      this.nutrientsStore.search(query);
    } else if (this.category === 'ingredients') {
      this.ingredientsStore.search(query);
    } else {
      this.recipesStore.search(query);
    }
  }

  getAncestors(nutrient: Nutrient): Nutrient[] {
    const ancestors: Nutrient[] = [];
    let current: Nutrient | null | undefined = nutrient.parent;
    while (current) {
      ancestors.unshift(current);
      current = current.parent;
    }
    return ancestors;
  }

  onLoadMore(): void {
    const paginator = this.category === 'nutrients'
      ? this.nutrientsStore.paginator()
      : this.category === 'ingredients'
        ? this.ingredientsStore.paginator()
        : this.recipesStore.paginator();

    if (!paginator || paginator.currentPage >= paginator.lastPage) return;
    const nextPage = paginator.currentPage + 1;

    if (this.category === 'nutrients') {
      this.nutrientsStore.search(this.searchQuery, nextPage, true);
    } else if (this.category === 'ingredients') {
      this.ingredientsStore.search(this.searchQuery, nextPage, true);
    } else {
      this.recipesStore.search(this.searchQuery, nextPage, true);
    }
  }
}
