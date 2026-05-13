import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SpinnerInterceptor } from './spinner.interceptor';
import { SpinnerService } from './spinner.service';

describe('SpinnerInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let spinnerService: SpinnerService;
  let loading: boolean;

  const url1 = 'http://test/api/one';
  const url2 = 'http://test/api/two';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        provideHttpClient(withInterceptors([SpinnerInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    spinnerService = TestBed.inject(SpinnerService);
    spinnerService.isLoading$.subscribe(v => (loading = v));
  });

  afterEach(() => httpMock.verify());

  it('shows the spinner as soon as a request is made', () => {
    http.get(url1).subscribe();
    expect(loading).toBeTrue();
    httpMock.expectOne(url1).flush({});
  });

  it('hides the spinner after a successful response', () => {
    http.get(url1).subscribe();
    httpMock.expectOne(url1).flush({});
    expect(loading).toBeFalse();
  });

  it('hides the spinner after an error response (finalize always runs)', () => {
    http.get(url1).subscribe({ error: () => {} });
    httpMock.expectOne(url1).flush(null, { status: 500, statusText: 'Server Error' });
    expect(loading).toBeFalse();
  });

  it('stays true while a second request is still in flight', () => {
    http.get(url1).subscribe();
    http.get(url2).subscribe();

    httpMock.expectOne(url1).flush({});
    expect(loading).toBeTrue();

    httpMock.expectOne(url2).flush({});
  });

  it('emits false once all concurrent requests have completed', () => {
    http.get(url1).subscribe();
    http.get(url2).subscribe();

    httpMock.expectOne(url1).flush({});
    httpMock.expectOne(url2).flush({});

    expect(loading).toBeFalse();
  });
});
