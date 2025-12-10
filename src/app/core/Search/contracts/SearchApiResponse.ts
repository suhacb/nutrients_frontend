import { Paginator } from '../../Paginator/paginator.d';

export interface SearchApiResponse<TItem> extends Paginator {
    results: TItem[];
}