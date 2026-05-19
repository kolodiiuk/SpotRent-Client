import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoading()) {
    return authService.loading$.pipe(
      filter(isLoading => !isLoading),
      take(1),
      map(() => authService.isAuthenticated() ? true : router.parseUrl('/auth/login'))
    );
  }

  return authService.isAuthenticated() ? true : router.parseUrl('/auth/login');
};
