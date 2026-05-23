import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { RecipesListPage } from './recipes-list';
import { RecipesStore } from '../../store/recipes.store';
import { Recipe } from '../../contracts/Recipe';

function makeRecipe(id = 1, name = 'Salad'): Recipe {
  return { id, name, slug: name.toLowerCase(), description: null, instructions: null, portions: 2, sourceUrl: null, syncStatus: 'synced', dietTags: [], ingredients: [] };
}

describe('RecipesListPage', () => {
  let fixture: ComponentFixture<RecipesListPage>;
  let component: RecipesListPage;
  let storeSpy: jasmine.SpyObj<RecipesStore>;
  let routerSpy: jasmine.SpyObj<Router>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('RecipesStore', ['index', 'delete'], {
      recipes: jasmine.createSpy('recipes').and.returnValue([]),
      paginator: jasmine.createSpy('paginator').and.returnValue(null),
    });
    storeSpy.index.and.stub();
    storeSpy.delete.and.returnValue(of(undefined as any));

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [RecipesListPage],
      providers: [
        { provide: RecipesStore, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(RecipesListPage);
    component = fixture.componentInstance;
  });

  // ---------------------------------------------------------------------------
  // ngOnInit
  // ---------------------------------------------------------------------------

  describe('ngOnInit', () => {
    it('calls store.index() on init', () => {
      fixture.detectChanges();
      expect(storeSpy.index).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // openEdit
  // ---------------------------------------------------------------------------

  describe('openEdit', () => {
    it('navigates to the recipe edit route', () => {
      component.openEdit(makeRecipe(5));
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/admin/recipes', 5, 'edit']);
    });
  });

  // ---------------------------------------------------------------------------
  // confirmDelete
  // ---------------------------------------------------------------------------

  describe('confirmDelete', () => {
    it('opens a confirmation dialog', () => {
      const recipe = makeRecipe(3, 'Soup');
      const fakeRef = { componentInstance: { confirm: of(), cancel: of() }, close: jasmine.createSpy() } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(recipe);

      expect(dialogSpy.open).toHaveBeenCalledOnceWith(
        jasmine.any(Function),
        jasmine.objectContaining({ data: jasmine.objectContaining({ title: 'Delete recipe' }) })
      );
    });

    it('calls store.delete when confirm fires', () => {
      const recipe = makeRecipe(3, 'Soup');
      const fakeRef = {
        componentInstance: { confirm: of(undefined), cancel: of() },
        close: jasmine.createSpy(),
      } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(recipe);

      expect(storeSpy.delete).toHaveBeenCalledOnceWith(3);
    });

    it('closes the dialog after delete completes', () => {
      const recipe = makeRecipe(3, 'Soup');
      const fakeRef = {
        componentInstance: { confirm: of(undefined), cancel: of() },
        close: jasmine.createSpy(),
      } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(recipe);

      expect(fakeRef.close).toHaveBeenCalled();
    });

    it('closes the dialog when cancel fires', () => {
      const recipe = makeRecipe(3, 'Soup');
      const fakeRef = {
        componentInstance: { confirm: of(), cancel: of(undefined) },
        close: jasmine.createSpy(),
      } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(recipe);

      expect(fakeRef.close).toHaveBeenCalled();
    });
  });
});
