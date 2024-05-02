import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { Role, UserModel } from '../models/user.model';
import { AdminGateway } from '../ports/admin.gateway';
import { AlertService } from '../../shared/services/alert.service';
import { FormUISchema, PromptModelAdmin, StepModelAdmin } from '../models/step.model';
import { of } from 'rxjs';
// data
import { stepsTestDataAdmin } from '../data-admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService implements AdminGateway {


  // inject HttpClient
  private http = inject(HttpClient)
  private apiUrl: string = environment.apiUrl;

  // store the users
  private usersSubject = new BehaviorSubject<UserModel[]>([]);
  public users$ = this.usersSubject.asObservable();

  // store the steps
  private stepsSubject = new BehaviorSubject<StepModelAdmin[]>([]);
  public steps$ = this.stepsSubject.asObservable();

  constructor(private alert: AlertService) { }

  // get all users
  public fetchUsers(): Observable<UserModel[]> {
    const endpoint = '/admin/users';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        this.usersSubject.next(response as UserModel[]);
      })
    );
  }

  // get user by id
  public fetchUserById(id: string): Observable<UserModel> {
    const endpoint = `/admin/users/${id}`;
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => response as UserModel)
    )
  }

  // get all roles
  public fetchRoles(): Observable<number[] | Role[]> {
    const endpoint = '/admin/roles';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => response as number[])
    )
  }

  // set roles
  public setRoles(userId: number, roles: Role[] | number[]): void {
    const endpoint = `/admin/users/${userId}/roles`;
    const users = this.usersSubject.value;
    const foundUser: UserModel | undefined = users.find((user: UserModel) => user.id === userId);
    const foundUserOldRoles = foundUser?.roles;
    if (foundUser) {
      // set new roles for user in store usersSubject
      foundUser.roles = roles;
      this.usersSubject.next(users);
      // update on the server
      this.http.post(`${this.apiUrl}${endpoint}`, { roles_ids: roles, user_id: userId })
        // handle errors and revert to old roles
        .pipe(catchError((error: any) => {
          if (error && foundUserOldRoles) {
            foundUser.roles = foundUserOldRoles;
            this.usersSubject.next(users);
          }
          return error;
        }))
        .subscribe(
          (response) => {
            console.log('roles set', response);
            this.alert.show('Rôles mis à jour', 'success');
          }
        )
    }
  }

  /*************************************** */
  //  Step and Prompt Management Methods 
  /*************************************** */

  /**
   * role: fetch all steps
   * @returns 
   */
  fetchSteps(): Observable<StepModelAdmin[]> {
    return this.http.get(`${this.apiUrl}/admin/steps`).pipe(
      tap((response: any) => {
        console.log('response fetchSteps: ', response)
        this.stepsSubject.next(response as StepModelAdmin[]);
      })
    )
  }

  /**
   * role: create a new step
   * @param step 
   * @returns 
   */
  createStep(step: StepModelAdmin): Observable<StepModelAdmin> {
    return this.http.post(`${this.apiUrl}/admin/steps`, step).pipe(
      tap((response: any) => {
        let steps = this.stepsSubject.value;
        let newStep: StepModelAdmin = {
          id: response.data.id,
          title: response.data.title,
          subtitle: response.data.subtitle,
          desc: response.data.desc,
          variables: [],
          prompts: [],
          order: 0,
          createdAt: response.data.createdAt
        };
        steps = [newStep as StepModelAdmin, ...steps,];
        this.stepsSubject.next(steps);
      })
    )
  }

  /**
   * role: update a step
   * @param step 
   * @returns 
   */
  updateStep(step: StepModelAdmin): Observable<StepModelAdmin> {
    return this.http.put(`${this.apiUrl}/admin/steps/${step.id}`, step).pipe(
      tap((response: any) => {
        response.data as Pick<StepModelAdmin, 'id' | 'title' | 'subtitle' | 'desc'>
        const steps = this.stepsSubject.value;
        const step = steps.find(s => s.id === response.data.id);
        if (step) {
          step.title = response.data.title;
          step.subtitle = response.data.subtitle;
          step.desc = response.data.desc;
          this.stepsSubject.next(steps);
        }
      })
    )
  }

  /**
   * role : delete a step
   * @param id 
   * @returns 
   */
  deleteStep(id: number): Observable<number> {
    return this.http.delete(`${this.apiUrl}/admin/steps/${id}`).pipe(
      tap((response: any) => {
        let steps = this.stepsSubject.value;
        const index = steps.findIndex(s => s.id === id);
        if (index > -1) {
          steps = steps.filter(s => s.id !== id);
          this.stepsSubject.next(steps);
        }
      })
    )
  }

  /**
   * role : create a new array of questions for a step
   * @param variables 
   * @param stepId 
   * @returns 
   */
  createVariables(variables: FormUISchema[], stepId: number): Observable<any> {
    const endpoint = `/admin/steps/${stepId}/variables`;
    return this.http.post(`${this.apiUrl}${endpoint}`, variables).pipe(
      tap((response: any) => {
        const steps = this.stepsSubject.value;
        const step = steps.find(s => s.id === stepId);
        if (step) {
          step.variables = response.data;
          this.stepsSubject.next(steps);
          this.alert.show('Questions ajoutées', 'success');
        }
      })
    )
  }

  /**
   * role: update or create a new array of questions for a step
   * @param variable 
   * @param stepId 
   * @returns 
   */
  updateVariables(variables: FormUISchema[], stepId: number): Observable<any> {
    const endpoint = `/admin/steps/${stepId}/variables`;
    return this.http.put(`${this.apiUrl}${endpoint}`, variables).pipe(
      tap((response: any) => {
        const steps = this.stepsSubject.value;
        const step = steps.find(s => s.id === stepId);
        if (step) {
          step.variables = response.data;
          this.stepsSubject.next(steps);
          this.alert.show('Questions mises à jour', 'success');
        }
      })
    )
  }

  /**
   * role: delete a question from a step
   * @param id 
   * @returns 
   */
  deleteVariable(id: number): Observable<any> {
    const endpoint = `/admin/variables/${id}`;
    return this.http.delete(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        const deletedVariableId = parseInt(response.data);
        const steps = this.stepsSubject.value;
        steps.forEach(step => {
          step.variables = step.variables.filter(variable => variable.id !== deletedVariableId);
        })
        this.stepsSubject.next(steps);
      })
    )
  }



  fetchPrompts(stepId: number): Promise<PromptModelAdmin[]> {
    let prompts: PromptModelAdmin[] = [];
    const step = stepsTestDataAdmin.find(step => step.id === stepId)
    if (step) { prompts = step.prompts }
    console.log('prompts', prompts)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(prompts);
      }, 300);
    })
  }

  createPrompts(prompts: PromptModelAdmin[], stepId: number): Observable<PromptModelAdmin> {
    const endpoint = `/admin/steps/${stepId}/prompts`;
    return this.http.post(`${this.apiUrl}${endpoint}`, prompts).pipe(
      tap((response: any) => {
        const steps = this.stepsSubject.value;
        const step = steps.find(s => s.id === stepId);
        if (step) {
          step.prompts = response.data;
          this.stepsSubject.next(steps);
          this.alert.show('prompts ajoutés', 'success');
        }
      })
    )
  }

  updatePrompts(prompts: PromptModelAdmin[], stepId: number): Observable<PromptModelAdmin> {
    const endpoint = `/admin/steps/${stepId}/prompts`;
    return this.http.put(`${this.apiUrl}${endpoint}`, prompts).pipe(
      tap((response: any) => {
        const steps = this.stepsSubject.value;
        const step = steps.find(s => s.id === stepId);
        if (step) {
          step.prompts = response.data;
          this.stepsSubject.next(steps);
          this.alert.show('Prompts mis à jour', 'success');
        }
      })
    )
  }

  deletePrompt(id: number): Observable<void> {
    const endpoint = `/admin/prompts/${id}`;
    return this.http.delete(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        const deletedPromptId = parseInt(response.data);
        const steps = this.stepsSubject.value;
        steps.forEach(step => {
          step.prompts = step.prompts.filter(prompt => prompt.id !== deletedPromptId);
        })
        this.stepsSubject.next(steps);
      })
    )
  }


}
