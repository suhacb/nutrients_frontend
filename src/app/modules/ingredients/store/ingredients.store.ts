import { Injectable, signal, inject } from '@angular/core';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { Observable } from 'rxjs';
import { Ingredient } from '../contracts/Ingredient';
import { IngredientApiResource } from '../contracts/IngredientApiResource';
import { IngredientsMapper } from '../mappers/IngredientsMapper';
import { Breadcrumb } from '../../../core/Breadcrumb/breadcrumb.d';
import { SearchService } from '../../search/components/searchService';
import { SearchResultsPaginator } from '../../search/contracts/SearchResultsPaginator';
import { SearchResultsPaginatorMapper } from '../../search/mappers/SearchResultsPaginatorMapper';
import { APP_CONFIG } from '../../../config/app-config';

@Injectable({ providedIn: 'root' })
export class IngredientsStore {
  constructor(
    private fetcher: ApiFetcherService,
    private searchService: SearchService,
  ) {}

  private cfg = inject(APP_CONFIG);

  private _ingredients = signal<Ingredient[]>([]);
  private _ingredient = signal<Ingredient | null>(null);
  private _paginator = signal<SearchResultsPaginator | null>(null);
  private _breadcrumb = signal<Breadcrumb[]>([]);

  readonly ingredients = this._ingredients.asReadonly();
  readonly ingredient = this._ingredient.asReadonly();
  readonly paginator = this._paginator.asReadonly();
  readonly breadcrumb = this._breadcrumb.asReadonly();

  setIngredients(index: Ingredient[]): void { this._ingredients.set(index); }
  setIngredient(show: Ingredient | null): void { this._ingredient.set(show); }
  setPaginator(paginator: SearchResultsPaginator | null = null): void { this._paginator.set(paginator); }
  setBreadcrumb(links: Breadcrumb[]): void { this._breadcrumb.set(links); }

  show(id: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/ingredients/${id}`;
    return this.fetcher.fetchAndProcess<IngredientApiResource>(url, 'Ingredient loaded successfully.', body => {
      if (!body) { this.setIngredient(null); return; }
      const ingredient = new IngredientsMapper().toApp(body);
      this.setIngredient(ingredient);
      this.setBreadcrumb([
        { icon: 'home', link: '/' },
        { title: 'Ingredients', link: '/ingredients' },
        { title: ingredient.name },
      ]);
    });
  }

  search(query: string, page: number = 1, append: boolean = false): void {
    this.searchService.search(query, 'ingredients', page).subscribe({
      next: response => {
        const mapper = new IngredientsMapper();
        const ingredients: Ingredient[] = (response.results ?? []).map(hit => ({
          ...mapper.make(),
          id: hit.id,
          name: hit.name ?? '',
          description: hit.description ?? null,
        }));
        this.setIngredients(append ? [...this._ingredients(), ...ingredients] : ingredients);
        this.setPaginator(new SearchResultsPaginatorMapper().toApp(response));
      },
      error: err => console.error(err),
    });
  }
}
