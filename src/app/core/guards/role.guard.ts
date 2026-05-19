import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  const evaluateAccess = (): boolean => {
    const userRole = authService.getUserRole();
    if (!authService.isAuthenticated() || !expectedRoles.includes(userRole)) {
      router.navigate(['/auth/login']);
      return false;
    }

    return true;
  };

  if (authService.isLoading()) {
    return authService.loading$.pipe(
      filter(isLoading => !isLoading),
      take(1),
      map(() => evaluateAccess())
    );
  }

  return evaluateAccess();
};
