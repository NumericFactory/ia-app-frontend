import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();
  private _isLoadingStopped = new BehaviorSubject<boolean>(true);
  public isLoadingStopped$ = this._isLoadingStopped.asObservable();

  setLoader(value: boolean) {
    this._isLoading.next(value);
    this._isLoadingStopped.next(!value);
  }
}
