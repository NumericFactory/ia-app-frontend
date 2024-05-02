import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  loaderService.setLoader(true);
  return next(req).pipe(
    tap({
      // si ErrorHttpResponse, on set loader à FALSE*
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          loaderService.setLoader(false)
        }
      },
      // si la request est terminée, on set loader à FALSE*
      finalize: () => {
        loaderService.setLoader(false)
      }
    })
  )
};
