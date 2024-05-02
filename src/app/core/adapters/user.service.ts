import { Injectable, inject } from '@angular/core';
import { UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService implements UserGateway {

  // inject HttpClient
  private http = inject(HttpClient)
  private apiUrl: string = environment.apiUrl;

  // Data store for user with variables value & prompts ia_response
  private userSubject = new BehaviorSubject<UserModel | null>(null);
  public user$ = this.userSubject;

  constructor() { }

  setUserSubject(user: UserModel): void {
    this.userSubject.next(user);
  }

  getUserFromSubject(): UserModel | null {
    return this.userSubject.getValue();
  }

  fetchUserVariables(): Observable<UserModel> {
    const endpoint = '/me/variables';
    return this.http.get<UserModel>(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        const user = this.userSubject.getValue()
        if (user && response.data) {
          user.variables = response.data
          this.userSubject.next(user)
        }
      })
    )
  }

  public postStepUserVariables(stepId: number, payloadUserVar: any): Observable<any> {
    const endpoint = `/steps/${stepId}/user-variables`;
    return this.http.post(`${this.apiUrl}${endpoint}`, { variables: payloadUserVar }).pipe(
      tap((response: any) => {
        console.log('response', response);
        const user = this.userSubject.getValue();
        if (user && response.data) {
          user.variables = [...response.data];
          console.log(user)
          this.userSubject.next(user);
        }
      })
    )
  }


}