import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Nutrient } from '../contracts/Nutrient';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { NutrientsMapper } from '../mappers/NutrientsMapper';
import { Breadcrumb } from '../../../core/Breadcrumb/breadcrumb.d';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { APP_CONFIG } from '../../../config/app-config';
import { SearchService } from '../../search/components/searchService';
import { SearchResultsPaginator } from '../../search/contracts/SearchResultsPaginator';
import { SearchResultsPaginatorMapper } from '../../search/mappers/SearchResultsPaginatorMapper';

@Injectable({ providedIn: 'root' })
export class NutrientsStore {
  constructor(
    private fetcher: ApiFetcherService,
    private searchService: SearchService,
  ) {}

  private cfg = inject(APP_CONFIG);

  private _nutrients = signal<Nutrient[]>([]);
  private _nutrient = signal<Nutrient | null>(null);
  private _paginator = signal<SearchResultsPaginator | null>(null);
  private _breadcrumb = signal<Breadcrumb[]>([
    { icon: 'home', link: '/' },
    { title: 'Nutrients' },
  ]);

  readonly nutrients = this._nutrients.asReadonly();
  readonly nutrient = this._nutrient.asReadonly();
  readonly paginator = this._paginator.asReadonly();
  readonly breadcrumb = this._breadcrumb.asReadonly();

  setNutrients(index: Nutrient[] = []): void { this._nutrients.set(index); }
  setNutrient(show: Nutrient | null): void { this._nutrient.set(show); }
  setPaginator(paginator: SearchResultsPaginator | null = null): void { this._paginator.set(paginator); }
  setBreadcrumb(links: Breadcrumb[]): void { this._breadcrumb.set(links); }

  show(id: number): Observable<void> {
    const url = `${this.cfg.appBackendUrl}/api/nutrients/${id}`;
    return this.fetcher.fetchAndProcess<NutrientApiResource>(url, 'Nutrient loaded successfully.', body => {
      if (!body) { this.setNutrient(null); return; }
      const nutrient = new NutrientsMapper().toApp(body);
      this.setNutrient(nutrient);
      this.setBreadcrumb([
        { icon: 'home', link: '/' },
        { title: 'Nutrients', link: '/nutrients' },
        { title: nutrient.name },
      ]);
    });
  }

  search(query: string, page: number = 1): void {
    this.searchService.search(query, 'nutrients', page).subscribe({
      next: response => {
        const mapper = new NutrientsMapper();
        const nutrients: Nutrient[] = (response.results ?? []).map(hit => ({
          ...mapper.make(),
          id: hit.id,
          name: hit.name ?? '',
          description: hit.description ?? null,
        }));
        this.setNutrients(nutrients);
        this.setPaginator(new SearchResultsPaginatorMapper().toApp(response));
      },
      error: err => console.error(err),
    });
  }
}
