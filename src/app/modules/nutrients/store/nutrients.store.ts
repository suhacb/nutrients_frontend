import { Injectable, signal, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Nutrient } from '../contracts/Nutrient';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { NutrientsMapper } from '../mappers/NutrientsMapper';
import { PaginatorMapper } from '../../../core/Paginator/PaginatorMapper';
import { Paginator } from '../../../core/Paginator/paginator.d';
import { PaginatorApiResource } from '../../../core/Paginator/PaginatorApiResource';
import { Breadcrumb } from '../../../core/Breadcrumb/breadcrumb.d';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { SearchApiRequest } from '../../../core/Search/contracts/SearchApiRequest';
import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';
import { APP_CONFIG } from '../../../config/app-config';

type NutrientIndexApiResource = {
    data: NutrientApiResource[]
} & PaginatorApiResource

@Injectable({ providedIn: 'root' })

export class NutrientsStore {
    constructor(
        private fetcher: ApiFetcherService,
    ) {}

    private cfg = inject(APP_CONFIG);

    private _nutrients = signal<Nutrient[]>([]);
    private _nutrient = signal<Nutrient | null>(null);
    private _paginator = signal<Paginator | null>(null);
    private _breadcrumb = signal<Breadcrumb[]>([
        { icon: 'home', link: '/' },
        { title: 'Nutrients' },
    ]);

    // expose readonly signals
    readonly nutrients = this._nutrients.asReadonly();
    readonly nutrient = this._nutrient.asReadonly();
    readonly paginator = this._paginator.asReadonly();
    readonly breadcrumb = this._breadcrumb.asReadonly();

    // setters
    setNutrients(index: Nutrient[] = []): void {
        this._nutrients.set(index);
    }

    setNutrient(show: Nutrient | null): void {
        this._nutrient.set(show);
    }

    setPaginator(paginator: Paginator | null = null): void {
        this._paginator.set(paginator);
    }

    setBreadcrumb(links: Breadcrumb[]): void {
        this._breadcrumb.set(links);
    }

    show(id: number): Observable<void> {
        const url = `${this.cfg.appBackendUrl}/api/nutrients/${id}`;

        return this.fetcher.fetchAndProcess<NutrientApiResource>(
            url,
            'Nutrient loaded successfully.',
            body => {
                if (!body) {
                    this.setNutrient(null);
                    return;
                }

                const nutrient = new NutrientsMapper().toApp(body);
                this.setNutrient(nutrient);

                this.setBreadcrumb([
                    { icon: 'home', link: '/' },
                    { title: 'Nutrients', link: '/nutrients' },
                    { title: nutrient.name }
                ]);
            }
        );
    }

    search(searchQuery: string): Observable<void> {
        const payload = {
            index: 'nutrients',
            query: searchQuery,
            page: 1
        };

        const url = `${this.cfg.appBackendUrl}/api/search`;
        return this.fetcher.postAndProcess<SearchApiRequest, SearchApiResponse<NutrientApiResource>>(
            url,
            payload,
            "Here's what we found for you",
            body => {
                if (!body) {
                    return;
                }
                let nutrients: Nutrient[] = [];
                body.results.forEach(result => nutrients.push(new NutrientsMapper().toApp(result)));
                const paginatorResponse =  (({ results, ...paginator }) => paginator)(body);
                const paginator: Paginator = new PaginatorMapper().toApp(paginatorResponse as PaginatorApiResource);
                this.setNutrients(nutrients);
                this.setPaginator(paginator);
            }
        );
    }
}
