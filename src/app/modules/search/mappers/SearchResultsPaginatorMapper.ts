import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';
import { SearchResultsPaginator } from '../contracts/SearchResultsPaginator.d';

export class SearchResultsPaginatorMapper {
  toApp(api: SearchApiResponse): SearchResultsPaginator {
    return {
      query: api.query,
      index: api.index,
      total: api.total,
      perPage: api.per_page,
      currentPage: api.current_page,
      lastPage: api.last_page,
      from: api.from,
      to: api.to,
      page: api.page,
      pages: Array.from({ length: api.last_page }, (_, i) => i + 1),
    };
  }

  make(): SearchResultsPaginator {
    return {
      query: '',
      index: '',
      total: 0,
      perPage: 25,
      currentPage: 1,
      lastPage: 1,
      from: null,
      to: null,
      page: 1,
      pages: [],
    };
  }
}
