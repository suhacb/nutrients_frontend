import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NutrientsStore } from './nutrients.store';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { SearchService } from '../../search/components/searchService';
import { APP_CONFIG } from '../../../config/app-config';
import { NutrientApiResource } from '../contracts/NutrientApiResource';
import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';

describe('NutrientsStore', () => {
  let store: NutrientsStore;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const nutrientResource: NutrientApiResource = {
    id: 1,
    name: 'Vitamin D',
    slug: 'vitamin-d',
    source_mappings: [],
    description: 'Essential vitamin.',
    sync_status: 'synced',
    is_label_standard: true,
    display_order: 5,
    iu_to_canonical_factor: null,
    canonical_unit: null,
    parent: null,
    children: [],
    tags: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: undefined,
  };

  const searchResponse: SearchApiResponse = {
    results: [
      { id: 1, name: 'Vitamin D', description: null, score: 1.0 },
      { id: 2, name: 'Vitamin C', description: null, score: 0.9 },
    ],
    query: 'vitamin',
    index: 'nutrients',
    total: 2,
    per_page: 25,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 2,
    page: 1,
  };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', ['fetchAndProcess', 'postAndProcess']);
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['search']);

    TestBed.configureTestingModule({
      providers: [
        NutrientsStore,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    store = TestBed.inject(NutrientsStore);
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('nutrients is an empty array', () => {
      expect(store.nutrients()).toEqual([]);
    });

    it('nutrient is null', () => {
      expect(store.nutrient()).toBeNull();
    });

    it('paginator is null', () => {
      expect(store.paginator()).toBeNull();
    });

    it('breadcrumb has a home entry and a Nutrients entry', () => {
      const bc = store.breadcrumb();
      expect(bc.length).toBe(2);
      expect(bc[0].icon).toBe('home');
      expect(bc[1].title).toBe('Nutrients');
    });
  });

  // ---------------------------------------------------------------------------
  // Setters
  // ---------------------------------------------------------------------------

  describe('setters', () => {
    it('setNutrients replaces the nutrients signal', () => {
      store.setNutrients([{ id: 1 } as any]);
      expect(store.nutrients().length).toBe(1);
    });

    it('setNutrient replaces the nutrient signal', () => {
      store.setNutrient({ id: 99 } as any);
      expect(store.nutrient()?.id).toBe(99);
    });

    it('setPaginator replaces the paginator signal', () => {
      store.setPaginator({ total: 5 } as any);
      expect(store.paginator()?.total).toBe(5);
    });

    it('setBreadcrumb replaces the breadcrumb signal', () => {
      store.setBreadcrumb([{ title: 'Custom' }]);
      expect(store.breadcrumb()[0].title).toBe('Custom');
    });
  });

  // ---------------------------------------------------------------------------
  // show
  // ---------------------------------------------------------------------------

  describe('show', () => {
    it('sets nutrient after the fetch callback is invoked', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(nutrientResource);
        return of(undefined);
      });

      store.show(1).subscribe(() => {
        expect(store.nutrient()).not.toBeNull();
        expect(store.nutrient()!.name).toBe('Vitamin D');
        done();
      });
    });

    it('builds a three-entry breadcrumb including the nutrient name', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(nutrientResource);
        return of(undefined);
      });

      store.show(1).subscribe(() => {
        const bc = store.breadcrumb();
        expect(bc.length).toBe(3);
        expect(bc[2].title).toBe('Vitamin D');
        done();
      });
    });

    it('sets nutrient to null when the response body is null', (done) => {
      store.setNutrient({ id: 1 } as any);

      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(null);
        return of(undefined);
      });

      store.show(1).subscribe(() => {
        expect(store.nutrient()).toBeNull();
        done();
      });
    });

    it('calls fetchAndProcess with the correct URL', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(nutrientResource);
        return of(undefined);
      });

      store.show(7).subscribe(() => {
        const url = fetcherSpy.fetchAndProcess.calls.mostRecent().args[0];
        expect(url).toBe('http://test-backend/api/nutrients/7');
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // search
  // ---------------------------------------------------------------------------

  describe('search', () => {
    it('sets nutrients from the search results', () => {
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('vitamin');

      expect(store.nutrients().length).toBe(2);
      expect(store.nutrients()[0].name).toBe('Vitamin D');
    });

    it('sets the paginator from the search response', () => {
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('vitamin');

      expect(store.paginator()?.total).toBe(2);
      expect(store.paginator()?.currentPage).toBe(1);
    });

    it('replaces the nutrients list by default (append = false)', () => {
      store.setNutrients([{ id: 99 } as any]);
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('vitamin');

      expect(store.nutrients().length).toBe(2);
      expect(store.nutrients()[0].id).toBe(1);
    });

    it('appends to the existing list when append = true', () => {
      store.setNutrients([{ id: 99, name: 'Existing' } as any]);
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('vitamin', 2, true);

      expect(store.nutrients().length).toBe(3);
      expect(store.nutrients()[0].id).toBe(99);
    });

    it('calls SearchService with the correct arguments', () => {
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('iron', 3);

      expect(searchServiceSpy.search).toHaveBeenCalledOnceWith('iron', 'nutrients', 3);
    });
  });
});
