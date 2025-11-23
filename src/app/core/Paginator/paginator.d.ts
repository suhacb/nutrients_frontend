export type Paginator = {
    currentPage: number,
    firstPageUrl: string,
    from: number,
    lastPage: number,
    lastPageUrl: string,
    links: {
        url: string | null,
        label: string,
        page: number | null,
        active: boolean
    }[],
    nextPageUrl: string,
    path: string,
    perPage: number,
    prevPageUrl: string,
    to: number,
    total: number
}