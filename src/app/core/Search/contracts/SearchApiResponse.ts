export interface SearchHit {
  id: number;
  name: string | null;
  description: string | null;
  score: number | null;
}

export interface SearchApiResponse {
  results: SearchHit[];
  query: string;
  index: string;
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  page: number;
}
