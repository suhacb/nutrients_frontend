import { SearchResultsPaginatorMapper } from './SearchResultsPaginatorMapper';
import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';

describe('SearchResultsPaginatorMapper', () => {
  let mapper: SearchResultsPaginatorMapper;

  const fullResponse: SearchApiResponse = {
    results: [],
    query: 'vitamin',
    index: 'nutrients',
    total: 42,
    per_page: 25,
    current_page: 2,
    last_page: 3,
    from: 26,
    to: 42,
    page: 2,
  };

  beforeEach(() => {
    mapper = new SearchResultsPaginatorMapper();
  });

  describe('toApp', () => {
    it('maps all scalar fields', () => {
      const result = mapper.toApp(fullResponse);

      expect(result.query).toBe('vitamin');
      expect(result.index).toBe('nutrients');
      expect(result.total).toBe(42);
      expect(result.perPage).toBe(25);
      expect(result.currentPage).toBe(2);
      expect(result.lastPage).toBe(3);
      expect(result.from).toBe(26);
      expect(result.to).toBe(42);
      expect(result.page).toBe(2);
    });

    it('generates a pages array from 1 to lastPage', () => {
      const result = mapper.toApp(fullResponse);

      expect(result.pages).toEqual([1, 2, 3]);
    });

    it('generates pages = [1] when lastPage is 1', () => {
      const result = mapper.toApp({ ...fullResponse, last_page: 1 });

      expect(result.pages).toEqual([1]);
    });

    it('generates correct pages array for a large lastPage', () => {
      const result = mapper.toApp({ ...fullResponse, last_page: 5 });

      expect(result.pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('preserves null for from and to', () => {
      const result = mapper.toApp({ ...fullResponse, from: null, to: null });

      expect(result.from).toBeNull();
      expect(result.to).toBeNull();
    });
  });

  describe('make', () => {
    it('returns a zero-state paginator', () => {
      const result = mapper.make();

      expect(result.query).toBe('');
      expect(result.index).toBe('');
      expect(result.total).toBe(0);
      expect(result.perPage).toBe(25);
      expect(result.currentPage).toBe(1);
      expect(result.lastPage).toBe(1);
      expect(result.from).toBeNull();
      expect(result.to).toBeNull();
      expect(result.page).toBe(1);
      expect(result.pages).toEqual([]);
    });
  });
});
