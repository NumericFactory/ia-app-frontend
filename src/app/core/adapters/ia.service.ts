import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { IAGateway } from '../ports/ia.gateway';
import { AlertService } from '../../shared/services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class IaService implements IAGateway {

  // inject HttpClient
  private http = inject(HttpClient)
  private apiUrl: string = environment.apiUrl;

  constructor(private alertService: AlertService) { }

  /**
   * ask()
   * @param question : string
   * @param stepId : number
   * @param promptId : number // question
   * @returns Observable<any>
   */
  ask(question: string, stepId?: number, promptId?: number): Observable<any> {
    const endpoint = '/ia/ask';
    return this.http.post(`${this.apiUrl}${endpoint}`, { question, stepId, promptId })
      .pipe(
        tap((response: any) => {
          // log response
          // save response in DB
        })
      );
  }

  getIaProviders(): Observable<any> {
    const endpoint = '/admin/iaproviders';
    return this.http.get(`${this.apiUrl}${endpoint}`);
  }

  getActiveProvider(): Observable<any> {
    const endpoint = '/admin/iaproviders/active';
    return this.http.get(`${this.apiUrl}${endpoint}`);
  }

  getIaModels(): Observable<any> {
    const endpoint = '/admin/iamodels';
    return this.http.get(`${this.apiUrl}${endpoint}`);
  }

  updateIaProviderModel(providerId: number, modelId: number): Observable<any> {
    const endpoint = `/admin/iaproviders/${providerId}/model`;
    return this.http.put(`${this.apiUrl}${endpoint}`, { modelId }).pipe(
      tap((response: any) => {
        this.alertService.show('Modèle mis à jour', 'success');
      })
    )
  }

  updateIaProviderActive(providerId: number): Observable<any> {
    const endpoint = `/admin/iaproviders/${providerId}/active`;
    return this.http.put(`${this.apiUrl}${endpoint}`, {}).pipe(
      tap((response: any) => {
        this.alertService.show('Fournisseur IA activé', 'success');
      })
    )
  }


}
