import { inject, Injectable } from '@angular/core';
import { AuthGateway, loginUserPayload, registerUserPayload, ResponseMessage } from '../ports/auth.gateway';
import { Observable, BehaviorSubject, tap, lastValueFrom, map, merge, mergeMap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';
import { UserGateway } from '../ports/user.gateway';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements AuthGateway {

  private bottomSheet = inject(MatBottomSheet);

  // inject HttpClient
  private http = inject(HttpClient)
  private apiUrl: string = environment.apiUrl;

  // Data store for user
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  public user$: Observable<UserModel | null> = this.userSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject(true);
  public isAuth$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router, private alert: AlertService, private userService: UserGateway) { }

  // register a new user
  public register(userPayload: registerUserPayload): Observable<ResponseMessage> {
    const endpoint = '/auth/register';
    return this.http.post<ResponseMessage>(`${this.apiUrl}${endpoint}`, userPayload)
      .pipe(tap(
        () => {
          this.alert.show('Un email de confirmation vous a été envoyé', 'success');
          this.router.navigate(['/auth/login'])
        })
      );
  }

  // validate user account
  public validateAccount(token: string, email: string, tokenId: number): Observable<ResponseMessage> {
    const endpoint = '/auth/validate-account';
    return this.http.post<ResponseMessage>(`${this.apiUrl}${endpoint}`, { token, email, tokenId });
  }

  // login user
  public login(credentials: loginUserPayload): Observable<UserModel | null> {
    const endpoint = '/auth/login';
    return this.http.post<UserModel>(`${this.apiUrl}${endpoint}`, credentials)
      .pipe(
        tap((response: any) => {
          this.userSubject.next(response.user as UserModel);
          this.isAuthenticatedSubject.next(true);
          this.storeToken(response.token.oat);
          // load user in store UserService
          this.fetchUser();
          this.alert.show('Vous êtes connecté(e)', 'success');
          this.router.navigate(['/dashboard']);
        })
      );
  }

  // remember password
  public rememberPassword(email: string): Observable<ResponseMessage> {
    const endpoint = '/auth/remember-password';
    return this.http.post<ResponseMessage>(`${this.apiUrl}${endpoint}`, { email });
  }

  // reset password
  public resetPassword(password: string): Observable<ResponseMessage> {
    const endpoint = '/auth/reset-password';
    return this.http.post<ResponseMessage>(`${this.apiUrl}${endpoint}`, { password });
  }

  // set password
  public setPassword(password: any, email: string, token: string, tokenId: string): void {
    console.log(token)
    const endpoint = '/auth/set-password';
    const params = new HttpParams()
      .set('email', email)
      .set('token', token)
      .set('tokenId', tokenId)
    this.http.post<ResponseMessage>(`${this.apiUrl}${endpoint}`, password, { params })
      .subscribe({
        next: (res) => {
          this.alert.show('Connectez-vous', 'success');
          this.router.navigate(['auth'])
        }
      })
  }

  // logout user
  public logout(): Observable<void> {
    console.log('logout')
    const endpoint = '/auth/logout';
    return this.http.get<void>(`${this.apiUrl}${endpoint}`)
      .pipe(
        tap(() => {
          this.removeToken();
          this.userSubject.next(null);
          this.isAuthenticatedSubject.next(false);
          this.alert.show('Vous êtes déconnecté(e)', 'success');
          this.router.navigate(['/auth']);
        })
      );
  }

  // helper isAuthenticated
  public isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value
  }
  // helper hasRole
  public hasRole(role: number): boolean {
    return this.userSubject.value?.roles.includes(role) || false;
  }

  // helper userPassedTheFirstOnboarding
  public userPassedTheFirstOnboarding(): boolean {
    const passed = Boolean(this.userSubject.value?.settings
      && (this.userSubject.value?.settings?.length > 0));
    console.log('passed', passed)
    return passed;
  }

  /**
   * public getUser()
   * Role : check if user exists in the userSubject
   *        if not, check if token exists in localstorage
   *        if token exists, fetch user from the server and store it in the userSubject
   *        if token does not exist, set userSubject to null
   *        return userSubject as observable<UserModel | null>
   * @returns UserModel | null
   */
  public async getUser(): Promise<UserModel | null> {
    let user = null;
    if (this.userSubject.value === null) {
      const token = this.getToken();
      if (token) {
        let response = await lastValueFrom(this.fetchUser())
        user = response as UserModel;
        // store user in userSubject in UserService
        this.userService.setUserSubject(user);
      }
    }
    return user;
  }

  /**
   * fetchUser()
   * Role : fetch user from the server 
   *        and store it in the userSubject
   * @returns Observable<UserModel | null>
   */
  fetchUser(): any {
    this.http.get<UserModel>(`${this.apiUrl}/me`)
      // .pipe(
      //   tap((response: any) => {
      //     if (response.data) {
      //       this.userSubject.next(response.data as UserModel);
      //       this.isAuthenticatedSubject.next(true);
      //       this.alert.show(`Bienvenue ${response.data.firstname}`, 'success');
      //     }
      //   }),
      //   map((response: any) => response.data as UserModel)
      // )
      .subscribe((response: any) => {
        if (response.data) {
          // this.userSubject.next(response.data as UserModel);
          // store user in userSubject in UserService
          console.log('response.data', response.data)
          this.userService.setUserSubject(response.data as UserModel);
          this.isAuthenticatedSubject.next(true);
          this.alert.show(`Bienvenue ${response.data.firstname}`, 'success');
        }
      })
  }


  fetchSignupPageVisibility(): Observable<boolean> {
    const endpoint = '/signup-page-visibility';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => Boolean(response.data.isActive))
    )
  }

  checkInvitedSignupUser(emailInQueryString: string): Observable<any> {
    const endpoint = `/check-invitation-email-exists?email=${emailInQueryString}`;
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => response.data)
    )
  }

  getUserFromSubject(): UserModel | null {
    return this.userSubject.value;
  }

  // add bearer token to request header
  public addBearerToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      headers: request.headers
        .append('Authorization', `Bearer ${token}`)
        .append('accept', 'application/json'),
    })
  }

  // store token in localstorage
  public storeToken(token: string): void {
    localStorage.setItem('token', token);
  }
  // get token from localstorage
  public getToken(): string | null {
    return localStorage.getItem('token');
  }
  // remove token from localstorage
  public removeToken(): void {
    localStorage.removeItem('token');
  }

}



