import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmCancelDialog } from './confirm-cancel-dialog';

describe('ConfirmCancelDialog', () => {
  let fixture: ComponentFixture<ConfirmCancelDialog>;
  let component: ConfirmCancelDialog;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmCancelDialog>>;

  const dialogData = { title: 'Confirm', content: 'Are you sure?', confirmLabel: 'Yes' };

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      declarations: [ConfirmCancelDialog],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ConfirmCancelDialog);
    component = fixture.componentInstance;
  });

  // ---------------------------------------------------------------------------
  // data binding
  // ---------------------------------------------------------------------------

  it('exposes injected data on the component', () => {
    expect(component.data.title).toBe('Confirm');
    expect(component.data.content).toBe('Are you sure?');
    expect(component.data.confirmLabel).toBe('Yes');
  });

  // ---------------------------------------------------------------------------
  // onCancelClick
  // ---------------------------------------------------------------------------

  describe('onCancelClick', () => {
    it('emits the cancel output', () => {
      let emitted = false;
      component.cancel.subscribe(() => (emitted = true));
      component.onCancelClick();
      expect(emitted).toBeTrue();
    });
  });

  // ---------------------------------------------------------------------------
  // onConfirmClick
  // ---------------------------------------------------------------------------

  describe('onConfirmClick', () => {
    it('emits the confirm output', () => {
      let emitted = false;
      component.confirm.subscribe(() => (emitted = true));
      component.onConfirmClick();
      expect(emitted).toBeTrue();
    });
  });
});
