import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ApiHandlerService } from './api-handler-service';
import { SnackBarComponent } from '../SnackBarComponent/snack-bar-component';

describe('ApiHandlerService', () => {
  let service: ApiHandlerService;
  let openSpy: jasmine.Spy;

  beforeEach(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    TestBed.configureTestingModule({
      providers: [
        ApiHandlerService,
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    });
    service = TestBed.inject(ApiHandlerService);
    openSpy = snackBarSpy.openFromComponent;
  });

  // ---------------------------------------------------------------------------
  // showSuccess
  // ---------------------------------------------------------------------------

  describe('showSuccess(message)', () => {
    it('opens the snackbar with the message and success panel class', () => {
      service.showSuccess('Saved successfully.');

      expect(openSpy).toHaveBeenCalledOnceWith(SnackBarComponent, jasmine.objectContaining({
        data: { message: 'Saved successfully.', type: 'success' },
        panelClass: 'snackbar-success',
      }));
    });

    it('uses the default duration of 8000ms', () => {
      service.showSuccess('Done.');

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.duration).toBe(8000);
    });
  });

  describe('showSuccess(message, duration)', () => {
    it('uses the provided duration', () => {
      service.showSuccess('Done.', 3000);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.duration).toBe(3000);
    });
  });

  describe('showSuccess(httpResponse)', () => {
    it('uses the response body as the message when body is present', () => {
      const response = new HttpResponse({ body: 'Record created.', status: 201 });
      service.showSuccess(response);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toBe('Record created.');
    });

    it('falls back to "Success!" when the response body is absent', () => {
      const response = new HttpResponse({ body: null, status: 204 });
      service.showSuccess(response);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toBe('Success!');
    });

    it('uses the success panel class', () => {
      const response = new HttpResponse({ body: 'OK', status: 200 });
      service.showSuccess(response);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.panelClass).toBe('snackbar-success');
    });
  });

  describe('showSuccess(httpResponse, message)', () => {
    it('uses the explicit message over the response body', () => {
      const response = new HttpResponse({ body: 'raw body', status: 200 });
      service.showSuccess(response, 'Custom success message.');

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toBe('Custom success message.');
    });
  });

  describe('showSuccess(httpResponse, message, duration)', () => {
    it('uses both the custom message and custom duration', () => {
      const response = new HttpResponse({ body: 'raw body', status: 200 });
      service.showSuccess(response, 'Custom message.', 5000);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toBe('Custom message.');
      expect(config.duration).toBe(5000);
    });
  });

  // ---------------------------------------------------------------------------
  // showError
  // ---------------------------------------------------------------------------

  describe('showError(message)', () => {
    it('opens the snackbar with the message and error panel class', () => {
      service.showError('Something went wrong.');

      expect(openSpy).toHaveBeenCalledOnceWith(SnackBarComponent, jasmine.objectContaining({
        data: { message: 'Something went wrong.', type: 'error' },
        panelClass: 'snackbar-error',
      }));
    });
  });

  describe('showError(message, duration)', () => {
    it('uses the provided duration', () => {
      service.showError('Error.', 2000);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.duration).toBe(2000);
    });
  });

  describe('showError(HttpErrorResponse) — 500+', () => {
    it('shows a server error message', () => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toContain('500');
    });

    it('returns false', () => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
      expect(service.showError(error)).toBeFalse();
    });

    it('uses the error panel class', () => {
      const error = new HttpErrorResponse({ status: 503, statusText: 'Service Unavailable' });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.panelClass).toBe('snackbar-error');
    });
  });

  describe('showError(HttpErrorResponse) — 422', () => {
    it('returns ok: false with the validation errors map', () => {
      const error = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
        error: { errors: { name: ['Name is required.'] } },
      });

      const result = service.showError(error) as any;

      expect(result.ok).toBeFalse();
      expect(result.status).toBe(422);
      expect(result.validationErrors).toEqual({ name: ['Name is required.'] });
    });

    it('returns an empty validationErrors map when no errors are provided', () => {
      const error = new HttpErrorResponse({ status: 422, statusText: 'Unprocessable Entity' });

      const result = service.showError(error) as any;

      expect(result.validationErrors).toEqual({});
    });
  });

  describe('showError(HttpErrorResponse) — 401', () => {
    it('returns ok: false with status 401', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        error: { errors: { token: ['Token expired.'] } },
      });

      const result = service.showError(error) as any;

      expect(result.ok).toBeFalse();
      expect(result.status).toBe(401);
      expect(result.validationErrors).toEqual({ token: ['Token expired.'] });
    });
  });

  describe('showError(HttpErrorResponse) — 403', () => {
    it('shows a forbidden message', () => {
      const error = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toContain('Forbidden');
    });

    it('returns false', () => {
      const error = new HttpErrorResponse({ status: 403, statusText: 'Forbidden' });
      expect(service.showError(error)).toBeFalse();
    });
  });

  describe('showError(HttpErrorResponse) — 404', () => {
    it('returns ok: false with status 404', () => {
      const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });

      const result = service.showError(error) as any;

      expect(result.ok).toBeFalse();
      expect(result.status).toBe(404);
    });

    it('shows a not-found message', () => {
      const error = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toContain('404');
    });
  });

  describe('showError(HttpErrorResponse) — 4xx catch-all', () => {
    it('uses error.error.message when present', () => {
      const error = new HttpErrorResponse({
        status: 409,
        statusText: 'Conflict',
        error: { message: 'Duplicate entry.' },
      });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toBe('Duplicate entry.');
    });

    it('falls back to a generic message when error.error.message is absent', () => {
      const error = new HttpErrorResponse({ status: 409, statusText: 'Conflict' });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toContain('409');
    });

    it('returns false', () => {
      const error = new HttpErrorResponse({ status: 409, statusText: 'Conflict' });
      expect(service.showError(error)).toBeFalse();
    });
  });

  describe('showError(HttpErrorResponse) — unexpected status', () => {
    it('shows the unexpected error message', () => {
      const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown' });
      service.showError(error);

      const config = openSpy.calls.mostRecent().args[1];
      expect(config.data.message).toBe('Unexpected error occurred.');
    });

    it('returns false', () => {
      const error = new HttpErrorResponse({ status: 0, statusText: 'Unknown' });
      expect(service.showError(error)).toBeFalse();
    });
  });
});
