import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {TranslocoService} from '@jsverse/transloco';
import {ToastService} from '../services/toast.service';
import {catchError, throwError} from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleHttpError(error, translocoService, toastService);

      // Always re-throw the error so components can handle it if needed
      return throwError(() => error);
    })
  );
};

/**
 * Handles HTTP errors by checking if the error message exists in Transloco
 * and displays appropriate toast notifications
 */
const handleHttpError = (
  error: HttpErrorResponse,
  translocoService: TranslocoService,
  toastService: ToastService
): void => {
  let errorMessage: string | null = null;
  let errorTitle = 'Error';

  // Extract error message from response body
  if (error.error && typeof error.error === 'object') {
    const errorBody = error.error;

    // Check if 'message' property exists in the error body
    if (errorBody.message && typeof errorBody.message === 'string') {
      const messageKey = errorBody.message;

      if (translocoService.getTranslation() && hasTranslationKey(translocoService, messageKey)) {
        errorMessage = translocoService.translate(messageKey);
      } else {
        // If not a translation key, use the raw message
        errorMessage = messageKey;
      }
    }
  }

  // If no specific message found, use default error messages based on HTTP status
  if (!errorMessage) {
    errorMessage = getDefaultErrorMessage(error.status, translocoService);
    errorTitle = getDefaultErrorTitle(error.status, translocoService);
  }

  if (errorMessage) {
    toastService.showError(errorTitle, errorMessage);
  }
};

const hasTranslationKey = (translocoService: TranslocoService, key: string): boolean => {
  try {
    const translation = translocoService.translate(key);
    return translation !== key && translation !== undefined && translation !== null;
  } catch {
    return false;
  }
};

const getTranslationOrFallback = (translocoService: TranslocoService, key: string, fallback: string): string => {
  try {
    if (hasTranslationKey(translocoService, key)) {
      return translocoService.translate(key);
    }
    return fallback;
  } catch {
    return fallback;
  }
};

const getDefaultErrorMessage = (status: number, translocoService: TranslocoService): string => {
  switch (status) {
    case 0:
      return getTranslationOrFallback(translocoService, 'error.network.general', 'Network error. Please check your internet connection.');
    case 400:
      return getTranslationOrFallback(translocoService, 'error.validation.failed', 'Validation failed');
    case 401:
      return getTranslationOrFallback(translocoService, 'error.auth.failed', 'Authentication failed');
    case 403:
      return getTranslationOrFallback(translocoService, 'error.access.denied', 'Access denied');
    case 404:
      return getTranslationOrFallback(translocoService, 'error.notfound', 'Resource not found');
    case 409:
      return getTranslationOrFallback(translocoService, 'error.conflict', 'Resource already exists');
    case 422:
      return getTranslationOrFallback(translocoService, 'error.validation.failed', 'Validation failed');
    case 500:
    case 502:
    case 503:
    case 504:
      return getTranslationOrFallback(translocoService, 'error.internal.server', 'Internal server error. Please try again later.');
    default:
      return getTranslationOrFallback(translocoService, 'error.unknown', `An unexpected error occurred (${status})`);
  }
};

const getDefaultErrorTitle = (status: number, translocoService: TranslocoService): string => {
  if (status >= 400 && status < 500) {
    return getTranslationOrFallback(translocoService, 'error.client.title', 'Request Error');
  } else if (status >= 500) {
    return getTranslationOrFallback(translocoService, 'error.server.title', 'Server Error');
  }

  return getTranslationOrFallback(translocoService, 'error.general.title', 'Error');
};
