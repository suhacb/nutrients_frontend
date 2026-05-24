import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { NutripediaPage } from './nutripedia';
import { NutrientsStore } from '../nutrients/store/nutrients.store';
import { IngredientsStore } from '../ingredients/store/ingredients.store';
import { RecipesStore } from '../recipes/store/recipes.store';
import { Nutrient } from '../nutrients/contracts/Nutrient';

function makeNutrient(overrides: Partial<Nutrient> = {}): Nutrient {
  return {
    id: 1, name: 'Vitamin C', description: null, slug: 'vitamin-c',
    iuToCanonicalFactor: null, isLabelStandard: true, displayOrder: 1, syncStatus: 'synced',
    sourceMappings: [], createdAt: new Date(), updatedAt: null, deletedAt: null,
    ...overrides,
  };
}

describe('NutripediaPage', () => {
  let fixture: ComponentFixture<NutripediaPage>;
  let component: NutripediaPage;
  let nutrientsStoreSpy: {
    nutrients: jasmine.Spy; nutrient: jasmine.Spy; paginator: jasmine.Spy; breadcrumb: jasmine.Spy;
    show: jasmine.Spy; search: jasmine.Spy; setNutrient: jasmine.Spy;
  };
  let ingredientsStoreSpy: {
    ingredients: jasmine.Spy; ingredient: jasmine.Spy; paginator: jasmine.Spy; breadcrumb: jasmine.Spy;
    show: jasmine.Spy; search: jasmine.Spy; setIngredient: jasmine.Spy;
  };
  let recipesStoreSpy: {
    recipes: jasmine.Spy; recipe: jasmine.Spy; paginator: jasmine.Spy; nutrientProfile: jasmine.Spy;
    show: jasmine.Spy; search: jasmine.Spy; setRecipe: jasmine.Spy; loadNutrientProfile: jasmine.Spy;
  };
  let routerSpy: jasmine.SpyObj<Router>;
  let paramsSubject: Subject<Record<string, string>>;

  beforeEach(() => {
    paramsSubject = new Subject();

    nutrientsStoreSpy = {
      nutrients: jasmine.createSpy('nutrients').and.returnValue([]),
      nutrient: jasmine.createSpy('nutrient').and.returnValue(null),
      paginator: jasmine.createSpy('paginator').and.returnValue(null),
      breadcrumb: jasmine.createSpy('breadcrumb').and.returnValue([]),
      show: jasmine.createSpy('show').and.returnValue(of(undefined)),
      search: jasmine.createSpy('search'),
      setNutrient: jasmine.createSpy('setNutrient'),
    };

    ingredientsStoreSpy = {
      ingredients: jasmine.createSpy('ingredients').and.returnValue([]),
      ingredient: jasmine.createSpy('ingredient').and.returnValue(null),
      paginator: jasmine.createSpy('paginator').and.returnValue(null),
      breadcrumb: jasmine.createSpy('breadcrumb').and.returnValue([]),
      show: jasmine.createSpy('show').and.returnValue(of(undefined)),
      search: jasmine.createSpy('search'),
      setIngredient: jasmine.createSpy('setIngredient'),
    };

    recipesStoreSpy = {
      recipe: jasmine.createSpy('recipe').and.returnValue(null),
      recipes: jasmine.createSpy('recipes').and.returnValue([]),
      paginator: jasmine.createSpy('paginator').and.returnValue(null),
      nutrientProfile: jasmine.createSpy('nutrientProfile').and.returnValue(null),
      show: jasmine.createSpy('show').and.returnValue(of(undefined)),
      search: jasmine.createSpy('search'),
      setRecipe: jasmine.createSpy('setRecipe'),
      loadNutrientProfile: jasmine.createSpy('loadNutrientProfile').and.returnValue(of(null)),
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [NutripediaPage],
      providers: [
        { provide: NutrientsStore, useValue: nutrientsStoreSpy },
        { provide: IngredientsStore, useValue: ingredientsStoreSpy },
        { provide: RecipesStore, useValue: recipesStoreSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: paramsSubject.asObservable() } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(NutripediaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => component.ngOnDestroy());

  // ---------------------------------------------------------------------------
  // ngOnInit — route params
  // ---------------------------------------------------------------------------

  describe('route param handling', () => {
    it('sets category and activeId from params', () => {
      paramsSubject.next({ category: 'ingredients', id: '7' });
      expect(component.category).toBe('ingredients');
      expect(component.activeId).toBe(7);
    });

    it('defaults category to nutrients when not in params', () => {
      paramsSubject.next({});
      expect(component.category).toBe('nutrients');
    });

    it('sets activeId to null when id is absent', () => {
      paramsSubject.next({ category: 'nutrients' });
      expect(component.activeId).toBeNull();
    });

    it('calls nutrientsStore.show when category is nutrients and id is set', () => {
      paramsSubject.next({ category: 'nutrients', id: '3' });
      expect(nutrientsStoreSpy.show).toHaveBeenCalledOnceWith(3);
    });

    it('calls ingredientsStore.show when category is ingredients and id is set', () => {
      paramsSubject.next({ category: 'ingredients', id: '5' });
      expect(ingredientsStoreSpy.show).toHaveBeenCalledOnceWith(5);
    });

    it('calls recipesStore.show then loadNutrientProfile when category is recipes and id is set', () => {
      paramsSubject.next({ category: 'recipes', id: '8' });
      expect(recipesStoreSpy.show).toHaveBeenCalledOnceWith(8);
      expect(recipesStoreSpy.loadNutrientProfile).toHaveBeenCalledOnceWith(8);
    });

    it('clears nutrient, ingredient, and recipe when activeId is null', () => {
      paramsSubject.next({ category: 'nutrients' });
      expect(nutrientsStoreSpy.setNutrient).toHaveBeenCalledOnceWith(null);
      expect(ingredientsStoreSpy.setIngredient).toHaveBeenCalledOnceWith(null);
      expect(recipesStoreSpy.setRecipe).toHaveBeenCalledOnceWith(null);
    });
  });

  // ---------------------------------------------------------------------------
  // onCategoryChange
  // ---------------------------------------------------------------------------

  describe('onCategoryChange', () => {
    it('navigates to /nutripedia/<category>', () => {
      component.onCategoryChange('ingredients');
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/nutripedia', 'ingredients']);
    });
  });

  // ---------------------------------------------------------------------------
  // onEntrySelect
  // ---------------------------------------------------------------------------

  describe('onEntrySelect', () => {
    it('navigates to /nutripedia/<category>/<id>', () => {
      component.category = 'nutrients';
      component.onEntrySelect(42);
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/nutripedia', 'nutrients', 42]);
    });
  });

  // ---------------------------------------------------------------------------
  // onSearch
  // ---------------------------------------------------------------------------

  describe('onSearch', () => {
    it('delegates to nutrientsStore.search when category is nutrients', () => {
      component.category = 'nutrients';
      component.onSearch('iron');
      expect(nutrientsStoreSpy.search).toHaveBeenCalledOnceWith('iron');
    });

    it('delegates to ingredientsStore.search when category is ingredients', () => {
      component.category = 'ingredients';
      component.onSearch('spinach');
      expect(ingredientsStoreSpy.search).toHaveBeenCalledOnceWith('spinach');
    });

    it('delegates to recipesStore.search when category is recipes', () => {
      component.category = 'recipes';
      component.onSearch('stew');
      expect(recipesStoreSpy.search).toHaveBeenCalledOnceWith('stew');
    });

    it('stores the query on the component', () => {
      component.onSearch('query');
      expect(component.searchQuery).toBe('query');
    });
  });

  // ---------------------------------------------------------------------------
  // getAncestors
  // ---------------------------------------------------------------------------

  describe('getAncestors', () => {
    it('returns an empty array when the nutrient has no parent', () => {
      const nutrient = makeNutrient({ parent: null });
      expect(component.getAncestors(nutrient)).toEqual([]);
    });

    it('returns ancestors in root-first order', () => {
      const grandparent = makeNutrient({ id: 100, name: 'Root', parent: null });
      const parent = makeNutrient({ id: 50, name: 'Mid', parent: grandparent });
      const child = makeNutrient({ id: 1, name: 'Leaf', parent: parent });
      const ancestors = component.getAncestors(child);
      expect(ancestors.map(a => a.id)).toEqual([100, 50]);
    });
  });

  // ---------------------------------------------------------------------------
  // onLoadMore
  // ---------------------------------------------------------------------------

  describe('onLoadMore', () => {
    it('does nothing when paginator is null', () => {
      component.category = 'nutrients';
      nutrientsStoreSpy.paginator.and.returnValue(null);
      component.onLoadMore();
      expect(nutrientsStoreSpy.search).not.toHaveBeenCalled();
    });

    it('does nothing when already on the last page', () => {
      component.category = 'nutrients';
      nutrientsStoreSpy.paginator.and.returnValue({ currentPage: 3, lastPage: 3 });
      component.onLoadMore();
      expect(nutrientsStoreSpy.search).not.toHaveBeenCalled();
    });

    it('calls nutrientsStore.search with page+1 and append=true', () => {
      component.category = 'nutrients';
      component.searchQuery = 'iron';
      nutrientsStoreSpy.paginator.and.returnValue({ currentPage: 1, lastPage: 5 });
      component.onLoadMore();
      expect(nutrientsStoreSpy.search).toHaveBeenCalledOnceWith('iron', 2, true);
    });

    it('calls ingredientsStore.search with page+1 and append=true', () => {
      component.category = 'ingredients';
      component.searchQuery = 'spinach';
      ingredientsStoreSpy.paginator.and.returnValue({ currentPage: 2, lastPage: 4 });
      component.onLoadMore();
      expect(ingredientsStoreSpy.search).toHaveBeenCalledOnceWith('spinach', 3, true);
    });

    it('calls recipesStore.search with page+1 and append=true', () => {
      component.category = 'recipes';
      component.searchQuery = 'stew';
      recipesStoreSpy.paginator.and.returnValue({ currentPage: 1, lastPage: 3 });
      component.onLoadMore();
      expect(recipesStoreSpy.search).toHaveBeenCalledOnceWith('stew', 2, true);
    });
  });
});
