import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class IngredientsStore {
    constructor(
        private http: HttpClient,
        private fetcher: ApiFetcherService
    ) {}

    index (page: number | null = null, url: string = 'http://localhost:9015/api/ingredients'): void | Observable<void> {
        const finalUrl = page ? `${url}?page=${page}` : url;

        console.log(finalUrl);
    }
}
