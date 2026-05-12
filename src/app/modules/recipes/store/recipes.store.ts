import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, switchMap, tap } from 'rxjs';
import { APP_CONFIG } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { SearchResultsPaginator } from '../../search/contracts/SearchResultsPaginator';
import { SearchResultsPaginatorMapper } from '../../search/mappers/SearchResultsPaginatorMapper';
import { DietTag } from '../contracts/DietTag';
import { DietTagApiResource } from '../contracts/DietTagApiResource';
import { NutrientProfile } from '../contracts/NutrientProfile';
import { NutrientProfileApiResource } from '../contracts/NutrientProfileApiResource';
import { Recipe } from '../contracts/Recipe';
import { RecipeApiPayload } from '../contracts/RecipeApiPayload';
import { RecipeApiResource } from '../contracts/RecipeApiResource';
import { DietTagsMapper } from '../mappers/DietTagsMapper';
import { NutrientProfileMapper } from '../mappers/NutrientProfileMapper';
import { RecipesMapper } from '../mappers/RecipesMapper';

interface RecipePaginatedApiResponse {
  data: RecipeApiResource[];
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
}

interface RecipeSearchApiResponse {
  results: RecipeApiResource[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
}

interface RecipeIngredientAttachPayload {
  ingredient_id: number;
  amount: number;
  unit_id: number;
}

interface RecipeIngredientUpdatePayload {
  amount?: number;
  unit_id?: number;
}

@Injectable({ providedIn: 'root' })
export class RecipesStore {
  private cfg = inject(APP_CONFIG);

  constructor(private fetcher: ApiFetcherService) {}

  private readonly mapper          = new RecipesMapper();
  private readonly dietTagsMapper  = new DietTagsMapper();
  private readonly profileMapper   = new NutrientProfileMapper();
  private readonly paginatorMapper = new SearchResultsPaginatorMapper();

  private _recipes        = signal<Recipe[]>([]);
  private _recipe         = signal<Recipe | null>(null);
  private _paginator      = signal<SearchResultsPaginator | null>(null);
  private _nutrientProfile = signal<NutrientProfile | null>(null);

  readonly recipes         = this._recipes.asReadonly();
  readonly recipe          = this._recipe.asReadonly();
  readonly paginator       = this._paginator.asReadonly();
  readonly nutrientProfile = this._nutrientProfile.asReadonly();

  setRecipe(recipe: Recipe | null): void { this._recipe.set(recipe); }
  setRecipes(recipes: Recipe[]): void { this._recipes.set(recipes); }
  setNutrientProfile(profile: NutrientProfile | null): void { this._nutrientProfile.set(profile); }

  index(page = 1, append = false): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes?page=${page}`;
    return this.fetcher.fetchAndProcess<RecipePaginatedApiResponse>(url, '', body => {
      if (!body) return;
      const recipes = body.data.map(r => this.mapper.toApp(r));
      this._recipes.set(append ? [...this._recipes(), ...recipes] : recipes);
      this._paginator.set(this.paginatorMapper.make());
      this._paginator.update(p => p ? ({
        ...p,
        total: body.total,
        perPage: body.per_page,
        currentPage: body.current_page,
        lastPage: body.last_page,
        pages: Array.from({ length: body.last_page }, (_, i) => i + 1),
      }) : null);
    });
  }

  search(query: string, page = 1, append = false): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/search`;
    return this.fetcher.postAndProcess<{ query: string; page: number }, RecipeSearchApiResponse>(
      url, { query, page }, '',
    ).pipe(
      tap(body => {
        const recipes = (body.results ?? []).map(r => this.mapper.toApp(r));
        this._recipes.set(append ? [...this._recipes(), ...recipes] : recipes);
        this._paginator.update(() => ({
          ...this.paginatorMapper.make(),
          total: body.total,
          perPage: body.per_page,
          currentPage: body.current_page,
          lastPage: body.last_page,
          pages: Array.from({ length: body.last_page }, (_, i) => i + 1),
        }));
      }),
      map(() => void 0),
    );
  }

  show(id: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${id}`;
    return this.fetcher.fetchAndProcess<RecipeApiResource>(url, '', body => {
      if (!body) { this._recipe.set(null); return; }
      this._recipe.set(this.mapper.toApp(body));
      this._nutrientProfile.set(null);
    });
  }

  create(payload: RecipeApiPayload): Observable<Recipe> {
    const url = `${this.cfg.appBackendUrl}/api/recipes`;
    return this.fetcher.postAndProcess<RecipeApiPayload, RecipeApiResource>(
      url, payload, 'Recipe created.',
    ).pipe(map(body => this.mapper.toApp(body)));
  }

  update(id: number, payload: RecipeApiPayload): Observable<Recipe> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${id}`;
    return this.fetcher.putAndProcess<RecipeApiPayload, RecipeApiResource>(
      url, payload, 'Recipe updated.',
    ).pipe(
      map(body => this.mapper.toApp(body)),
      tap(recipe => this._recipe.set(recipe)),
    );
  }

  delete(id: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${id}`;
    return this.fetcher.deleteAndProcess(url, 'Recipe deleted.').pipe(
      tap(() => {
        this._recipe.set(null);
        this._recipes.update(rs => rs.filter(r => r.id !== id));
      }),
    );
  }

  loadNutrientProfile(id: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${id}/nutrient-profile`;
    return this.fetcher.fetchAndProcess<NutrientProfileApiResource>(url, '', body => {
      if (!body) return;
      this._nutrientProfile.set(this.profileMapper.toApp(body));
    });
  }

  attachIngredient(recipeId: number, ingredientId: number, amount: number, unitId: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${recipeId}/ingredients`;
    const payload: RecipeIngredientAttachPayload = { ingredient_id: ingredientId, amount, unit_id: unitId };
    return this.fetcher.postAndProcess<RecipeIngredientAttachPayload, unknown>(
      url, payload, 'Ingredient added.',
    ).pipe(switchMap(() => this.show(recipeId)));
  }

  updateIngredientPivot(recipeId: number, ingredientId: number, amount: number, unitId: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${recipeId}/ingredients/${ingredientId}`;
    const payload: RecipeIngredientUpdatePayload = { amount, unit_id: unitId };
    return this.fetcher.putAndProcess<RecipeIngredientUpdatePayload, unknown>(
      url, payload, 'Ingredient updated.',
    ).pipe(switchMap(() => this.show(recipeId)));
  }

  detachIngredient(recipeId: number, ingredientId: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${recipeId}/ingredients/${ingredientId}`;
    return this.fetcher.deleteAndProcess(url, 'Ingredient removed.').pipe(
      switchMap(() => this.show(recipeId)),
    );
  }

  attachDietTag(recipeId: number, dietTagId: number): Observable<DietTag[]> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${recipeId}/diet-tags`;
    return this.fetcher.postAndProcess<{ diet_tag_id: number }, DietTagApiResource[]>(
      url, { diet_tag_id: dietTagId }, 'Tag added.',
    ).pipe(
      map(body => (body ?? []).map(t => this.dietTagsMapper.toApp(t))),
      tap(tags => this._recipe.update(r => r ? { ...r, dietTags: tags } : r)),
    );
  }

  detachDietTag(recipeId: number, dietTagId: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/recipes/${recipeId}/diet-tags/${dietTagId}`;
    return this.fetcher.deleteAndProcess(url, 'Tag removed.').pipe(
      tap(() => this._recipe.update(r =>
        r ? { ...r, dietTags: r.dietTags.filter(t => t.id !== dietTagId) } : r
      )),
    );
  }
}
