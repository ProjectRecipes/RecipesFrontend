import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Temporary check until login (US-1.B) is finished:
// the role will later come from the JWT token / AuthService.
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAdmin = localStorage.getItem('role') === 'ADMIN';
  return isAdmin ? true : router.createUrlTree(['/']);
};
