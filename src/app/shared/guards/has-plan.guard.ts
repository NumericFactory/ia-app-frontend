import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserGateway } from '../../core/ports/user.gateway';
import { AlertService } from '../services/alert.service';


export const hasPlanGuard: CanActivateFn = (route, state) => {
  if (!route.url[0].path.includes('programme')) return true;
  let hasPlan: boolean = true;
  const alertService = inject(AlertService);
  const userService = inject(UserGateway);
  const router = inject(Router);
  const user = userService.getUserFromSubject();
  if (!user) {
    router.navigate(['/']);
    return false;
  }
  const plan = user?.plans.find((plan: any) => plan.slug === route.paramMap.get('title'));
  if (!plan) {
    alertService.show(`Vous n'avez pas accès à ce programme`, 'info', 3000, 'center')
    hasPlan = false
  }
  else {
    hasPlan = true;
  }

  return hasPlan;

};
