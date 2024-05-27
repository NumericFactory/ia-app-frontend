import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthGateway } from '../../core/ports/auth.gateway';
import { AlertService } from '../services/alert.service';

export const onboardingPassedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthGateway);
  const alert = inject(AlertService);
  const router = inject(Router);
  let userPassedTheFirstOnboarding = false;

  // check if the user hasn't the role "user"
  if (authService.userPassedTheFirstOnboarding()) {
    userPassedTheFirstOnboarding = true;
  }

  // alert if the user has not the role
  if (!userPassedTheFirstOnboarding) {
    router.navigate(['/onboarding']);
    alert.show(
      'Vous devez saisir vos paramètres avant d\'utiliser l\'application ',
      'info');
  }

  return userPassedTheFirstOnboarding;
};
