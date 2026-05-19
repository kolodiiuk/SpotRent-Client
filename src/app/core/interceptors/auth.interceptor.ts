import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, map, Observable, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../../../features/auth/services/auth-api.service';
import { AuthStorageService } from '../../../features/auth/services/auth-storage.service';

const nonRefreshableAuthEndpoints = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/google',
  '/api/auth/refresh',
  '/api/auth/logout'
];

let refreshInFlight$: Observable<string> | null = null;

const isNonRefreshableAuthRequest = (request: HttpRequest<unknown>): boolean =>
  nonRefreshableAuthEndpoints.some(endpoint => request.url.includes(endpoint));

const withAuthorization = (
  request: HttpRequest<unknown>,
  token: string | null
): HttpRequest<unknown> => {
  if (!token || isNonRefreshableAuthRequest(request)) {
    return request;
  }

  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const api = inject(AuthApiService);
  const authStorage = inject(AuthStorageService);
  const requestWithToken = withAuthorization(req, authStorage.getAccessToken());

  return next(requestWithToken).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;

      if (!isUnauthorized || isNonRefreshableAuthRequest(req)) {
        return throwError(() => error);
      }

      if (!refreshInFlight$) {
        refreshInFlight$ = api.refreshToken().pipe(
          map(response => {
            authStorage.setAccessToken(response.token);
            authStorage.setUser(response.user);
            return response.token;
          }),
          catchError(refreshError => {
            authStorage.clearSession();
            return throwError(() => refreshError);
          }),
          finalize(() => {
            refreshInFlight$ = null;
          }),
          shareReplay(1)
        );
      }

      return refreshInFlight$.pipe(
        switchMap((newAccessToken: string) => next(withAuthorization(req, newAccessToken)))
      );
    })
  );
};
