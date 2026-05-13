import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RecipeFormPage } from './recipe-form';
import { RecipesStore } from '../../store/recipes.store';
import { DietTagsStore } from '../../store/diet-tags.store';
import { IngredientsStore } from '../../../ingredients/store/ingredients.store';
import { UnitsStore } from '../../../ingredients/store/units.store';
import { Recipe, RecipeIngredient } from '../../contracts/Recipe';
import { DietTag } from '../../contracts/DietTag';

function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: 1, name: 'Salad', slug: 'salad', description: null, instructions: null,
    portions: 2, sourceUrl: null, syncStatus: 'synced', dietTags: [], ingredients: [],
    ...overrides,
  };
}

function makeTag(id = 10): DietTag {
  return { id, name: 'Vegan', slug: 'vegan', description: null, createdAt: new Date(), updatedAt: new Date() };
}

function makeIngredient(id = 5): RecipeIngredient {
  return { id, name: 'Tomato', slug: 'tomato', amount: 2, unitId: 1, unitName: 'g', unitAbbreviation: 'g' };
}

function makeForm(valid: boolean): NgForm {
  return { invalid: !valid } as NgForm;
}

function makeRoute(id?: string) {
  return { snapshot: { paramMap: convertToParamMap(id ? { id } : {}) } };
}

