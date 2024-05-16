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

  constructor() { }

  public getSteps(): Observable<StepModel[]> {
    const endpoint = `/steps`;
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

  getPromptsByCategory(categoryId: number): Observable<PromptModel[]> {
    const endpoint = `/categories/${categoryId}/prompts`
    return this.http.get<PromptModel[]>(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        console.log('prompts', response)
        this.promptsSubject.next(response);
      })
    )
  }

  getPrompt(promptId: number): Observable<PromptModel | null> {
    const endpoint = `/prompts/${promptId}`;
    return this.http.get<PromptModel>(`${this.apiUrl}${endpoint}`).pipe(
      tap((response: any) => {
        console.log('prompt', response)
        //this.promptsSubject.next([response]);
      })
    )
  }


}
