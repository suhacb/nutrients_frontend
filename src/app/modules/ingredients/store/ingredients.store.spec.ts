import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IngredientsStore } from './ingredients.store';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { SearchService } from '../../search/components/searchService';
import { APP_CONFIG } from '../../../config/app-config';
import { IngredientApiResource } from '../contracts/IngredientApiResource';
import { SearchApiResponse } from '../../../core/Search/contracts/SearchApiResponse';

describe('IngredientsStore', () => {
  let store: IngredientsStore;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;
  let searchServiceSpy: jasmine.SpyObj<SearchService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const ingredientResource: IngredientApiResource = {
    id: 5,
    name: 'Chicken Breast',
    slug: 'chicken-breast',
    sync_status: 'synced',
    external_id: null,
    source: null,
    class: null,
    description: null,
    default_amount: 100,
    default_amount_unit: null,
    brand: null,
    categories: [],
    nutrition_facts: [],
    nutrients: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  };

  const searchResponse: SearchApiResponse = {
    results: [
      { id: 5, name: 'Chicken Breast', description: null, score: 1.0 },
      { id: 6, name: 'Chicken Thigh', description: null, score: 0.9 },
    ],
    query: 'chicken',
    index: 'ingredients',
    total: 2,
    per_page: 25,
    current_page: 1,
    last_page: 1,
    from: 1,
    to: 2,
    page: 1,
  };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', ['fetchAndProcess']);
    searchServiceSpy = jasmine.createSpyObj('SearchService', ['search']);

    TestBed.configureTestingModule({
      providers: [
        IngredientsStore,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: SearchService, useValue: searchServiceSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    store = TestBed.inject(IngredientsStore);
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('ingredients is an empty array', () => {
      expect(store.ingredients()).toEqual([]);
    });

    it('ingredient is null', () => {
      expect(store.ingredient()).toBeNull();
    });

    it('paginator is null', () => {
      expect(store.paginator()).toBeNull();
    });

    it('breadcrumb starts empty (unlike NutrientsStore)', () => {
      expect(store.breadcrumb()).toEqual([]);
    });
  });

  // ---------------------------------------------------------------------------
  // Setters
  // ---------------------------------------------------------------------------

  describe('setters', () => {
    it('setIngredients replaces the ingredients signal', () => {
      store.setIngredients([{ id: 1 } as any]);
      expect(store.ingredients().length).toBe(1);
    });

    it('setIngredient replaces the ingredient signal', () => {
      store.setIngredient({ id: 42 } as any);
      expect(store.ingredient()?.id).toBe(42);
    });

    it('setPaginator replaces the paginator signal', () => {
      store.setPaginator({ total: 10 } as any);
      expect(store.paginator()?.total).toBe(10);
    });

    it('setBreadcrumb replaces the breadcrumb signal', () => {
      store.setBreadcrumb([{ title: 'Test' }]);
      expect(store.breadcrumb()[0].title).toBe('Test');
    });
  });

  // ---------------------------------------------------------------------------
  // show
  // ---------------------------------------------------------------------------

  describe('show', () => {
    it('sets ingredient after the fetch callback is invoked', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(ingredientResource);
        return of(undefined);
      });

      store.show(5).subscribe(() => {
        expect(store.ingredient()).not.toBeNull();
        expect(store.ingredient()!.name).toBe('Chicken Breast');
        done();
      });
    });

    it('builds a three-entry breadcrumb including the ingredient name', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(ingredientResource);
        return of(undefined);
      });

      store.show(5).subscribe(() => {
        const bc = store.breadcrumb();
        expect(bc.length).toBe(3);
        expect(bc[1].title).toBe('Ingredients');
        expect(bc[2].title).toBe('Chicken Breast');
        done();
      });
    });

    it('sets ingredient to null when the response body is null', (done) => {
      store.setIngredient({ id: 5 } as any);

      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(null);
        return of(undefined);
      });

      store.show(5).subscribe(() => {
        expect(store.ingredient()).toBeNull();
        done();
      });
    });

    it('calls fetchAndProcess with the correct URL', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(ingredientResource);
        return of(undefined);
      });

      store.show(5).subscribe(() => {
        expect(fetcherSpy.fetchAndProcess.calls.mostRecent().args[0])
          .toBe('http://test-backend/api/ingredients/5');
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // search
  // ---------------------------------------------------------------------------

  describe('search', () => {
    it('sets ingredients from the search results', () => {
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('chicken');

      expect(store.ingredients().length).toBe(2);
      expect(store.ingredients()[0].name).toBe('Chicken Breast');
    });

    it('sets the paginator from the search response', () => {
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('chicken');

      expect(store.paginator()?.total).toBe(2);
    });

    it('replaces the list by default (append = false)', () => {
      store.setIngredients([{ id: 99 } as any]);
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('chicken');

      expect(store.ingredients().length).toBe(2);
    });

    it('appends to the existing list when append = true', () => {
      store.setIngredients([{ id: 99, name: 'Existing' } as any]);
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('chicken', 2, true);

      expect(store.ingredients().length).toBe(3);
      expect(store.ingredients()[0].id).toBe(99);
    });

    it('calls SearchService with the correct arguments', () => {
      searchServiceSpy.search.and.returnValue(of(searchResponse));
      store.search('beef', 2);

      expect(searchServiceSpy.search).toHaveBeenCalledOnceWith('beef', 'ingredients', 2);
    });
  });
});
