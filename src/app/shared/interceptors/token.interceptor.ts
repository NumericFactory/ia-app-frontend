import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthGateway } from '../../core/ports/auth.gateway';

/**
 * role : extract endpoint from full url
 * @param baseUrl @param fullUrl 
 * @returns endppoint string
 */
function getUrlEndpoint(baseUrl: string, fullUrl: string): string {
  return fullUrl.split(baseUrl)[1]
}
/**
    * Check if
    * url called is my api
    * url needs user token or not
    * @param request:HttpRequest
    * @returns boolean
  */
// function isUrlNeedsUserToken(request: HttpRequest<any>): boolean {
//   if (request.url.includes(this.MYAPI_URL)) {
//     let endpoint = getUrlEndpoint(this.MYAPI_URL, request.url);
//     // verify if the request exists in endPoint[] we defined
//     let requestIsAnAuthEnpoint = this.apiAuthEndpoints.find(item =>
//       endpoint.includes(item.endpoint) &&
//       (item.method === request.method || item.method === 'ALL')
//     );
//     if (requestIsAnAuthEnpoint) {
//       return true;
//     }
//   }
//   return false;
// }

/**
 * addBearerToken
 * @param request
 * @param token
 * @returns req:HttpRequest
 */
function addBearerToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    headers: request.headers
      .append('Authorization', `Bearer ${token}`)
      .append('accept', 'application/json'),
  })
}



export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthGateway);

  let cloneRequest: HttpRequest<any> = req;

  // // SI API 
  // if (req.url.includes(this.URL)) {
  //   cloneRequest = this.addBearerToken(req, this.TOKEN);
  // }

  // SI notre API et SI l'url necessite l'authentification
  // if (this.isUrlNeedsUserToken(req))
  if (true) {
    const token = authService.getToken();
    // 
    if (token !== null)
      cloneRequest = addBearerToken(req, token)
  }

  return next(cloneRequest);
};
