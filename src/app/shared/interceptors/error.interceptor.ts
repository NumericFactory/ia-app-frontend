import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { LoaderService } from '../services/loader.service';
//import { environment } from '../../../environments/environment';

type APIErrorResponse = {
  message: string,
  status: number
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const alert = inject(AlertService);
  const loader = inject(LoaderService);
  const _route = inject(Router);
  const _activatedRoute = inject(ActivatedRoute);

  return next(req).pipe(
    tap({
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          const error = err.error as APIErrorResponse;
          switch (err.status) {
            // detecter si error_message est une instanceof string ou un objet
            case 400:
              // if (req.url.includes(this.MY_API+'/users') && req.method=='POST')
              alert.show(error.message, 'error');
              break;
            case 401:
              // alert.show('Connectez-vous pour continuer', 'info');
              console.log('oki?', _route.routerState.snapshot.url.includes('/auth/login'))
              if (_route.routerState.snapshot.url.includes('/auth/set-password') === false &&
                _route.routerState.snapshot.url.includes('/auth/register') === false &&
                (_route.routerState.snapshot.url.includes('/auth/login') === false)
              ) {
                _route.navigate(['/auth'])
              }
              break;
            case 403:
              alert.show('Accès non permis', 'error')
              break;
            case 404:
              alert.show(error.message, 'error')
              break;
            case 409:
              alert.show(error.message, 'error')
              break;
            case 419:
              alert.show(error.message, 'error')
              break;
            case 422:
              alert.show(error.message, 'error')
              break;

            case 500:
              alert.show('Erreur serveur', 'error')
              break;
            default:
              alert.show("Erreur serveur", 'error')
          }
        }

      }
    })
  )
};
