import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthStore } from './auth.store';
import { ApiHandlerService } from '../../ApiHandlerService/api-handler-service';
import { AccessTokenApiResource } from '../../AccessToken/AccessToken';

function makeJwt(payload: object): string {
  const encoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `header.${encoded}.sig`;
}

describe('AuthStore', () => {
  let store: AuthStore;
  let httpMock: HttpTestingController;

  const validateUrl = 'http://localhost:9015/api/auth/validate-access-token';
  const logoutUrl = 'http://localhost:9015/api/auth/logout';

  const tokenResource: AccessTokenApiResource = {
    access_token: 'access-token-123',
    token_type: 'Bearer',
    expires_in: 300,
    refresh_token: 'refresh-token-456',
    refresh_expires_in: 1800,
    scope: 'openid profile email',
    id_token: 'id-token-789',
    not_before_policy: '0',
    session_state: 'session-abc',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiHandlerService, useValue: jasmine.createSpyObj('ApiHandlerService', ['showSuccess', 'showError']) },
      ],
    });
    store = TestBed.inject(AuthStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
  });

  // ---------------------------------------------------------------------------
  // Initial state
  // ---------------------------------------------------------------------------

  describe('initial state', () => {
    it('all token signals are null', () => {
      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
      expect(store.tokenType()).toBeNull();
      expect(store.idToken()).toBeNull();
      expect(store.sessionState()).toBeNull();
    });

    it('isLoggedIn is false', () => {
      expect(store.isLoggedIn()).toBeFalse();
    });

    it('user is null', () => {
      expect(store.user()).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // setToken
  // ---------------------------------------------------------------------------

  describe('setToken', () => {
    it('sets all signal fields from the API resource', () => {
      store.setToken(tokenResource);

      expect(store.accessToken()).toBe('access-token-123');
      expect(store.refreshToken()).toBe('refresh-token-456');
      expect(store.tokenType()).toBe('Bearer');
      expect(store.idToken()).toBe('id-token-789');
      expect(store.sessionState()).toBe('session-abc');
    });

    it('sets isLoggedIn to true', () => {
      store.setToken(tokenResource);
      expect(store.isLoggedIn()).toBeTrue();
    });

    it('persists token values to localStorage', () => {
      store.setToken(tokenResource);

      expect(localStorage.getItem('accessToken')).toBe('access-token-123');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token-456');
      expect(localStorage.getItem('tokenType')).toBe('Bearer');
    });
  });

  // ---------------------------------------------------------------------------
  // resetToken
  // ---------------------------------------------------------------------------

  describe('resetToken', () => {
    beforeEach(() => store.setToken(tokenResource));

    it('clears all token signals to null', () => {
      store.resetToken();

      expect(store.accessToken()).toBeNull();
      expect(store.refreshToken()).toBeNull();
      expect(store.isLoggedIn()).toBeFalse();
    });

    it('removes token keys from localStorage', () => {
      store.resetToken();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // user computed signal
  // ---------------------------------------------------------------------------

  describe('user computed signal', () => {
    it('decodes all user fields from a valid JWT payload', () => {
      const payload = {
        preferred_username: 'jdoe',
        given_name: 'John',
        family_name: 'Doe',
        email: 'jdoe@example.com',
      };
      store.setToken({ ...tokenResource, access_token: makeJwt(payload) });

      const user = store.user();
      expect(user?.username).toBe('jdoe');
      expect(user?.name).toBe('John');
      expect(user?.familyName).toBe('Doe');
      expect(user?.email).toBe('jdoe@example.com');
    });

    it('returns null when the token payload is not valid JSON', () => {
      spyOn(console, 'error'); // decodeJwt logs the parse error; suppress it in tests
      // 'dGVzdA' decodes to 'test' which is not valid JSON → decodeJwt returns null
      store.setToken({ ...tokenResource, access_token: 'header.dGVzdA.sig' });
      expect(store.user()).toBeNull();
    });

    it('returns null when accessToken is null', () => {
      expect(store.user()).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // setStoreValue
  // ---------------------------------------------------------------------------

  describe('setStoreValue', () => {
    it('sets a named signal by key', () => {
      store.setStoreValue('accessToken', 'injected-token');
      expect(store.accessToken()).toBe('injected-token');
    });
  });

  // ---------------------------------------------------------------------------
  // setExternalAppName / setExternalAppUrl
  // ---------------------------------------------------------------------------

  describe('setExternalAppName and setExternalAppUrl', () => {
    it('sets the external app name', () => {
      store.setExternalAppName('my-app');
      expect(store.externalAppName()).toBe('my-app');
    });

    it('sets the external app url', () => {
      store.setExternalAppUrl('http://my-app.example.com');
      expect(store.externalAppUrl()).toBe('http://my-app.example.com');
    });
  });

  // ---------------------------------------------------------------------------
  // validateAccessToken
  // ---------------------------------------------------------------------------

  describe('validateAccessToken', () => {
    it('emits true and updates the store when the response is a new token object', (done) => {
      const refreshed = { ...tokenResource, access_token: 'new-access-token' };

      store.validateAccessToken().subscribe(result => {
        expect(result).toBeTrue();
        expect(store.accessToken()).toBe('new-access-token');
        done();
      });

      httpMock.expectOne(validateUrl).flush(refreshed);
    });

    it('emits true and leaves the store unchanged when the response is the string "true"', (done) => {
      store.setToken(tokenResource);

      store.validateAccessToken().subscribe(result => {
        expect(result).toBeTrue();
        expect(store.accessToken()).toBe('access-token-123');
        done();
      });

      httpMock.expectOne(validateUrl).flush('true');
    });

    it('emits false when the response is the string "false"', (done) => {
      store.validateAccessToken().subscribe(result => {
        expect(result).toBeFalse();
        done();
      });

      httpMock.expectOne(validateUrl).flush('false');
    });

    it('emits false and resets the token on HTTP error', (done) => {
      store.setToken(tokenResource);

      store.validateAccessToken().subscribe(result => {
        expect(result).toBeFalse();
        expect(store.accessToken()).toBeNull();
        done();
      });

      httpMock.expectOne(validateUrl).flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });

  // ---------------------------------------------------------------------------
  // logout
  // ---------------------------------------------------------------------------

  describe('logout', () => {
    beforeEach(() => store.setToken(tokenResource));

    it('emits true on success', (done) => {
      store.logout().subscribe(result => {
        expect(result).toBeTrue();
        done();
      });

      httpMock.expectOne(logoutUrl).flush(true);
    });

    it('resets the token on success', (done) => {
      store.logout().subscribe(() => {
        expect(store.accessToken()).toBeNull();
        expect(store.isLoggedIn()).toBeFalse();
        done();
      });

      httpMock.expectOne(logoutUrl).flush(true);
    });

    it('calls showSuccess on success', (done) => {
      const apiHandler = TestBed.inject(ApiHandlerService) as jasmine.SpyObj<ApiHandlerService>;

      store.logout().subscribe(() => {
        expect(apiHandler.showSuccess).toHaveBeenCalled();
        done();
      });

      httpMock.expectOne(logoutUrl).flush(true);
    });
  });
});
