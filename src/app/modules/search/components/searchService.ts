import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchApiRequest } from '../../../core/Search/contracts/SearchApiRequest';
import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';
import { APP_CONFIG, AppConfig } from '../../../config/app-config';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(
    @Inject(APP_CONFIG) private cfg: AppConfig,
    private fetcher: ApiFetcherService,
  ) {}

  search(query: string, index: 'nutrients' | 'ingredients', page: number = 1): Observable<SearchApiResponse> {
    const payload: SearchApiRequest = { index, query, page };
    const url = `${this.cfg.appBackendUrl}/api/search`;

    return this.fetcher.postAndProcess<SearchApiRequest, SearchApiResponse>(
      url,
      payload,
      "Here's what we found for you",
      body => body ?? { results: [], query, index, total: 0, per_page: 25, current_page: 1, last_page: 1, from: null, to: null, page },
    );
  }
}
