import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiFetcherService } from './ApiFetcherService';
import { ApiHandlerService } from '../ApiHandlerService/api-handler-service';

describe('ApiFetcherService', () => {
  let service: ApiFetcherService;
  let httpMock: HttpTestingController;
  let apiHandlerSpy: { showSuccess: jasmine.Spy; showError: jasmine.Spy };

  const testUrl = 'http://localhost:9015/api/test';

  beforeEach(() => {
    apiHandlerSpy = jasmine.createSpyObj('ApiHandlerService', ['showSuccess', 'showError']);

    TestBed.configureTestingModule({
      providers: [
        ApiFetcherService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApiHandlerService, useValue: apiHandlerSpy },
      ],
    });

    service = TestBed.inject(ApiFetcherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ---------------------------------------------------------------------------
  // fetchAndProcess
  // ---------------------------------------------------------------------------

  describe('fetchAndProcess', () => {
    it('issues a GET request to the provided URL', () => {
      service.fetchAndProcess(testUrl, 'Loaded.', () => {}).subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('GET');
      req.flush({ id: 1 });
    });

    it('calls the process callback with the response body', () => {
      const processSpy = jasmine.createSpy('process');

      service.fetchAndProcess<{ id: number }>(testUrl, 'Loaded.', processSpy).subscribe();
      httpMock.expectOne(testUrl).flush({ id: 42 });

      expect(processSpy).toHaveBeenCalledOnceWith({ id: 42 });
    });

    it('calls showSuccess with the provided message', () => {
      service.fetchAndProcess(testUrl, 'Data loaded.', () => {}).subscribe();
      httpMock.expectOne(testUrl).flush({});

      expect(apiHandlerSpy.showSuccess).toHaveBeenCalledOnceWith('Data loaded.');
    });

    it('calls showError and completes silently on a non-401/422 error', (done) => {
      let emitted = false;

      service.fetchAndProcess(testUrl, 'Loaded.', () => {}).subscribe({
        next: () => { emitted = true; },
        error: () => fail('should not error'),
        complete: () => {
          expect(emitted).toBeFalse();
          expect(apiHandlerSpy.showError).toHaveBeenCalled();
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 500, statusText: 'Server Error' });
    });

    it('re-throws on a 401 error', (done) => {
      service.fetchAndProcess(testUrl, 'Loaded.', () => {}).subscribe({
        next: () => fail('should not emit'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          expect(apiHandlerSpy.showError).toHaveBeenCalled();
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 401, statusText: 'Unauthorized' });
    });

    it('re-throws on a 422 error', (done) => {
      service.fetchAndProcess(testUrl, 'Loaded.', () => {}).subscribe({
        next: () => fail('should not emit'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(422);
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  // ---------------------------------------------------------------------------
  // postAndProcess
  // ---------------------------------------------------------------------------

  describe('postAndProcess', () => {
    it('issues a POST request with the provided payload', () => {
      service.postAndProcess(testUrl, { name: 'Test' }, 'Created.').subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ name: 'Test' });
      req.flush({ id: 1 });
    });

    it('emits the raw response body when no process function is provided', (done) => {
      service.postAndProcess<unknown, { id: number }>(testUrl, {}, 'Created.').subscribe(result => {
        expect(result).toEqual({ id: 7 });
        done();
      });

      httpMock.expectOne(testUrl).flush({ id: 7 });
    });

    it('emits the transformed body when a process function is provided', (done) => {
      const transform = (body: { id: number }) => ({ ...body, id: body.id * 10 });

      service.postAndProcess<unknown, { id: number }>(testUrl, {}, 'Created.', transform).subscribe(result => {
        expect(result).toEqual({ id: 70 });
        done();
      });

      httpMock.expectOne(testUrl).flush({ id: 7 });
    });

    it('calls showSuccess with the provided message', () => {
      service.postAndProcess(testUrl, {}, 'Record created.').subscribe();
      httpMock.expectOne(testUrl).flush({});

      expect(apiHandlerSpy.showSuccess).toHaveBeenCalledOnceWith('Record created.');
    });

    it('calls showError and completes silently on a non-401/422 error', (done) => {
      let emitted = false;

      service.postAndProcess(testUrl, {}, 'Created.').subscribe({
        next: () => { emitted = true; },
        error: () => fail('should not error'),
        complete: () => {
          expect(emitted).toBeFalse();
          expect(apiHandlerSpy.showError).toHaveBeenCalled();
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 500, statusText: 'Server Error' });
    });

    it('re-throws on a 401 error', (done) => {
      service.postAndProcess(testUrl, {}, 'Created.').subscribe({
        next: () => fail('should not emit'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 401, statusText: 'Unauthorized' });
    });

    it('re-throws on a 422 error', (done) => {
      service.postAndProcess(testUrl, {}, 'Created.').subscribe({
        next: () => fail('should not emit'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(422);
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 422, statusText: 'Unprocessable Entity' });
    });
  });

  // ---------------------------------------------------------------------------
  // putAndProcess
  // ---------------------------------------------------------------------------

  describe('putAndProcess', () => {
    it('issues a PUT request with the provided payload', () => {
      service.putAndProcess(testUrl, { name: 'Updated' }, 'Updated.').subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ name: 'Updated' });
      req.flush({ id: 1 });
    });

    it('emits the raw response body when no process function is provided', (done) => {
      service.putAndProcess<unknown, { id: number }>(testUrl, {}, 'Updated.').subscribe(result => {
        expect(result).toEqual({ id: 5 });
        done();
      });

      httpMock.expectOne(testUrl).flush({ id: 5 });
    });

    it('emits the transformed body when a process function is provided', (done) => {
      const transform = (body: { id: number }) => ({ ...body, id: body.id + 100 });

      service.putAndProcess<unknown, { id: number }>(testUrl, {}, 'Updated.', transform).subscribe(result => {
        expect(result).toEqual({ id: 105 });
        done();
      });

      httpMock.expectOne(testUrl).flush({ id: 5 });
    });

    it('calls showError and completes silently on a non-401/422 error', (done) => {
      let emitted = false;

      service.putAndProcess(testUrl, {}, 'Updated.').subscribe({
        next: () => { emitted = true; },
        error: () => fail('should not error'),
        complete: () => {
          expect(emitted).toBeFalse();
          expect(apiHandlerSpy.showError).toHaveBeenCalled();
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 500, statusText: 'Server Error' });
    });
  });

  // ---------------------------------------------------------------------------
  // deleteAndProcess
  // ---------------------------------------------------------------------------

  describe('deleteAndProcess', () => {
    it('issues a DELETE request', () => {
      service.deleteAndProcess(testUrl, 'Deleted.').subscribe();

      const req = httpMock.expectOne(testUrl);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('emits void on success', (done) => {
      service.deleteAndProcess(testUrl, 'Deleted.').subscribe(result => {
        expect(result).toBeUndefined();
        done();
      });

      httpMock.expectOne(testUrl).flush(null);
    });

    it('calls showSuccess with the provided message', () => {
      service.deleteAndProcess(testUrl, 'Record deleted.').subscribe();
      httpMock.expectOne(testUrl).flush(null);

      expect(apiHandlerSpy.showSuccess).toHaveBeenCalledOnceWith('Record deleted.');
    });

    it('calls showError and completes silently on error', (done) => {
      let emitted = false;

      service.deleteAndProcess(testUrl, 'Deleted.').subscribe({
        next: () => { emitted = true; },
        error: () => fail('should not error'),
        complete: () => {
          expect(emitted).toBeFalse();
          expect(apiHandlerSpy.showError).toHaveBeenCalled();
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 500, statusText: 'Server Error' });
    });

    it('re-throws on a 401 error', (done) => {
      service.deleteAndProcess(testUrl, 'Deleted.').subscribe({
        next: () => fail('should not emit'),
        error: (err: HttpErrorResponse) => {
          expect(err.status).toBe(401);
          done();
        },
      });

      httpMock.expectOne(testUrl).flush(null, { status: 401, statusText: 'Unauthorized' });
    });
  });
});
