import { inject } from '@angular/core';
import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  authService.setLoginRedirect(state.url);

  return isAuthenticated(authService, router);
};

export const authGuardChildren: CanActivateChildFn = (route, state) => {
  return authGuard(route, state);
};

async function isAuthenticated(authService: AuthService, router: Router) {
  const authenticated = await authService.authenticate();
  if (authenticated) return true;
  return router.navigate(['/login']);
}
