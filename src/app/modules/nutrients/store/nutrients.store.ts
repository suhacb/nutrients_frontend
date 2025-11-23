import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';
import { ApiHandlerService } from '../../../core/ApiHandlerService/api-handler-service';
import { Paginator } from '../../../core/Paginator/paginator';

@Injectable({ providedIn: 'root' })

export class NutrientsStore {
    constructor(
        private http: HttpClient,
        private apiHandlerService: ApiHandlerService
    ) {}

    private _nutrients = signal<any[] | null>(null);
    private _paginator = signal<Paginator | null>(null);

    // expose readonly signals
    readonly nutrients = this._nutrients.asReadonly();
    readonly paginator = this._paginator.asReadonly();

    // setters
    setNutrients(index: any | null = null): void {
        this._nutrients.set(index);
    }

    setPaginator(paginator: Paginator | null = null): void {
        this._paginator.set(paginator);
    }

    index (page: number | null = null, url: string = 'http://localhost:9015/api/nutrients'): Observable<any> {
        let finalUrl: string = url;
        if (page) {
            finalUrl+= "?page=" + page;
        }

        return this.http.get<any>(finalUrl, { observe: 'response' as const}).pipe(
            tap(response => {
                this.apiHandlerService.showSuccess('Nutrients index loaded.');
            }),
            map((response) => {
                console.log(response.body);
                this.setNutrients(response.body.data);
                this.setPaginator({
                    current_page: response.body.current_page,
                    first_page_url: response.body.first_page_url,
                    from: response.body.from,
                    last_page: response.body.last_page,
                    last_page_url: response.body.last_page_url,
                    links: response.body.links,
                    next_page_url: response.body.next_page_url,
                    path: response.body.path,
                    per_page: response.body.per_page,
                    prev_page_url: response.body.prev_page_url,
                    to: response.body.to,
                    total: response.body.total
                } as Paginator);
                return response.body.data;
            }),
            catchError((error: HttpErrorResponse) => {
                this.apiHandlerService.showError(error);
                if (error.status === 401 || error.status === 422) return throwError(() => error);
                return EMPTY;
            })
        );
    }
}
