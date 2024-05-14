import { Injectable, inject } from '@angular/core';
import { CreateUserPromptAiReturnDTO, CreateUserPromptAiReturnResponseDTO, UserGateway } from '../ports/user.gateway';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { UserModel } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AlertService } from '../../shared/services/alert.service';

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

  constructor(private alert: AlertService) { }

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

  fetchUserPrompts(): Observable<any> {
    const endpoint = '/me/prompts';
    return this.http.get<UserModel>(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => response.data),
      tap((userPrompts: any) => {
        const user = this.userSubject.getValue()
        if (user && userPrompts) {
          user.prompts = userPrompts
          this.userSubject.next(user)
        }
      })
    )
  }

  public postStepUserVariables(stepId: number, payloadUserVar: any): Observable<any> {
    const endpoint = `/steps/${stepId}/user-variables`;
    return this.http.post(`${this.apiUrl}${endpoint}`, { variables: payloadUserVar }).pipe(
      tap((response: any) => {

        const user = this.userSubject.getValue();
        if (user && response.data) {
          user.variables = [...response.data];
          this.userSubject.next(user);
        }
      })
    )
  }

  public postUserSettings(payload: any): Observable<any> {
    const endpoint = '/user-parameters';
    return this.http.post(`${this.apiUrl}${endpoint}`, { settings: payload }).pipe(
      tap((response: any) => {
        const user = this.userSubject.getValue();
        if (user && response.data) {
          user.settings = [...response.data];
          this.userSubject.next(user);
          this.alert.show('Paramètres sauvegardés', 'success');
        }
      })
    )
  }

  public postUserPromptAIResponse(stepId: number, promptId: number, payloadAIResponse: CreateUserPromptAiReturnDTO): Observable<CreateUserPromptAiReturnResponseDTO> {
    const endpoint = `/steps/${stepId}/prompts/${promptId}/ai-response`;
    const cleanPayload = { ...payloadAIResponse.prompt };
    return this.http.post(`${this.apiUrl}${endpoint}`, cleanPayload).pipe(
      tap((response: any) => {
        console.log(response);
        const user = this.userSubject.getValue();
        if (user && response.data) {
          if (!user.prompts) {
            user.prompts = [];
          }
          // set user.prompts
          let foundPromptInUserData = user.prompts.find((prompt) => prompt.id === promptId);
          if (foundPromptInUserData) {
            foundPromptInUserData = { ...response.data };
          }
          else {
            user.prompts = [{ ...response.data }, ...user.prompts];
          }
          this.userSubject.next(user);
          // set user.history
          this.fetchUserPromptsHistoryByStep().subscribe();
        }
      })
    )
  }

  fetchUserPromptsHistoryByStep(stepId?: number): Observable<any> {
    const endpoint = `/me/prompts-history`;
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => response.data),
      tap((userPrompts: any) => {
        const user = this.userSubject.getValue()
        if (user && userPrompts) {
          user.history = userPrompts;
          this.userSubject.next(user)
        }
      })
    )
  }


}