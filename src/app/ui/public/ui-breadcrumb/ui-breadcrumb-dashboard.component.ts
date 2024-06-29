import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StepModel } from '../../../core/models/step.model';
import { PlanModel } from '../../../core/models/plan.model';
import { PlanService } from '../../../core/adapters/plan.service';
import { Observable } from 'rxjs';
import { AppStateService } from '../../../shared/services/app-state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'ui-breadcrumb-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './ui-breadcrumb-dashboard.component.html',
  styleUrl: './ui-breadcrumb-dashboard.component.scss'
})
export class UiBreadcrumbDashboard {
  route = inject(ActivatedRoute)
  @Input() step!: StepModel;

  ngOnInit(): void {
    console.log(this.route.url)
  }

}



@Component({
  selector: 'ui-breadcrumb-programme',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './ui-breadcrumb-programme.component.html'
})
export class UiBreadcrumbProgramme {

  route = inject(ActivatedRoute)
  appStateService = inject(AppStateService)
  @Input() step!: StepModel;

  programme$: Observable<PlanModel | null> = this.appStateService.programmeInView$;

  ngOnInit(): void {
    console.log(this.route.url)
  }

}
