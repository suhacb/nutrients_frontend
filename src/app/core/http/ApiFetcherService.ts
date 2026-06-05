import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
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
      tap(() => { if (successMessage) this.apiHandlerService.showSuccess(successMessage); }),
      map((response: HttpResponse<TResponse>) => {
        process(response.body!);
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  postAndProcess<TRequest, TResponse>(
    url: string,
    payload: TRequest,
    successMessage: string,
    process?: (body: TResponse) => TResponse
  ): Observable<TResponse> {
    return this.processMutationResponse(
      this.http.post<TResponse>(url, payload, { observe: 'response' as const }),
      successMessage,
      process,
    );
  }

  putAndProcess<TRequest, TResponse>(
    url: string,
    payload: TRequest,
    successMessage: string,
    process?: (body: TResponse) => TResponse
  ): Observable<TResponse> {
    return this.processMutationResponse(
      this.http.put<TResponse>(url, payload, { observe: 'response' as const }),
      successMessage,
      process,
    );
  }

  patchAndProcess<TRequest, TResponse>(
    url: string,
    payload: TRequest,
    successMessage: string,
    process?: (body: TResponse) => TResponse
  ): Observable<TResponse> {
    return this.processMutationResponse(
      this.http.patch<TResponse>(url, payload, { observe: 'response' as const }),
      successMessage,
      process,
    );
  }

  private processMutationResponse<TResponse>(
    request$: Observable<HttpResponse<TResponse>>,
    successMessage: string,
    process?: (body: TResponse) => TResponse,
  ): Observable<TResponse> {
    return request$.pipe(
      tap(() => { if (successMessage) this.apiHandlerService.showSuccess(successMessage); }),
      map((response: HttpResponse<TResponse>) => {
        const body = response.body!;
        return process ? process(body) : body;
      }),
      catchError((error: HttpErrorResponse) => this.handleError(error)),
    );
  }

  deleteAndProcess(url: string, successMessage: string): Observable<void> {
    return this.http.delete(url, { observe: 'response' as const }).pipe(
      tap(() => this.apiHandlerService.showSuccess(successMessage)),
      map(() => void 0),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /**
   * Centralized error handling
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    this.apiHandlerService.showError(error);
    if (error.status === 401 || error.status === 422) return throwError(() => error);
    return EMPTY;
  }
}
