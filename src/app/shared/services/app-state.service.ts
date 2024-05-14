import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // sidebarmenu state
  isMenuOpenedSubject = new BehaviorSubject<boolean>(true);
  isMenuOpened$ = this.isMenuOpenedSubject.asObservable();

  constructor() { }

  setIsMenuOpened(value: boolean) {
    this.isMenuOpenedSubject.next(value);
  }
}
