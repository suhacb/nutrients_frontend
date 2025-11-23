import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';
import { ApiHandlerService } from '../../../core/ApiHandlerService/api-handler-service';
import { Nutrient } from '../contracts/Nutrient';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { NutrientsMapper } from '../mappers/NutrientsMapper';
import { PaginatorMapper } from '../../../core/Paginator/PaginatorMapper';
import { Paginator } from '../../../core/Paginator/Paginator';
import { PaginatorApiResource } from '../../../core/Paginator/PaginatorApiResource';

type NutrientIndexApiResource = {
    data: NutrientApiResource[]
} & PaginatorApiResource


@Injectable({ providedIn: 'root' })

export class NutrientsStore {
    constructor(
        private http: HttpClient,
        private apiHandlerService: ApiHandlerService
    ) {}

    private _nutrients = signal<Nutrient[]>([]);
    private _nutrient = signal<Nutrient | null>(null);
    private _paginator = signal<Paginator | null>(null);

    // expose readonly signals
    readonly nutrients = this._nutrients.asReadonly();
    readonly nutrient = this._nutrient.asReadonly();
    readonly paginator = this._paginator.asReadonly();

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

    index (page: number | null = null, url: string = 'http://localhost:9015/api/nutrients'): Observable<void> {
        let finalUrl: string = url;
        if (page) {
            finalUrl+= "?page=" + page;
        }

        return this.http.get<NutrientIndexApiResource>(finalUrl, { observe: 'response' as const}).pipe(
            tap(() => {
                this.apiHandlerService.showSuccess('Nutrients index loaded.');
            }),
            map((response) => {
                const body = response.body;

                if (!body) {
                    this.setNutrients([]);
                    this.setPaginator(null);
                    return;
                }

                const { data, ...paginator } = body;

                const nutrients: Nutrient[] = data.map(d => new NutrientsMapper().toApp(d));
                this.setNutrients(nutrients);

                this.setPaginator(new PaginatorMapper().toApp(paginator as PaginatorApiResource));
            }),
            catchError((error: HttpErrorResponse) => {
                this.apiHandlerService.showError(error);
                if (error.status === 401 || error.status === 422) return throwError(() => error);
                return EMPTY;
            })
        );
    }

    show(id: number): Observable<void> {
        const url: string = 'http://localhost:9015/api/nutrients/' + id;
        return this.http.get<NutrientApiResource>(url, { observe: 'response' as const}).pipe(
            tap(() => {
                this.apiHandlerService.showSuccess('Nutrient loaded successfully.');
            }),
            map((response) => {
                const body = response.body;
                if (!body) {
                    this.setNutrient(null);
                    return;
                }
                this.setNutrient(new NutrientsMapper().toApp(body));
            })
        );
    }
}
