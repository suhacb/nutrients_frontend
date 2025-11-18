import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelDialog } from './confirm-cancel-dialog';

describe('ConfirmCancelDialog', () => {
  let component: ConfirmCancelDialog;
  let fixture: ComponentFixture<ConfirmCancelDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmCancelDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
