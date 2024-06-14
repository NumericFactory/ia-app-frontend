import { Injectable } from '@angular/core';
import { PlanModel } from '../models/plan.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PlanGateway } from '../ports/plan.gateway';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService implements PlanGateway {

  private apiUrl: string = environment.apiUrl;
  private planSubject = new BehaviorSubject<PlanModel[]>([]);
  plan$ = this.planSubject.asObservable();

  constructor(private http: HttpClient) { }

  getPlans(): Observable<PlanModel[]> {
    const endpoint = '/plans';
    return this.http.get<PlanModel[]>(`${this.apiUrl}${endpoint}`).pipe(
      tap((apiResponse: any) => this.planSubject.next(apiResponse as PlanModel[]))
    );
  }


}
