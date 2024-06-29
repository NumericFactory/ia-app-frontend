import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlanModel } from '../../core/models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // sidebarmenu state
  isMenuOpenedSubject = new BehaviorSubject<boolean>(true);
  isMenuOpened$ = this.isMenuOpenedSubject.asObservable();

  programmeInViewSubject = new BehaviorSubject<PlanModel | null>(null);
  programmeInView$ = this.programmeInViewSubject.asObservable();

  constructor() { }

  setIsMenuOpened(value: boolean) {
    this.isMenuOpenedSubject.next(value);
  }

  setProgrammeInView(programme: PlanModel | null) {
    this.programmeInViewSubject.next(programme);
  }

  getProgrammeInView(): PlanModel | null {
    return this.programmeInViewSubject.getValue();
  }
}
