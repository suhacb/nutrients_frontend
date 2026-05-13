import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DietTagsListPage } from './diet-tags-list';
import { DietTagsStore } from '../../store/diet-tags.store';
import { DietTag } from '../../contracts/DietTag';

function makeTag(id = 1, name = 'Vegan'): DietTag {
  return { id, name, slug: name.toLowerCase(), description: null, createdAt: new Date(), updatedAt: new Date() };
}

describe('DietTagsListPage', () => {
  let fixture: ComponentFixture<DietTagsListPage>;
  let component: DietTagsListPage;
  let storeSpy: jasmine.SpyObj<DietTagsStore>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('DietTagsStore', ['index', 'delete'], {
      dietTags: jasmine.createSpy('dietTags').and.returnValue([]),
      total: jasmine.createSpy('total').and.returnValue(0),
    });
    storeSpy.index.and.returnValue(of(undefined as any));
    storeSpy.delete.and.returnValue(of(undefined as any));

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      declarations: [DietTagsListPage],
      providers: [
        { provide: DietTagsStore, useValue: storeSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(DietTagsListPage);
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
  // openCreate
  // ---------------------------------------------------------------------------

  describe('openCreate', () => {
    it('opens a dialog with empty data object', () => {
      dialogSpy.open.and.returnValue({ componentInstance: {} } as any);
      component.openCreate();
      expect(dialogSpy.open).toHaveBeenCalledOnceWith(
        jasmine.any(Function),
        jasmine.objectContaining({ data: {} })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // openEdit
  // ---------------------------------------------------------------------------

  describe('openEdit', () => {
    it('opens a dialog passing the selected diet tag', () => {
      const tag = makeTag(7, 'Keto');
      dialogSpy.open.and.returnValue({ componentInstance: {} } as any);
      component.openEdit(tag);
      expect(dialogSpy.open).toHaveBeenCalledOnceWith(
        jasmine.any(Function),
        jasmine.objectContaining({ data: { dietTag: tag } })
      );
    });
  });

  // ---------------------------------------------------------------------------
  // confirmDelete
  // ---------------------------------------------------------------------------

  describe('confirmDelete', () => {
    it('opens a confirmation dialog', () => {
      const tag = makeTag(3, 'Paleo');
      const fakeRef = { componentInstance: { confirm: of(), cancel: of() }, close: jasmine.createSpy() } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(tag);

      expect(dialogSpy.open).toHaveBeenCalledOnceWith(
        jasmine.any(Function),
        jasmine.objectContaining({ data: jasmine.objectContaining({ title: 'Delete diet tag' }) })
      );
    });

    it('calls store.delete when confirm fires', () => {
      const tag = makeTag(3, 'Paleo');
      const confirmSubject = of(undefined);
      const fakeRef = {
        componentInstance: { confirm: confirmSubject, cancel: of() },
        close: jasmine.createSpy(),
      } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(tag);

      expect(storeSpy.delete).toHaveBeenCalledOnceWith(3);
    });

    it('closes the dialog after delete completes', () => {
      const tag = makeTag(3, 'Paleo');
      const fakeRef = {
        componentInstance: { confirm: of(undefined), cancel: of() },
        close: jasmine.createSpy(),
      } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(tag);

      expect(fakeRef.close).toHaveBeenCalled();
    });

    it('closes the dialog when cancel fires', () => {
      const tag = makeTag(3, 'Paleo');
      const fakeRef = {
        componentInstance: { confirm: of(), cancel: of(undefined) },
        close: jasmine.createSpy(),
      } as any;
      dialogSpy.open.and.returnValue(fakeRef);

      component.confirmDelete(tag);

      expect(fakeRef.close).toHaveBeenCalled();
    });
  });
});
