import { HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackBarComponent } from "../SnackBarComponent/snack-bar-component";


export interface ValidationErrorsMap {
    [field: string]: string | string[];
}

export interface apiResult {
    ok: boolean,
    status: number,
    validationErrors?: ValidationErrorsMap
}

@Injectable({providedIn: 'root'})
export class ApiHandlerService {
    constructor(private snackbar: MatSnackBar) {}

  /**
   * Show a success snackbar from an HTTP response or a custom message.
   * @param success Optional HttpResponse object
   * @param message Optional message string
   */
  showSuccess(message: string): void;
  showSuccess(message: string, duration: number): void;
  showSuccess(success: HttpResponse<any>): void;
  showSuccess(success: HttpResponse<any>, message: string): void;
  showSuccess(success: HttpResponse<any>, message: string, duration: number): void;

  // Implementation (single, flexible)
  showSuccess(
    arg: string | HttpResponse<any>,
    messageOrDuration?: string | number,
    duration?: number
  ): void {
    let finalMessage: string;
    let finalDuration: number = 8000; // default

    if (typeof arg === 'string') {
      finalMessage = arg;
      if (typeof messageOrDuration === 'number') finalDuration = messageOrDuration;
    } else {
      finalMessage =
        typeof messageOrDuration === 'string'
          ? messageOrDuration
          : arg.body
          ? String(arg.body)
          : 'Success!';
      if (typeof duration === 'number') finalDuration = duration;
    }

    this.openSnackbar(finalMessage, 'success', finalDuration);
  }

/**
   * Show an error snackbar from an HttpErrorResponse or a custom message.
   * Optionally returns structured validation errors for 422 or 401 responses.
   */
// Overloads
showError(message: string): void;
showError(message: string, duration: number): void;
showError(error: HttpErrorResponse): apiResult | false;

// Implementation
showError(
  arg: string | HttpErrorResponse,
  durationOrUnused?: number
): apiResult | false | void {
  const duration = typeof durationOrUnused === 'number' ? durationOrUnused : undefined;

  if (typeof arg === 'string') {
    // simple message
    this.openSnackbar(arg, 'error', duration);
    return;
  }

  // HttpErrorResponse handling
  const error = arg;

  if (error.status >= 500) {
    this.openSnackbar(`Server error ${error.status}. Please try again later.`, 'error', duration);
    return false;
  }

  if (error.status === 422) {
    this.openSnackbar(`Error ${error.status}: ${error.statusText}`, 'error', duration);
    return {
      ok: false,
      status: error.status,
      validationErrors: error.error?.errors ?? {},
    };
  }

  if (error.status === 403) {
    this.openSnackbar(`Error ${error.status}: Forbidden.`, 'error', duration);
    return false;
  }

  if (error.status === 401) {
    this.openSnackbar(`Error ${error.status}: Unauthorized.`, 'error', duration);
    return {
      ok: false,
      status: error.status,
      validationErrors: error.error?.errors ?? {},
    };
  }

  if (error.status === 404) {
    this.openSnackbar(`Error ${error.status}: Resource not found.`, 'error', duration);
    return {
      ok: false,
      status: error.status,
    };
  }

  if (error.status >= 400 && error.status < 500) {
    this.openSnackbar(error.error?.message || `Request failed (${error.status})`, 'error', duration);
    return false;
  }

  this.openSnackbar('Unexpected error occurred.', 'error', duration);
  return false;
}


  /**
   * Generic method to open the snackbar with type (success/error)
   */
  private openSnackbar(message: string, type: 'success' | 'error', duration?: number) {
    this.snackbar.openFromComponent(SnackBarComponent, {
      data: { message, type },
      duration: duration ?? 8000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}