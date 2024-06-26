import { Injectable, inject } from '@angular/core';
import { PromptModel, StepModel } from '../models/step.model';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { StepGateway } from '../ports/step.gateway';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserGateway } from '../ports/user.gateway';
import { CategoryModel } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class StepService implements StepGateway {

  userService = inject(UserGateway);

  // inject HttpClient
  private http = inject(HttpClient)
  private apiUrl: string = environment.apiUrl;

  private stepsSubject = new BehaviorSubject<StepModel[]>([]);
  public steps$: Observable<StepModel[]> = this.stepsSubject.asObservable();
  private promptsSubject = new BehaviorSubject<PromptModel[]>([]);
  public prompts$ = this.promptsSubject.asObservable();
  private categoriesSubject = new BehaviorSubject<CategoryModel[]>([]);
  public categories$ = this.categoriesSubject.asObservable();

  private totalPromptsCount = new BehaviorSubject<number>(0);
  public totalPromptsCount$: Observable<number> = this.totalPromptsCount.asObservable();


  constructor() { }

  public getSteps(plans?: string[]): Observable<StepModel[]> {
    console.log('getSteps plans', plans);
    let endpoint = `/steps`;
    if (plans) endpoint = `/steps?plans=${plans.join(',')}`;
    return this.http.get<StepModel[]>(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        this.stepsSubject.next(response as StepModel[]);
      })
    )
  }

  public getStepById(id: number): Observable<StepModel | null> {
    id = Number(id);
    return this.steps$.pipe(
      map((steps: StepModel[]) => steps.find((step: StepModel) => step.id === id) || null)
    );
  }

  public getPrompts(stepId: number): Observable<PromptModel[]> {
    return this.steps$.pipe(
      map((steps: StepModel[]) => {
        const step = steps.find((step: StepModel) => step.id === stepId);
        return step ? step.prompts : [];
      })
    );
  }

  public getPromptById(stepId: number, promptId: number): Observable<PromptModel | null> {
    stepId = Number(stepId);
    promptId = Number(promptId);
    return this.steps$.pipe(
      map((steps: StepModel[]) => {
        const step = steps.find((step: StepModel) => step.id === stepId);
        return step ? step.prompts.find((prompt: PromptModel) => prompt.id === promptId) || null : null;
      })
    );
  }

  fetchCategories(): Observable<any> {
    const endpoint = '/categories';
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        this.categoriesSubject.next(response);
      })
    )
  }

  setCategories(categories: CategoryModel[]): void {
    this.categoriesSubject.next(categories);
  }

  getPromptsByCategory(categoryId: number): Observable<PromptModel[]> {
    const endpoint = `/categories/${categoryId}/prompts`
    return this.http.get<PromptModel[]>(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {

        this.promptsSubject.next(response);
      })
    )
  }

  getPrompt(promptId: number): Observable<PromptModel | null> {
    const endpoint = `/prompts/${promptId}`;
    return this.http.get<PromptModel>(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {

        //this.promptsSubject.next([response]);
      })
    )
  }

  getPromptsTotalCount(): Observable<number> {
    const endpoint = `/prompts/totalcount`;
    return this.http.get(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => this.totalPromptsCount.next(response.data.prompts_total_count)
      )
    );
  }



}
