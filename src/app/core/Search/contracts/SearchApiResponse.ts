import { SearchResultsPaginatorApiResource } from '../../../modules/search/contracts/SearchResultsPaginator';
import { PaginatorApiResource } from '../../Paginator/PaginatorApiResource';

export interface SearchApiResponse<TItem> extends SearchResultsPaginatorApiResource {
    results: TItem[];
}