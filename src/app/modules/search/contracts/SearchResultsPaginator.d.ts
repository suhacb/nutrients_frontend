export interface SearchResultsPaginator {
  currentPage: number,
  from: number,
  index: string,
  lastPage: number,
  page: number,
  perPage: number,
  query: string,
  to: number
  total: number,
  pages: number[]
}

export interface SearchResultsPaginatorApiResource {
  current_page: number,
  from: number,
  index: string,
  last_page: number,
  page: number,
  per_page: number,
  query: string,
  to: number
  total: number
}

export interface SearchResultsPaginatorApiPayload {
  current_page: number,
  from: number,
  index: string,
  last_page: number,
  page: number,
  per_page: number,
  query: string,
  to: number
  total: number
}