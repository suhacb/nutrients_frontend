import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { appHeadersInterceptor } from './headers.interceptor';
import { AuthStore } from '../store/auth.store';
import { APP_CONFIG } from '../../../config/app-config';

describe('appHeadersInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let storeSpy: jasmine.SpyObj<AuthStore>;

  const testUrl = 'http://test/api/resource';

  const appConfig = {
    appNameHeader: 'nutrients-app',
    appBaseUrl: 'http://localhost:9010',
    appName: 'Nutrients',
    appTitle: 'The Nutritionist',
    appBackendUrl: 'http://localhost:9015',
    e2e: false,
  };

  function configureStore(opts: {
    accessToken?: string | null;
    refreshToken?: string | null;
    externalAppName?: string | null;
    externalAppUrl?: string | null;
  } = {}) {
    storeSpy.accessToken.and.returnValue((opts.accessToken ?? null) as any);
    storeSpy.refreshToken.and.returnValue((opts.refreshToken ?? null) as any);
    storeSpy.externalAppName.and.returnValue((opts.externalAppName ?? null) as any);
    storeSpy.externalAppUrl.and.returnValue((opts.externalAppUrl ?? null) as any);
  }

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('AuthStore', {
      accessToken: null,
      refreshToken: null,
      externalAppName: null,
      externalAppUrl: null,
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([appHeadersInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: storeSpy },
        { provide: APP_CONFIG, useValue: appConfig },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // ---------------------------------------------------------------------------
  // Authorization header
  // ---------------------------------------------------------------------------

  describe('Authorization header', () => {
    it('is set to "Bearer <token>" when the store has an access token', () => {
      configureStore({ accessToken: 'my-access-token' });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('Authorization')).toBe('Bearer my-access-token');
      req.flush({});
    });

    it('is absent when the store has no access token', () => {
      configureStore({ accessToken: null });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.has('Authorization')).toBeFalse();
      req.flush({});
    });
  });

  // ---------------------------------------------------------------------------
  // X-Refresh-Token header
  // ---------------------------------------------------------------------------

  describe('X-Refresh-Token header', () => {
    it('is set when the store has a refresh token', () => {
      configureStore({ refreshToken: 'my-refresh-token' });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('X-Refresh-Token')).toBe('my-refresh-token');
      req.flush({});
    });

    it('is absent when the store has no refresh token', () => {
      configureStore({ refreshToken: null });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.has('X-Refresh-Token')).toBeFalse();
      req.flush({});
    });
  });

  // ---------------------------------------------------------------------------
  // X-Application-Name header
  // ---------------------------------------------------------------------------

  describe('X-Application-Name header', () => {
    it('uses the config appNameHeader when no externalAppName is set', () => {
      configureStore({ externalAppName: null });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('X-Application-Name')).toBe('nutrients-app');
      req.flush({});
    });

    it('overrides the config value with externalAppName when set', () => {
      configureStore({ externalAppName: 'external-app' });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('X-Application-Name')).toBe('external-app');
      req.flush({});
    });
  });

  // ---------------------------------------------------------------------------
  // X-Client-Url header
  // ---------------------------------------------------------------------------

  describe('X-Client-Url header', () => {
    it('uses the config appBaseUrl when no externalAppUrl is set', () => {
      configureStore({ externalAppUrl: null });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('X-Client-Url')).toBe('http://localhost:9010');
      req.flush({});
    });

    it('overrides the config value with externalAppUrl when set', () => {
      configureStore({ externalAppUrl: 'http://external.example.com' });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('X-Client-Url')).toBe('http://external.example.com');
      req.flush({});
    });
  });

  // ---------------------------------------------------------------------------
  // X-Test-Mode header
  // ---------------------------------------------------------------------------

  describe('X-Test-Mode header', () => {
    it('is absent when e2e is false', () => {
      configureStore();
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.has('X-Test-Mode')).toBeFalse();
      req.flush({});
    });
  });

  // ---------------------------------------------------------------------------
  // All headers together
  // ---------------------------------------------------------------------------

  describe('fully authenticated request', () => {
    it('sets all four headers when the store is fully populated', () => {
      configureStore({
        accessToken: 'access-123',
        refreshToken: 'refresh-456',
        externalAppName: null,
        externalAppUrl: null,
      });
      http.get(testUrl).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.headers.get('Authorization')).toBe('Bearer access-123');
      expect(req.request.headers.get('X-Refresh-Token')).toBe('refresh-456');
      expect(req.request.headers.get('X-Application-Name')).toBe('nutrients-app');
      expect(req.request.headers.get('X-Client-Url')).toBe('http://localhost:9010');
      req.flush({});
    });
  });
});

describe('appHeadersInterceptor in e2e mode', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let storeSpy: jasmine.SpyObj<AuthStore>;

  const testUrl = 'http://test/api/resource';

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj('AuthStore', {
      accessToken: null,
      refreshToken: null,
      externalAppName: null,
      externalAppUrl: null,
    });

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([appHeadersInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: storeSpy },
        { provide: APP_CONFIG, useValue: { appNameHeader: 'nutrients-app', appBaseUrl: 'http://localhost:9010', appName: 'Nutrients', appTitle: 'The Nutritionist', appBackendUrl: 'http://localhost:9015', e2e: true } },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('adds X-Test-Mode: true to every request', () => {
    http.get(testUrl).subscribe();

    const req = httpMock.expectOne(testUrl);
    expect(req.request.headers.get('X-Test-Mode')).toBe('true');
    req.flush({});
  });
});
