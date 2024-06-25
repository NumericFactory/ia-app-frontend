import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGateway } from '../../core/ports/auth.gateway';
import { Observable, delay, filter, map, retry, skipUntil, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGateway);
  const router = inject(Router);
  // authService.isAuth$.subscribe((isAuth) => {
  //   console.log('isAuth', isAuth)
  //   if (!isAuth) {
  //     router.navigate(['/auth/login']);
  //   }

  // });
  // if (!authService.isAuthenticated()) {
  //   router.navigate(['/auth/login']);
  //   return false;
  // }

  return authService.isAuth$


};
