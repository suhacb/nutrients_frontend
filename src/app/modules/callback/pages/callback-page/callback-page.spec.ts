import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { CallbackPage } from './callback-page';
import { AuthStore } from '../../../../core/Auth/store/auth.store';

describe('CallbackPage', () => {
  let component: CallbackPage;
  let storeSpy: jasmine.SpyObj<AuthStore>;
  let routerSpy: jasmine.SpyObj<Router>;

  function makeRoute(params: Record<string, string>) {
    return {
      snapshot: { queryParamMap: convertToParamMap(params) },
    };
  }

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('AuthStore', ['setToken']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const route = makeRoute({
      access_token: 'tok',
      token_type: 'Bearer',
      expires_in: '300',
      refresh_token: 'ref',
      refresh_expires_in: '1800',
      scope: 'openid',
      id_token: 'id',
      not_before_policy: '0',
      session_state: 'ss',
    });

    TestBed.configureTestingModule({
      declarations: [CallbackPage],
      providers: [
        { provide: AuthStore, useValue: storeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: route },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    component = TestBed.createComponent(CallbackPage).componentInstance;
  });

  // ---------------------------------------------------------------------------
  // getAccessTokenFromUri
  // ---------------------------------------------------------------------------

  describe('getAccessTokenFromUri', () => {
    it('maps all query params to the correct fields', () => {
      const params = convertToParamMap({
        access_token: 'a',
        token_type: 'Bearer',
        expires_in: '900',
        refresh_token: 'r',
        refresh_expires_in: '3600',
        scope: 'profile',
        id_token: 'i',
        not_before_policy: '1',
        session_state: 'x',
      });

      const result = component.getAccessTokenFromUri(params);

      expect(result.access_token).toBe('a');
      expect(result.token_type).toBe('Bearer');
      expect(result.expires_in).toBe(900);
      expect(result.refresh_token).toBe('r');
      expect(result.refresh_expires_in).toBe(3600);
      expect(result.scope).toBe('profile');
      expect(result.id_token).toBe('i');
      expect(result.not_before_policy).toBe('1');
      expect(result.session_state).toBe('x');
    });

    it('defaults numeric fields to 0 when absent', () => {
      const params = convertToParamMap({});
      const result = component.getAccessTokenFromUri(params);
      expect(result.expires_in).toBe(0);
      expect(result.refresh_expires_in).toBe(0);
    });

    it('defaults string fields to empty string when absent', () => {
      const params = convertToParamMap({});
      const result = component.getAccessTokenFromUri(params);
      expect(result.access_token).toBe('');
      expect(result.token_type).toBe('');
    });
  });

  // ---------------------------------------------------------------------------
  // ngOnInit
  // ---------------------------------------------------------------------------

  describe('ngOnInit', () => {
    it('calls store.setToken with params from the route', () => {
      component.ngOnInit();
      expect(storeSpy.setToken).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ access_token: 'tok', token_type: 'Bearer' })
      );
    });

    it('navigates to / after setting the token', () => {
      component.ngOnInit();
      expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['/']);
    });
  });
});
