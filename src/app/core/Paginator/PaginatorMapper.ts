import { ResourceMapper } from "../ResourceMapper/ResourceMapper"
import { Paginator } from "./Paginator"
import { PaginatorApiResource } from "./PaginatorApiResource"

export class PaginatorMapper extends ResourceMapper<Paginator, PaginatorApiResource, PaginatorApiResource> {
    public toApp(api: PaginatorApiResource): Paginator {
        return {
            currentPage: api.current_page,
            firstPageUrl: api.first_page_url,
            from: api.from,
            lastPage: api.last_page,
            lastPageUrl: api.last_page_url,
            links: api.links,
            nextPageUrl: api.next_page_url,
            path: api.path,
            perPage: api.per_page,
            prevPageUrl: api.prev_page_url,
            to: api.to,
            total: api.total,
        }
    }

    public toApi(app: Paginator): PaginatorApiResource {
        return {
            current_page: app.currentPage,
            first_page_url: app.firstPageUrl,
            from: app.from,
            last_page: app.lastPage,
            last_page_url: app.lastPageUrl,
            links: app.links,
            next_page_url: app.nextPageUrl,
            path: app.path,
            per_page: app.perPage,
            prev_page_url: app.prevPageUrl,
            to: app.to,
            total: app.total,
        }
    }

    public make(): Paginator {
        return {
            currentPage: 0,
            firstPageUrl: '',
            from: 0,
            lastPage: 0,
            lastPageUrl: '',
            links: [],
            nextPageUrl: '',
            path: '',
            perPage: 0,
            prevPageUrl: '',
            to: 0,
            total: 0,
        }
    }
}