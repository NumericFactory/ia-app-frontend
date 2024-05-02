import { CanActivateFn } from '@angular/router';
import { AuthGateway } from '../../core/ports/auth.gateway';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGateway);
  const alert = inject(AlertService);

  let hasTheRightRole = false;

  // check if the user hasn't the role "user"
  if (state.url.includes('/dashboard')) {
    if (authService.hasRole(1)
      || authService.hasRole(2)
      || authService.hasRole(3)) {
      hasTheRightRole = true;
    }
  }
  // check if the user hasn't the role "admin" or "powerAdmin"
  if (state.url.includes('/admin')) {
    if (authService.hasRole(2) || authService.hasRole(3)) {
      hasTheRightRole = true;
    }
  }

  // alert if the user has not the role
  if (!hasTheRightRole) {
    alert.show('Vous n\'avez pas les droits pour accéder cette section', 'error');
  }

  return hasTheRightRole;
};
