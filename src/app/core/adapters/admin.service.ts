import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { Role, UserModel } from '../models/user.model';
import { AdminGateway } from '../ports/admin.gateway';
import { AlertService } from '../../shared/services/alert.service';
import { FormUISchema, PromptModelAdmin, StepModelAdmin } from '../models/step.model';
// data
// import { stepsTestDataAdmin } from '../data-admin';
import { UserSettingsModel } from '../models/user-settings.model';
import { CategoryModel } from '../models/category.model';

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

  // store the categories
  private categoriesSubject = new BehaviorSubject<CategoryModel[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  // store the plans
  private plansSubject = new BehaviorSubject<any[]>([]);
  public plans$ = this.plansSubject.asObservable();

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
  public fetchUserById(id: number, queryString?: any): Observable<UserModel> {
    const endpoint = `/admin/users/${id}`;
    return this.http.get(`${this.apiUrl}${endpoint}?${queryString}`).pipe(
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
        // add category Object to prompt.category
        this.categoriesSubject.subscribe(categories => {
          response.forEach((step: any) => {
            step.prompts.forEach((prompt: any) => {
              if (prompt.categoryId) prompt.category = categories.find(cat => cat.id === prompt.categoryId);
            })
          })
          this.stepsSubject.next(response as StepModelAdmin[]);
        })
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
          plans: [],
          order: 0,
          isVisible: true,
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
   * role : set the visibility of a step
   * @param id 
   * @param isVisible 
   * @returns 
   */
  setStepVisibility(id: number, isVisible: boolean): Observable<number> {
    const endpoint = `/admin/steps/${id}/visibility`;
    return this.http.put(`${this.apiUrl}${endpoint}`, { isVisible }).pipe(
      tap((response: any) => {
        const steps = this.stepsSubject.value;
        const step = steps.find(s => s.id === id);
        if (step) {
          step.isVisible = isVisible;
          this.stepsSubject.next(steps);
          isVisible ? this.alert.show('Le step est visible', 'success') : this.alert.show('Le step est invisible', 'success');
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
    const prompts: PromptModelAdmin[] = [];
    // let prompts: PromptModelAdmin[] = [];
    // const step = stepsTestDataAdmin.find(step => step.id === stepId)
    // if (step) { prompts = step.prompts }
    // 
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

  getUserParametersFields(): Observable<any> {
    const endpoint = '/users/parameters';
    return this.http.get(`${this.apiUrl}${endpoint}`)
  }

  createOrUpdateUserSettings(settings: UserSettingsModel): Observable<any> {
    const endpoint = '/admin/users/parameters';
    return this.http.put(`${this.apiUrl}${endpoint}`, settings).pipe(
      tap((response: any) => {
        this.alert.show('Paramètres utilisateur ajoutés', 'success');
      })
    )
  }


  deleteUserSettings(id: number): Observable<any> {
    const endpoint = '/admin/users/parameters';
    return this.http.delete(`${this.apiUrl}${endpoint}/${id}`).pipe(
      tap((response: any) => {

        this.alert.show('Paramètre utilisateur supprimé', 'success');
      })
    )
  }

  /**
   * 
   * @returns Categories
   */
  fetchCategories(): Observable<any> {
    const endpoint = '/admin/categories';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        this.categoriesSubject.next(response);
      })
    )
  }

  createCategory(newCategory: Omit<any, 'id'>): Observable<any> {
    const endpoint = '/admin/categories';
    return this.http.post(`${this.apiUrl}${endpoint}`, newCategory).pipe(
      tap((response: any) => {
        // create the category
        let categories = this.categoriesSubject.value;
        categories = [response.data, ...categories];
        this.categoriesSubject.next(categories);
        this.alert.show('Catégorie ajoutée', 'success');
      })
    )
  }

  updateCategory(id: number, category: any): Observable<any> {
    const endpoint = '/admin/categories';
    return this.http.put(`${this.apiUrl}${endpoint}/${id}`, category).pipe(
      tap((response: any) => {
        // update the category
        let categories = this.categoriesSubject.value;
        let category = categories.find(c => c.id === id);
        if (category) {
          Object.assign(category, response.data);
        }
        this.categoriesSubject.next(categories);
        this.alert.show('Catégorie mise à jour', 'success');
      })
    )
  }

  deleteCategory(id: number): Observable<any> {
    const endpoint = '/admin/categories';
    return this.http.delete(`${this.apiUrl}${endpoint}/${id}`).pipe(
      tap((response: any) => {

        // update the categories
        let categories = this.categoriesSubject.value;
        categories = categories.filter(c => c.id !== id);
        this.categoriesSubject.next(categories);
        this.alert.show('Catégorie supprimée', 'success');
      })
    )
  }

  addCategoryToPrompt(promptId: number, categoryId: number): Observable<any> {
    const endpoint = `/admin/prompts/${promptId}/category`;
    return this.http.post(`${this.apiUrl}${endpoint}`, { category_id: categoryId }).pipe(
      tap((response: any) => {
        const newCategoryAddedInDB: CategoryModel = response.data;
        const steps = this.stepsSubject.value;
        steps.forEach(step => {
          step.prompts.forEach(prompt => {
            if (prompt.id === promptId) {
              prompt.categoryId = newCategoryAddedInDB.id;
              prompt.category = {
                id: newCategoryAddedInDB.id,
                title: newCategoryAddedInDB.title,
                slug: newCategoryAddedInDB.slug,
                description: newCategoryAddedInDB.description,
                order: newCategoryAddedInDB.order,
                count_prompts: newCategoryAddedInDB.count_prompts
              };
            }
          })
        })
        //set the updated steps'new steps', steps
        this.stepsSubject.next(steps);
        this.alert.show('Catégorie associée au prompt', 'success');
      })
    )
  }

  removeCategoryFromPrompt(promptId: number): Observable<any> {
    const endpoint = `/admin/prompts/${promptId}/category`;
    return this.http.delete(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        const steps = this.stepsSubject.value;
        steps.forEach(step => {
          step.prompts.forEach(prompt => {
            if (prompt.id === promptId) {
              prompt.categoryId = undefined;
              prompt.category = undefined;
            }
          })
        })
        this.alert.show('Catégorie dissociée du prompt', 'success');
      })
    )
  }

  fetchPlans(): Observable<any[]> {
    const endpoint = '/admin/plans';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => this.plansSubject.next(response))
    )
  }

  createPlan(plan: Omit<any, 'id'>): Observable<any> {
    const endpoint = '/admin/plans';
    console.log('plan', plan);
    return this.http.post(`${this.apiUrl}${endpoint}`, plan).pipe(
      tap((response: any) => {
        this.alert.show('Plan ajouté', 'success');
        const plans = this.plansSubject.value;
        this.plansSubject.next([...plans, response.data]);
      })
    )
  }

  updatePlan(id: number, plan: any): Observable<any> {
    const endpoint = '/admin/plans';
    return this.http.put(`${this.apiUrl}${endpoint}/${id}`, plan).pipe(
      tap((response: any) => {
        this.alert.show('Plan mis à jour', 'success');
      })
    )
  }

  deletePlan(id: number): Observable<any> {
    const endpoint = '/admin/plans';
    return this.http.delete(`${this.apiUrl}${endpoint}/${id}`).pipe(
      tap((response: any) => {
        this.alert.show('Plan supprimé', 'success');
        const plans = this.plansSubject.value;
        this.plansSubject.next(plans.filter(plan => plan.id !== id));
      })
    )
  }

  addPlansToStep(stepId: number, planIds: number[]): Observable<any> {
    const endpoint = `/admin/steps/${stepId}/plans`;
    return this.http.post(`${this.apiUrl}${endpoint}`, { plan_ids: planIds })
      .pipe(
        tap((apiResponse: any) => {
          const message = planIds.length >= 1 ? 'Plans associés' : 'Plans dissociés';
          this.alert.show(message);
          const steps = this.stepsSubject.value;
          const step = steps.find(s => s.id === stepId);
          const storedPlans = this.plansSubject.value;
          const buildstepPlansArray = apiResponse.data.map((planId: number) => {
            return storedPlans.find(plan => plan.id === planId)
          });
          if (step) {
            // if step has plans, add the new plans to the existing ones
            step.plans = buildstepPlansArray;
            steps.map(s => s.id === stepId ? step : s);
            this.stepsSubject.next(steps);
          }
        })
      )
  }


  setSignupPageVisibility(isVisible: boolean): Observable<any> {
    const endpoint = '/admin/signup-page-visibility';
    return this.http.put(`${this.apiUrl}${endpoint}`, { isVisible }).pipe(
      tap((response: any) => {
        console.log('response', response.data.isActive);
        Boolean(response.data.isActive) === true
          ? this.alert.show('Page de signup visible', 'success')
          : this.alert.show('Page de signup invisible', 'success');
      }),
      map((response: any) => Boolean(response.data.isActive))
    )
  }

  inviteSignupUsers(emails: string[]): Observable<any> {
    const endpoint = '/admin/invitation-users-signup';
    return this.http.post(`${this.apiUrl}${endpoint}`, { emails }).pipe(
      tap((response: any) => {
        this.alert.show('Invitations envoyées', 'success');
      }),
      map((response: any) => response.data)
    )
  }

  fetchInvitedSignupUsers(): Observable<any> {
    const endpoint = '/admin/invitation-users-signup';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      map((response: any) => response.data)
    )
  }


}
