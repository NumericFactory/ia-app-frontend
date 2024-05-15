import { Component } from '@angular/core';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { AsyncPipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiStepCardComponent } from '../../../../ui/public/ui-step-card/ui-step-card.component';
import { CategoryModel } from '../../../../core/models/category.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserGateway } from '../../../../core/ports/user.gateway';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [AsyncPipe, LowerCasePipe, RouterLink, UiStepCardComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {

  steps$ = this.stepService.steps$;
  categories$: Observable<CategoryModel[]> = this.stepService.categories$;
  user$ = this.userService.user$;

  constructor(private stepService: StepGateway, private userService: UserGateway) { }

  ngOnInit(): void {

    this.stepService.getSteps().subscribe();
    this.stepService.fetchCategories().subscribe();

  }

  pluralize(count: number, word: string): string {
    return count <= 1 ? word : word + 's';
  }

}
