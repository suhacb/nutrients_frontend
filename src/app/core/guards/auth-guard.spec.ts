import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthGuard } from './auth-guard';
import { AuthStore } from '../Auth/store/auth.store';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let storeSpy: jasmine.SpyObj<AuthStore>;
  let routerSpy: jasmine.SpyObj<Router>;
  let welcomeTree: UrlTree;

  beforeEach(() => {
    welcomeTree = { toString: () => '/welcome' } as UrlTree;

    storeSpy = jasmine.createSpyObj('AuthStore', {
      setStoreValue: undefined,
      resetToken: undefined,
      validateAccessToken: of(true),
      accessToken: null,
    });

    routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);
    routerSpy.parseUrl.and.returnValue(welcomeTree);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthStore, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => localStorage.clear());

  // ---------------------------------------------------------------------------
  // No token in localStorage
  // ---------------------------------------------------------------------------

  describe('when localStorage has no accessToken', () => {
    it('returns a UrlTree to /welcome', () => {
      const result = guard.canActivate();
      expect(result).toBe(welcomeTree);
    });

    it('calls resetToken', () => {
      guard.canActivate();
      expect(storeSpy.resetToken).toHaveBeenCalled();
    });

    it('does not call validateAccessToken', () => {
      guard.canActivate();
      expect(storeSpy.validateAccessToken).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // localStorage has token but store is empty
  // ---------------------------------------------------------------------------

  describe('when localStorage has a token but the store signal is null', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'my-token');
      storeSpy.accessToken.and.returnValue(null as any);
    });

    it('returns a UrlTree to /welcome', () => {
      const result = guard.canActivate();
      expect(result).toBe(welcomeTree);
    });

    it('calls resetToken', () => {
      guard.canActivate();
      expect(storeSpy.resetToken).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Tokens present but mismatched
  // ---------------------------------------------------------------------------

  describe('when localStorage token and store token do not match', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'local-token');
      storeSpy.accessToken.and.returnValue('different-token' as any);
    });

    it('returns a UrlTree to /welcome', () => {
      const result = guard.canActivate();
      expect(result).toBe(welcomeTree);
    });

    it('calls resetToken', () => {
      guard.canActivate();
      expect(storeSpy.resetToken).toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Tokens match — delegates to validateAccessToken
  // ---------------------------------------------------------------------------

  describe('when tokens match and validateAccessToken emits true', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'valid-token');
      storeSpy.accessToken.and.returnValue('valid-token' as any);
      storeSpy.validateAccessToken.and.returnValue(of(true));
    });

    it('returns an observable that emits true', (done) => {
      const result = guard.canActivate() as Observable<boolean | UrlTree>;
      result.subscribe(value => {
        expect(value).toBeTrue();
        done();
      });
    });

    it('does not call resetToken', (done) => {
      const result = guard.canActivate() as Observable<boolean | UrlTree>;
      result.subscribe(() => {
        expect(storeSpy.resetToken).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('when tokens match and validateAccessToken emits false', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'valid-token');
      storeSpy.accessToken.and.returnValue('valid-token' as any);
      storeSpy.validateAccessToken.and.returnValue(of(false));
    });

    it('returns an observable that emits a UrlTree to /welcome', (done) => {
      const result = guard.canActivate() as Observable<boolean | UrlTree>;
      result.subscribe(value => {
        expect(value).toBe(welcomeTree);
        done();
      });
    });
  });

  describe('when tokens match and validateAccessToken throws', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'valid-token');
      storeSpy.accessToken.and.returnValue('valid-token' as any);
      storeSpy.validateAccessToken.and.returnValue(throwError(() => new Error('network error')));
    });

    it('returns an observable that emits a UrlTree to /welcome without re-throwing', (done) => {
      spyOn(console, 'error'); // AuthGuard logs the caught error before swallowing it
      const result = guard.canActivate() as Observable<boolean | UrlTree>;
      result.subscribe({
        next: value => {
          expect(value).toBe(welcomeTree);
          done();
        },
        error: () => fail('should not throw'),
      });
    });
  });

  // ---------------------------------------------------------------------------
  // setStoreValue is called to rehydrate the store
  // ---------------------------------------------------------------------------

  describe('store rehydration', () => {
    it('calls setStoreValue for each token key with localStorage values', () => {
      localStorage.setItem('accessToken', 'my-token');
      localStorage.setItem('refreshToken', 'my-refresh');
      storeSpy.accessToken.and.returnValue(null as any);

      guard.canActivate();

      expect(storeSpy.setStoreValue).toHaveBeenCalledWith('accessToken', 'my-token');
      expect(storeSpy.setStoreValue).toHaveBeenCalledWith('refreshToken', 'my-refresh');
    });
  });
});
