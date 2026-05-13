import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { GuestGuard } from './guest-guard';
import { AuthStore } from '../Auth/store/auth.store';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let storeSpy: jasmine.SpyObj<AuthStore>;
  let routerSpy: jasmine.SpyObj<Router>;
  let homeTree: UrlTree;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    homeTree = { toString: () => '/' } as UrlTree;

    storeSpy = jasmine.createSpyObj('AuthStore', {
      resetToken: undefined,
      setToken: undefined,
      accessToken: null,
    });

    routerSpy = jasmine.createSpyObj('Router', ['parseUrl']);
    routerSpy.parseUrl.and.returnValue(homeTree);

    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: AuthStore, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(GuestGuard);
  });

  afterEach(() => localStorage.clear());

  // ---------------------------------------------------------------------------
  // No token in localStorage — guest is allowed through
  // ---------------------------------------------------------------------------

  describe('when localStorage has no accessToken', () => {
    it('returns true', () => {
      expect(guard.canActivate(mockRoute, mockState)).toBeTrue();
    });

    it('calls resetToken to clear any stale store state', () => {
      guard.canActivate(mockRoute, mockState);
      expect(storeSpy.resetToken).toHaveBeenCalled();
    });

    it('does not redirect to /', () => {
      guard.canActivate(mockRoute, mockState);
      expect(routerSpy.parseUrl).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Token in localStorage and store is already populated
  // ---------------------------------------------------------------------------

  describe('when localStorage has a token and the store signal already has a value', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'existing-token');
      storeSpy.accessToken.and.returnValue('existing-token' as any);
    });

    it('returns a UrlTree to /', () => {
      expect(guard.canActivate(mockRoute, mockState)).toBe(homeTree);
    });

    it('does not call setToken (store is already populated)', () => {
      guard.canActivate(mockRoute, mockState);
      expect(storeSpy.setToken).not.toHaveBeenCalled();
    });

    it('does not call resetToken', () => {
      guard.canActivate(mockRoute, mockState);
      expect(storeSpy.resetToken).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Token in localStorage but store is empty (cold start / hard reload)
  // ---------------------------------------------------------------------------

  describe('when localStorage has a token but the store signal is null', () => {
    beforeEach(() => {
      localStorage.setItem('accessToken', 'cold-start-token');
      localStorage.setItem('refreshToken', 'cold-refresh');
      localStorage.setItem('tokenType', 'Bearer');
      storeSpy.accessToken.and.returnValue(null as any);
    });

    it('returns a UrlTree to /', () => {
      expect(guard.canActivate(mockRoute, mockState)).toBe(homeTree);
    });

    it('calls setToken to rehydrate the store from localStorage', () => {
      guard.canActivate(mockRoute, mockState);

      expect(storeSpy.setToken).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          access_token: 'cold-start-token',
          refresh_token: 'cold-refresh',
          token_type: 'Bearer',
        })
      );
    });

    it('does not call resetToken', () => {
      guard.canActivate(mockRoute, mockState);
      expect(storeSpy.resetToken).not.toHaveBeenCalled();
    });
  });
});
