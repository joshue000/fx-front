import { InjectionToken, inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { timeout, TimeoutError } from 'rxjs';
import { catchError, throwError } from 'rxjs';

export const HTTP_TIMEOUT = new InjectionToken<number>('HTTP_TIMEOUT', {
  providedIn: 'root',
  factory: () => 30_000,
});

export const timeoutInterceptor: HttpInterceptorFn = (req, next) => {
  const ms = inject(HTTP_TIMEOUT);

  return next(req).pipe(
    timeout(ms),
    catchError(err => {
      if (err instanceof TimeoutError) {
        return throwError(() => ({ status: 0, error: { message: `Request timed out after ${ms}ms` } }));
      }
      return throwError(() => err);
    })
  );
};
