import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { ApiHandlerService } from '../ApiHandlerService/api-handler-service';

@Injectable({ providedIn: 'root' })
export class ApiFetcherService {
  constructor(
    private http: HttpClient,
    private apiHandlerService: ApiHandlerService
  ) {}

  /**
   * Fetch data from a URL and process it with a callback
   * @param url The API endpoint
   * @param successMessage Message to show on success
   * @param process Callback to map the response body to app state
   */
  fetchAndProcess<TResponse>(
    url: string,
    successMessage: string,
    process: (body: TResponse) => void
  ): Observable<void> {
    return this.http.get<TResponse>(url, { observe: 'response' as const }).pipe(
      tap(() => this.apiHandlerService.showSuccess(successMessage)),
      map(response => {
        const body = response.body;
        process(body!); // assume body is not null
      }),
      catchError((error: HttpErrorResponse) => {
        this.apiHandlerService.showError(error);
        if (error.status === 401 || error.status === 422) return throwError(() => error);
        return EMPTY;
      })
    );
  }
}
