import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const purchaseGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  if (router.getCurrentNavigation()?.extras.info) return true;
  return router.navigate(['/']);
};
