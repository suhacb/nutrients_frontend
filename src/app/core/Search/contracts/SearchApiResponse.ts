import { PaginatorApiResource } from '../../Paginator/PaginatorApiResource';

export interface SearchApiResponse<TItem> extends PaginatorApiResource {
    results: TItem[];
}