import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { AuthGateway } from './core/ports/auth.gateway';
import { AuthService } from './core/adapters/auth.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { errorInterceptor } from './shared/interceptors/error.interceptor';
import { tokenInterceptor } from './shared/interceptors/token.interceptor';
import { loaderInterceptor } from './shared/interceptors/loader.interceptor';
import { AdminGateway } from './core/ports/admin.gateway';
import { AdminService } from './core/adapters/admin.service';
import { StepGateway } from './core/ports/step.gateway';
import { StepService } from './core/adapters/step.service';
import { UserGateway } from './core/ports/user.gateway';
import { UserService } from './core/adapters/user.service';
import { IAGateway } from './core/ports/ia.gateway';
import { IaService } from './core/adapters/ia.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withHashLocation()
    ),
    provideHttpClient(
      withInterceptors([
        loaderInterceptor, tokenInterceptor, errorInterceptor,
      ])
    ),
    { provide: AuthGateway, useClass: AuthService },
    { provide: AdminGateway, useClass: AdminService },
    { provide: UserGateway, useClass: UserService },
    // steps 
    { provide: StepGateway, useClass: StepService },
    // ia 
    { provide: IAGateway, useClass: IaService },
    provideAnimationsAsync()
  ]
};
