import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IaService {

  // inject HttpClient
  private http = inject(HttpClient)
  private apiUrl: string = environment.apiUrl;

  ask(question: string) {
    const endpoint = '/ia/ask';
    return this.http.post(`${this.apiUrl}${endpoint}`, { question })
      .pipe(
        tap((response: any) => {
          // log response
          // save response in DB
        })
      );
  }
}
