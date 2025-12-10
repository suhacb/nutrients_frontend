import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';
import { ApiHandlerService } from '../../../core/ApiHandlerService/api-handler-service';
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

type NutrientIndexApiResource = {
    data: NutrientApiResource[]
} & PaginatorApiResource

@Injectable({ providedIn: 'root' })

export class NutrientsStore {
    constructor(
        private http: HttpClient,
        private fetcher: ApiFetcherService
    ) {}

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
        const url = `http://localhost:9015/api/nutrients/${id}`;

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
        console.log(searchQuery);
        const payload = {
            index: 'nutrients',
            query: searchQuery,
            page: 1
        };

        const url = `http://localhost:9015/api/search`;
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
                this.setNutrients(nutrients);
            }
        );
    }
}
