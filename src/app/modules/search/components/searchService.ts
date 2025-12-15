import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchApiRequest } from '../../../core/Search/contracts/SearchApiRequest';
import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';
import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    @Inject(APP_CONFIG) private cfg: AppConfig, 
    private fetcher: ApiFetcherService
  ) {}
  
    search<T>(searchQuery: string, index: 'nutrients' | 'ingredients', page: number = 1): Observable<SearchApiResponse<T>> {
        const payload = {
            index: index,
            query: searchQuery,
            page: page
        };

        const url = `${this.cfg.appBackendUrl}/api/search`;
        return this.fetcher.postAndProcess<SearchApiRequest, SearchApiResponse<T>>(
            url,
            payload,
            "Here's what we found for you",
            (body: SearchApiResponse<T>): SearchApiResponse<T> => {
                // Return empty response if nullish
                return (body ?? { results: [] }) as SearchApiResponse<T>;
            }
        );
    }
}