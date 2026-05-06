export interface SearchResultsPaginator {
  query: string;
  index: string;
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  from: number | null;
  to: number | null;
  page: number;
  pages: number[];
}
