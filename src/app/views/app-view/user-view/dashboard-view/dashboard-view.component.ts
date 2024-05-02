import { Component } from '@angular/core';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiStepCardComponent } from '../../../../ui/public/ui-step-card/ui-step-card.component';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [AsyncPipe, RouterLink, UiStepCardComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {

  steps$ = this.stepService.steps$;
  constructor(private stepService: StepGateway) { }

  ngOnInit(): void {

    this.stepService.getSteps().subscribe();

  }

}
