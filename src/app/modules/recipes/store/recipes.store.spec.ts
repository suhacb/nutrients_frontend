import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RecipesStore } from './recipes.store';
import { ApiFetcherService } from '../../../core/http/ApiFetcherService';
import { APP_CONFIG } from '../../../config/app-config';
import { RecipeApiResource } from '../contracts/RecipeApiResource';
import { DietTagApiResource } from '../contracts/DietTagApiResource';
import { NutrientProfileApiResource } from '../contracts/NutrientProfileApiResource';

describe('RecipesStore', () => {
  let store: RecipesStore;
  let fetcherSpy: jasmine.SpyObj<ApiFetcherService>;

  const appConfig = { appBackendUrl: 'http://test-backend', appNameHeader: '', appBaseUrl: '', appName: '', appTitle: '' };

  const recipeResource: RecipeApiResource = {
    id: 1,
    name: 'Pasta Bolognese',
    slug: 'pasta-bolognese',
    description: 'Classic Italian.',
    instructions: null,
    portions: 4,
    source_url: null,
    sync_status: 'synced',
    diet_tags: [],
    ingredients: [],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  };

  const recipeResource2: RecipeApiResource = {
    ...recipeResource,
    id: 2,
    name: 'Salad',
    slug: 'salad',
  };

  const dietTagResource: DietTagApiResource = {
    id: 3,
    name: 'Ketogenic',
    slug: 'ketogenic',
    description: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const profileResource: NutrientProfileApiResource = {
    total: [{ nutrient_id: 1, nutrient_name: 'Vitamin C', amount: 100, unit_id: 10, unit: 'mg' }],
    per_portion: [{ nutrient_id: 1, nutrient_name: 'Vitamin C', amount: 25, unit_id: 10, unit: 'mg' }],
    portions: 4,
  };

  const paginatedResponse = {
    data: [recipeResource, recipeResource2],
    current_page: 1,
    total: 2,
    per_page: 20,
    last_page: 1,
  };

  const searchResponse = {
    results: [recipeResource, recipeResource2],
    total: 2,
    current_page: 1,
    last_page: 1,
    per_page: 20,
  };

  beforeEach(() => {
    fetcherSpy = jasmine.createSpyObj('ApiFetcherService', [
      'fetchAndProcess',
      'postAndProcess',
      'putAndProcess',
      'deleteAndProcess',
    ]);

    TestBed.configureTestingModule({
      providers: [
        RecipesStore,
        { provide: ApiFetcherService, useValue: fetcherSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });
    store = TestBed.inject(RecipesStore);
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('recipes is an empty array', () => {
      expect(store.recipes()).toEqual([]);
    });

    it('recipe is null', () => {
      expect(store.recipe()).toBeNull();
    });

    it('paginator is null', () => {
      expect(store.paginator()).toBeNull();
    });

    it('nutrientProfile is null', () => {
      expect(store.nutrientProfile()).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Setters
  // ---------------------------------------------------------------------------

  describe('setters', () => {
    it('setRecipe replaces the recipe signal', () => {
      store.setRecipe({ id: 7 } as any);
      expect(store.recipe()?.id).toBe(7);
    });

    it('setRecipes replaces the recipes signal', () => {
      store.setRecipes([{ id: 1 } as any, { id: 2 } as any]);
      expect(store.recipes().length).toBe(2);
    });

    it('setNutrientProfile replaces the nutrientProfile signal', () => {
      store.setNutrientProfile({ total: [], perPortion: [], portions: 1 });
      expect(store.nutrientProfile()?.portions).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // index
  // ---------------------------------------------------------------------------

  describe('index', () => {
    it('sets recipes from the paginated response', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index();
      expect(store.recipes().length).toBe(2);
      expect(store.recipes()[0].name).toBe('Pasta Bolognese');
    });

    it('sets the paginator from the response', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index();
      expect(store.paginator()?.total).toBe(2);
      expect(store.paginator()?.lastPage).toBe(1);
      expect(store.paginator()?.pages).toEqual([1]);
    });

    it('replaces the list by default (append = false)', () => {
      store.setRecipes([{ id: 99 } as any]);
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index();
      expect(store.recipes().length).toBe(2);
    });

    it('appends to the existing list when append = true', () => {
      store.setRecipes([{ id: 99, name: 'Existing' } as any]);
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index(2, true);
      expect(store.recipes().length).toBe(3);
      expect(store.recipes()[0].id).toBe(99);
    });

    it('calls fetchAndProcess with a URL containing the page number', () => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(paginatedResponse);
        return of(undefined);
      });

      store.index(3);
      expect(fetcherSpy.fetchAndProcess.calls.mostRecent().args[0])
        .toBe('http://test-backend/api/recipes?page=3');
    });
  });

  // ---------------------------------------------------------------------------
  // search
  // ---------------------------------------------------------------------------

  describe('search', () => {
    it('sets recipes from the search response', () => {
      fetcherSpy.postAndProcess.and.returnValue(of(searchResponse));
      store.search('pasta');

      expect(store.recipes().length).toBe(2);
    });

    it('appends results when append = true', () => {
      store.setRecipes([{ id: 99 } as any]);
      fetcherSpy.postAndProcess.and.returnValue(of(searchResponse));
      store.search('pasta', 2, true);

      expect(store.recipes().length).toBe(3);
    });
  });

  // ---------------------------------------------------------------------------
  // show
  // ---------------------------------------------------------------------------

  describe('show', () => {
    it('sets recipe from the response', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(recipeResource);
        return of(undefined);
      });

      store.show(1).subscribe(() => {
        expect(store.recipe()?.name).toBe('Pasta Bolognese');
        done();
      });
    });

    it('resets nutrientProfile to null', (done) => {
      store.setNutrientProfile({ total: [], perPortion: [], portions: 2 });
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(recipeResource);
        return of(undefined);
      });

      store.show(1).subscribe(() => {
        expect(store.nutrientProfile()).toBeNull();
        done();
      });
    });

    it('sets recipe to null when body is null', (done) => {
      store.setRecipe({ id: 1 } as any);
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(null);
        return of(undefined);
      });

      store.show(1).subscribe(() => {
        expect(store.recipe()).toBeNull();
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // create
  // ---------------------------------------------------------------------------

  describe('create', () => {
    it('emits the mapped recipe', (done) => {
      fetcherSpy.postAndProcess.and.returnValue(of(recipeResource));

      store.create({ name: 'Pasta Bolognese', portions: 4, description: null, instructions: null, source_url: null })
        .subscribe(recipe => {
          expect(recipe.id).toBe(1);
          expect(recipe.name).toBe('Pasta Bolognese');
          done();
        });
    });
  });

  // ---------------------------------------------------------------------------
  // update
  // ---------------------------------------------------------------------------

  describe('update', () => {
    it('emits the updated recipe and sets it in the store', (done) => {
      const updatedResource = { ...recipeResource, name: 'Updated Name' };
      fetcherSpy.putAndProcess.and.returnValue(of(updatedResource));

      store.update(1, { name: 'Updated Name', portions: 4, description: null, instructions: null, source_url: null })
        .subscribe(recipe => {
          expect(recipe.name).toBe('Updated Name');
          expect(store.recipe()?.name).toBe('Updated Name');
          done();
        });
    });
  });

  // ---------------------------------------------------------------------------
  // delete
  // ---------------------------------------------------------------------------

  describe('delete', () => {
    beforeEach(() => {
      store.setRecipes([
        { id: 1, name: 'Pasta Bolognese' } as any,
        { id: 2, name: 'Salad' } as any,
      ]);
      store.setRecipe({ id: 1 } as any);
    });

    it('sets recipe to null', (done) => {
      fetcherSpy.deleteAndProcess.and.returnValue(of(undefined));

      store.delete(1).subscribe(() => {
        expect(store.recipe()).toBeNull();
        done();
      });
    });

    it('removes the deleted recipe from the recipes list', (done) => {
      fetcherSpy.deleteAndProcess.and.returnValue(of(undefined));

      store.delete(1).subscribe(() => {
        expect(store.recipes().length).toBe(1);
        expect(store.recipes()[0].id).toBe(2);
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // loadNutrientProfile
  // ---------------------------------------------------------------------------

  describe('loadNutrientProfile', () => {
    it('sets nutrientProfile from the response', (done) => {
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(profileResource);
        return of(undefined);
      });

      store.loadNutrientProfile(1).subscribe(() => {
        const profile = store.nutrientProfile();
        expect(profile).not.toBeNull();
        expect(profile!.total.length).toBe(1);
        expect(profile!.total[0].nutrientName).toBe('Vitamin C');
        expect(profile!.perPortion[0].amount).toBe(25);
        done();
      });
    });

    it('leaves nutrientProfile unchanged when body is null', (done) => {
      store.setNutrientProfile({ total: [], perPortion: [], portions: 1 });
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(null);
        return of(undefined);
      });

      store.loadNutrientProfile(1).subscribe(() => {
        expect(store.nutrientProfile()?.portions).toBe(1);
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // attachDietTag
  // ---------------------------------------------------------------------------

  describe('attachDietTag', () => {
    beforeEach(() => {
      store.setRecipe({ id: 1, name: 'Pasta', slug: 'pasta', dietTags: [], ingredients: [], portions: 2, description: null, instructions: null, sourceUrl: null, syncStatus: 'synced' });
    });

    it('emits the mapped tags array', (done) => {
      fetcherSpy.postAndProcess.and.returnValue(of([dietTagResource]));

      store.attachDietTag(1, 3).subscribe(tags => {
        expect(tags.length).toBe(1);
        expect(tags[0].name).toBe('Ketogenic');
        done();
      });
    });

    it('updates recipe.dietTags with the returned tags', (done) => {
      fetcherSpy.postAndProcess.and.returnValue(of([dietTagResource]));

      store.attachDietTag(1, 3).subscribe(() => {
        expect(store.recipe()?.dietTags.length).toBe(1);
        expect(store.recipe()?.dietTags[0].id).toBe(3);
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // detachDietTag
  // ---------------------------------------------------------------------------

  describe('detachDietTag', () => {
    beforeEach(() => {
      store.setRecipe({
        id: 1, name: 'Pasta', slug: 'pasta', portions: 2, description: null, instructions: null, sourceUrl: null, syncStatus: 'synced',
        dietTags: [
          { id: 3, name: 'Ketogenic', slug: 'ketogenic', description: null, createdAt: new Date(), updatedAt: new Date() },
          { id: 4, name: 'Vegan', slug: 'vegan', description: null, createdAt: new Date(), updatedAt: new Date() },
        ],
        ingredients: [],
      });
    });

    it('removes the detached tag from recipe.dietTags', (done) => {
      fetcherSpy.deleteAndProcess.and.returnValue(of(undefined));

      store.detachDietTag(1, 3).subscribe(() => {
        expect(store.recipe()?.dietTags.length).toBe(1);
        expect(store.recipe()?.dietTags[0].id).toBe(4);
        done();
      });
    });
  });

  // ---------------------------------------------------------------------------
  // attachIngredient / updateIngredientPivot / detachIngredient
  // ---------------------------------------------------------------------------

  describe('attachIngredient', () => {
    it('calls postAndProcess then re-fetches the recipe via show', (done) => {
      fetcherSpy.postAndProcess.and.returnValue(of({}));
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(recipeResource);
        return of(undefined);
      });

      store.attachIngredient(1, 7, 200, 10).subscribe(() => {
        expect(fetcherSpy.postAndProcess).toHaveBeenCalledTimes(1);
        expect(fetcherSpy.fetchAndProcess).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('updateIngredientPivot', () => {
    it('calls putAndProcess then re-fetches the recipe via show', (done) => {
      fetcherSpy.putAndProcess.and.returnValue(of({}));
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(recipeResource);
        return of(undefined);
      });

      store.updateIngredientPivot(1, 7, 150, 10).subscribe(() => {
        expect(fetcherSpy.putAndProcess).toHaveBeenCalledTimes(1);
        expect(fetcherSpy.fetchAndProcess).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });

  describe('detachIngredient', () => {
    it('calls deleteAndProcess then re-fetches the recipe via show', (done) => {
      fetcherSpy.deleteAndProcess.and.returnValue(of(undefined));
      fetcherSpy.fetchAndProcess.and.callFake((_url: string, _msg: string, process: (b: any) => void) => {
        process(recipeResource);
        return of(undefined);
      });

      store.detachIngredient(1, 7).subscribe(() => {
        expect(fetcherSpy.deleteAndProcess).toHaveBeenCalledTimes(1);
        expect(fetcherSpy.fetchAndProcess).toHaveBeenCalledTimes(1);
        done();
      });
    });
  });
});
