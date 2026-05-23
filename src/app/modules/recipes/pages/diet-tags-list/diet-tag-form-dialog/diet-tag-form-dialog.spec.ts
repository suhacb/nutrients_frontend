import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { DietTagFormDialog } from './diet-tag-form-dialog';
import { DietTagsStore } from '../../../store/diet-tags.store';
import { DietTag } from '../../../contracts/DietTag';

function makeTag(overrides: Partial<DietTag> = {}): DietTag {
  return {
    id: 1,
    name: 'Vegan',
    slug: 'vegan',
    description: 'Plant-based',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

function makeForm(valid: boolean): NgForm {
  return { invalid: !valid } as NgForm;
}

describe('DietTagFormDialog', () => {
  let fixture: ComponentFixture<DietTagFormDialog>;
  let component: DietTagFormDialog;
  let storeSpy: jasmine.SpyObj<DietTagsStore>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DietTagFormDialog>>;

  function configure(dietTag?: DietTag) {
    storeSpy = jasmine.createSpyObj('DietTagsStore', ['create', 'update']);
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    storeSpy.create.and.returnValue(of(makeTag()));
    storeSpy.update.and.returnValue(of(makeTag()));

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [DietTagFormDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { dietTag } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: DietTagsStore, useValue: storeSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(DietTagFormDialog);
    component = fixture.componentInstance;
  }

  afterEach(() => TestBed.resetTestingModule());

  // ---------------------------------------------------------------------------
  // Create mode
  // ---------------------------------------------------------------------------

  describe('in create mode (no dietTag)', () => {
    beforeEach(() => configure());

    it('isEdit is false', () => {
      expect(component.isEdit).toBeFalse();
    });

    it('name and description start empty', () => {
      component.ngOnInit();
      expect(component.name).toBe('');
      expect(component.description).toBe('');
    });

    it('onSubmit calls store.create with the current payload', () => {
      component.ngOnInit();
      component.name = 'Keto';
      component.description = 'High fat';
      component.onSubmit(makeForm(true));
      expect(storeSpy.create).toHaveBeenCalledOnceWith({ name: 'Keto', description: 'High fat' });
    });

    it('onSubmit closes the dialog with the returned tag', () => {
      const tag = makeTag({ name: 'Keto' });
      storeSpy.create.and.returnValue(of(tag));
      component.ngOnInit();
      component.name = 'Keto';
      component.onSubmit(makeForm(true));
      expect(dialogRefSpy.close).toHaveBeenCalledOnceWith(tag);
    });

    it('onSubmit passes null description when field is empty', () => {
      component.ngOnInit();
      component.name = 'Paleo';
      component.description = '';
      component.onSubmit(makeForm(true));
      expect(storeSpy.create).toHaveBeenCalledOnceWith({ name: 'Paleo', description: null });
    });
  });

  // ---------------------------------------------------------------------------
  // Edit mode
  // ---------------------------------------------------------------------------

  describe('in edit mode (dietTag provided)', () => {
    const tag = makeTag({ id: 42, name: 'Vegan', description: 'Plant-based' });

    beforeEach(() => configure(tag));

    it('isEdit is true', () => {
      expect(component.isEdit).toBeTrue();
    });

    it('ngOnInit populates name and description from the tag', () => {
      component.ngOnInit();
      expect(component.name).toBe('Vegan');
      expect(component.description).toBe('Plant-based');
    });

    it('ngOnInit sets description to empty string when tag.description is null', () => {
      component.data.dietTag = makeTag({ description: null });
      component.ngOnInit();
      expect(component.description).toBe('');
    });

    it('onSubmit calls store.update with the tag id and payload', () => {
      component.ngOnInit();
      component.name = 'Vegan Updated';
      component.onSubmit(makeForm(true));
      expect(storeSpy.update).toHaveBeenCalledOnceWith(42, jasmine.objectContaining({ name: 'Vegan Updated' }));
    });
  });

  // ---------------------------------------------------------------------------
  // Guard conditions
  // ---------------------------------------------------------------------------

  describe('onSubmit guard conditions', () => {
    beforeEach(() => configure());

    it('does nothing when the form is invalid', () => {
      component.onSubmit(makeForm(false));
      expect(storeSpy.create).not.toHaveBeenCalled();
    });

    it('does nothing when saving is already true', () => {
      component.saving = true;
      component.onSubmit(makeForm(true));
      expect(storeSpy.create).not.toHaveBeenCalled();
    });

    it('resets saving to false on error', () => {
      storeSpy.create.and.returnValue(throwError(() => new Error('fail')));
      component.onSubmit(makeForm(true));
      expect(component.saving).toBeFalse();
    });
  });

  // ---------------------------------------------------------------------------
  // onCancel
  // ---------------------------------------------------------------------------

  describe('onCancel', () => {
    beforeEach(() => configure());

    it('calls dialogRef.close() with no argument', () => {
      component.onCancel();
      expect(dialogRefSpy.close).toHaveBeenCalledOnceWith();
    });
  });
});
