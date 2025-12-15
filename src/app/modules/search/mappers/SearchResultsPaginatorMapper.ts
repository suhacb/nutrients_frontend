import { ResourceMapper } from "../../../core/ResourceMapper/ResourceMapper";
import { SearchResultsPaginator, SearchResultsPaginatorApiPayload, SearchResultsPaginatorApiResource } from "../contracts/SearchResultsPaginator.d";

export class SearchResultsPaginatorMapper extends ResourceMapper<SearchResultsPaginator, SearchResultsPaginatorApiResource, SearchResultsPaginatorApiPayload> {
    public toApp(api: SearchResultsPaginatorApiResource): SearchResultsPaginator {
        return {
            currentPage: api.current_page,
            from: api.from,
            index: api.index,
            lastPage: api.last_page,
            page: api.page,
            perPage: api.per_page,
            query: api.query,
            to: api.to,
            total: api.total,
            pages: Array.from({ length: api.last_page }, (_, i) => i + 1)
        }
    }

    public toApi(app: SearchResultsPaginator): SearchResultsPaginatorApiPayload {
        return {
            current_page: app.currentPage,
            from: app.from,
            index: app.index,
            last_page: app.lastPage,
            page: app.page,
            per_page: app.perPage,
            query: app.query,
            to: app.to,
            total: app.total,
        }
    }

    public make(): SearchResultsPaginator {
        return {
            currentPage: 0,
            from: 0,
            index: '',
            lastPage: 0,
            page: 0,
            perPage: 0,
            query: '',
            to: 0,
            total: 0,
            pages: []
        }
    }
}