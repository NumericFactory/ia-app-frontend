import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserGateway } from '../../core/ports/user.gateway';
import { AlertService } from '../services/alert.service';


export const hasPlanGuard: CanActivateFn = (route, state) => {
  let hasPlan: boolean = false;
  const alertService = inject(AlertService);
  const userService = inject(UserGateway);
  userService.user$.subscribe((user: any) => {
    if (user) {
      const plan = user?.plans.find((plan: any) => plan.slug === route.paramMap.get('title'));
      if (!plan) {
        alertService.show(`Vous n'avez pas accès à ce programme`)
        hasPlan = false
      }
      else {
        hasPlan = true;
      }
    }
  });
  return hasPlan;

};