describe('RecipeFormPage', () => {
  let fixture: ComponentFixture<RecipeFormPage>;
  let component: RecipeFormPage;
  let storeSpy: {
    recipe: jasmine.Spy;
    nutrientProfile: jasmine.Spy;
    show: jasmine.Spy;
    create: jasmine.Spy;
    update: jasmine.Spy;
    loadNutrientProfile: jasmine.Spy;
    attachDietTag: jasmine.Spy;
    detachDietTag: jasmine.Spy;
    updateIngredientPivot: jasmine.Spy;
    detachIngredient: jasmine.Spy;
    attachIngredient: jasmine.Spy;
  };
  let dietTagsStoreSpy: { dietTags: jasmine.Spy; index: jasmine.Spy };
  let ingredientsStoreSpy: { search: jasmine.Spy; searchResults: jasmine.Spy };
  let unitsStoreSpy: { units: jasmine.Spy; index: jasmine.Spy };
  let routerSpy: jasmine.SpyObj<Router>;

  function configure(routeId?: string) {
    const recipe = makeRecipe();
    storeSpy = {
      recipe: jasmine.createSpy('recipe').and.returnValue(null),
      nutrientProfile: jasmine.createSpy('nutrientProfile').and.returnValue(null),
      show: jasmine.createSpy('show').and.returnValue(of(recipe)),
      create: jasmine.createSpy('create').and.returnValue(of(recipe)),
      update: jasmine.createSpy('update').and.returnValue(of(recipe)),
      loadNutrientProfile: jasmine.createSpy('loadNutrientProfile').and.returnValue(of(null)),
      attachDietTag: jasmine.createSpy('attachDietTag').and.returnValue(of(undefined)),
      detachDietTag: jasmine.createSpy('detachDietTag').and.returnValue(of(undefined)),
      updateIngredientPivot: jasmine.createSpy('updateIngredientPivot').and.returnValue(of(undefined)),
      detachIngredient: jasmine.createSpy('detachIngredient').and.returnValue(of(undefined)),
      attachIngredient: jasmine.createSpy('attachIngredient').and.returnValue(of(undefined)),
    };

    dietTagsStoreSpy = {
      dietTags: jasmine.createSpy('dietTags').and.returnValue([]),
      index: jasmine.createSpy('index').and.returnValue(of(undefined)),
    };

    ingredientsStoreSpy = {
      search: jasmine.createSpy('search'),
      searchResults: jasmine.createSpy('searchResults').and.returnValue([]),
    };

    unitsStoreSpy = {
      units: jasmine.createSpy('units').and.returnValue([]),
      index: jasmine.createSpy('index').and.returnValue(of(undefined)),
    };

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RecipeFormPage],
      providers: [
        { provide: RecipesStore, useValue: storeSpy },
        { provide: DietTagsStore, useValue: dietTagsStoreSpy },
        { provide: IngredientsStore, useValue: ingredientsStoreSpy },
        { provide: UnitsStore, useValue: unitsStoreSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: makeRoute(routeId) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(RecipeFormPage);
    component = fixture.componentInstance;
  }

  afterEach(() => TestBed.resetTestingModule());

  // ---------------------------------------------------------------------------
  // isEdit
  // ---------------------------------------------------------------------------

  describe('isEdit', () => {
    it('is false when recipeId is null', () => {
      configure();
      expect(component.isEdit).toBeFalse();
    });

    it('is true when recipeId is set', () => {
      configure('42');
      component.recipeId = 42;
      expect(component.isEdit).toBeTrue();
    });
  });

  // ---------------------------------------------------------------------------
  // ngOnInit — create mode
  // ---------------------------------------------------------------------------

  describe('ngOnInit in create mode', () => {
    beforeEach(() => configure());

    it('calls dietTagsStore.index()', () => {
      component.ngOnInit();
      expect(dietTagsStoreSpy.index).toHaveBeenCalled();
    });

    it('calls unitsStore.index()', () => {
      component.ngOnInit();
      expect(unitsStoreSpy.index).toHaveBeenCalled();
    });

    it('does not call store.show()', () => {
      component.ngOnInit();
      expect(storeSpy.show).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // ngOnInit — edit mode
  // ---------------------------------------------------------------------------

  describe('ngOnInit in edit mode', () => {
    beforeEach(() => {
      configure('7');
      storeSpy.recipe.and.returnValue(makeRecipe({ id: 7, name: 'Pasta', portions: 4 }));
    });

    it('calls store.show with the route id', () => {
      component.ngOnInit();
      expect(storeSpy.show).toHaveBeenCalledOnceWith(7);
    });

    it('populates name and portions from the fetched recipe', () => {
      component.ngOnInit();
      expect(component.name).toBe('Pasta');
      expect(component.portions).toBe(4);
    });

    it('calls loadNutrientProfile after show completes', () => {
      component.ngOnInit();
      expect(storeSpy.loadNutrientProfile).toHaveBeenCalledOnceWith(7);
    });
  });

  // ---------------------------------------------------------------------------
  // availableTags computed
  // ---------------------------------------------------------------------------

  describe('availableTags', () => {
    beforeEach(() => configure());

    it('excludes tags already attached to the recipe', () => {
      const t1 = makeTag(1);
      const t2 = makeTag(2);
      dietTagsStoreSpy.dietTags.and.returnValue([t1, t2]);
      storeSpy.recipe.and.returnValue(makeRecipe({ dietTags: [t1] }));
      const available = component.availableTags();
      expect(available).toEqual([t2]);
    });

    it('returns all tags when recipe has none attached', () => {
      const t1 = makeTag(1);
      dietTagsStoreSpy.dietTags.and.returnValue([t1]);
      storeSpy.recipe.and.returnValue(makeRecipe({ dietTags: [] }));
      expect(component.availableTags()).toEqual([t1]);
    });
  });

  // ---------------------------------------------------------------------------
  // attachTag / detachTag
  // ---------------------------------------------------------------------------

  describe('attachTag', () => {
    beforeEach(() => configure('3'));

    it('calls store.attachDietTag when conditions are met', () => {
      component.recipeId = 3;
      component.selectedTagId = 10;
      component.attachTag();
      expect(storeSpy.attachDietTag).toHaveBeenCalledOnceWith(3, 10);
    });

    it('does nothing when selectedTagId is null', () => {
      component.recipeId = 3;
      component.selectedTagId = null;
      component.attachTag();
      expect(storeSpy.attachDietTag).not.toHaveBeenCalled();
    });

    it('resets selectedTagId and tagging on success', () => {
      component.recipeId = 3;
      component.selectedTagId = 10;
      component.attachTag();
      expect(component.selectedTagId).toBeNull();
      expect(component.tagging).toBeFalse();
    });
  });

  describe('detachTag', () => {
    beforeEach(() => configure('3'));

    it('calls store.detachDietTag with recipeId and tagId', () => {
      component.recipeId = 3;
      component.detachTag(10);
      expect(storeSpy.detachDietTag).toHaveBeenCalledOnceWith(3, 10);
    });

    it('does nothing when recipeId is null', () => {
      component.recipeId = null;
      component.detachTag(10);
      expect(storeSpy.detachDietTag).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Ingredient editing
  // ---------------------------------------------------------------------------

  describe('startEdit', () => {
    beforeEach(() => configure());

    it('sets editingIngredientId, editAmount, and editUnitId from the ingredient', () => {
      const ing = makeIngredient(5);
      component.startEdit(ing);
      expect(component.editingIngredientId).toBe(5);
      expect(component.editAmount).toBe(2);
      expect(component.editUnitId).toBe(1);
    });
  });

  describe('cancelEdit', () => {
    beforeEach(() => configure());

    it('clears editingIngredientId', () => {
      component.editingIngredientId = 5;
      component.cancelEdit();
      expect(component.editingIngredientId).toBeNull();
    });
  });

  describe('savePivot', () => {
    beforeEach(() => configure('3'));

    it('calls store.updateIngredientPivot', () => {
      component.recipeId = 3;
      component.editAmount = 5;
      component.editUnitId = 2;
      component.savePivot(9);
      expect(storeSpy.updateIngredientPivot).toHaveBeenCalledOnceWith(3, 9, 5, 2);
    });

    it('clears editingIngredientId on success', () => {
      component.recipeId = 3;
      component.editingIngredientId = 9;
      component.savePivot(9);
      expect(component.editingIngredientId).toBeNull();
    });

    it('does nothing when savingPivot is already true', () => {
      component.recipeId = 3;
      component.savingPivot = true;
      component.savePivot(9);
      expect(storeSpy.updateIngredientPivot).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // searchIngredients
  // ---------------------------------------------------------------------------

  describe('searchIngredients', () => {
    beforeEach(() => configure());

    it('calls ingredientsStore.search with the trimmed query', () => {
      component.addIngredientSearch = 'tomato';
      component.searchIngredients();
      expect(ingredientsStoreSpy.search).toHaveBeenCalledOnceWith('tomato');
    });

    it('does nothing when query is blank', () => {
      component.addIngredientSearch = '   ';
      component.searchIngredients();
      expect(ingredientsStoreSpy.search).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // onSubmit
  // ---------------------------------------------------------------------------

  describe('onSubmit', () => {
    describe('create mode', () => {
      beforeEach(() => configure());

      it('calls store.create with the form payload', () => {
        component.name = 'Pasta';
        component.portions = 2;
        component.onSubmit(makeForm(true));
        expect(storeSpy.create).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({ name: 'Pasta', portions: 2 })
        );
      });

      it('navigates to the edit route on success', () => {
        storeSpy.create.and.returnValue(of(makeRecipe({ id: 99 })));
        component.name = 'Pasta';
        component.onSubmit(makeForm(true));
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/admin/recipes', 99, 'edit']);
      });

      it('does nothing when form is invalid', () => {
        component.onSubmit(makeForm(false));
        expect(storeSpy.create).not.toHaveBeenCalled();
      });

      it('does nothing when saving is already true', () => {
        component.saving = true;
        component.onSubmit(makeForm(true));
        expect(storeSpy.create).not.toHaveBeenCalled();
      });

      it('resets saving on error', () => {
        storeSpy.create.and.returnValue(throwError(() => new Error('fail')));
        component.name = 'Pasta';
        component.onSubmit(makeForm(true));
        expect(component.saving).toBeFalse();
      });
    });

    describe('edit mode', () => {
      beforeEach(() => configure('5'));

      it('calls store.update when recipeId is set', () => {
        component.recipeId = 5;
        component.name = 'Updated Pasta';
        component.portions = 3;
        component.onSubmit(makeForm(true));
        expect(storeSpy.update).toHaveBeenCalledOnceWith(5, jasmine.objectContaining({ name: 'Updated Pasta' }));
      });
    });
  });

  // ---------------------------------------------------------------------------
  // onCancel
  // ---------------------------------------------------------------------------

  describe('onCancel', () => {
    beforeEach(() => configure());

    it('navigates to /admin/recipes', () => {
      component.onCancel();
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/admin/recipes']);
    });
  });
});
