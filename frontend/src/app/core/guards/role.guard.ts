import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUserValue;
  const expectedRole = route.data['expectedRole'];

  if (currentUser && currentUser.role === expectedRole) {
    return true;
  }

  // Unauthorized access redirects to general user dashboard
  return router.createUrlTree(['/dashboard']);
};
