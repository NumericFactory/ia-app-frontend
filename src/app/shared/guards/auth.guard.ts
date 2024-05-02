import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGateway } from '../../core/ports/auth.gateway';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGateway);
  const router = inject(Router);
  return authService.isAuth$;

};
