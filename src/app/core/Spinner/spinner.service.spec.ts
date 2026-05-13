import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;
  let loading: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SpinnerService] });
    service = TestBed.inject(SpinnerService);
    service.isLoading$.subscribe(v => (loading = v));
  });

  it('isLoading$ starts as false', () => {
    expect(loading).toBeFalse();
  });

  describe('show', () => {
    it('emits true', () => {
      service.show();
      expect(loading).toBeTrue();
    });
  });

  describe('hide', () => {
    it('emits false after a matching show/hide pair', () => {
      service.show();
      service.hide();
      expect(loading).toBeFalse();
    });

    it('does not go below zero — extra hide calls are safe', () => {
      service.hide();
      service.hide();
      expect(loading).toBeFalse();
    });
  });

  describe('multiple concurrent requests', () => {
    it('stays true while the second request is still in flight', () => {
      service.show();
      service.show();
      service.hide();
      expect(loading).toBeTrue();
    });

    it('emits false once all requests complete', () => {
      service.show();
      service.show();
      service.hide();
      service.hide();
      expect(loading).toBeFalse();
    });
  });
});
