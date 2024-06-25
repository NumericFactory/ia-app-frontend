import { Component } from '@angular/core';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { AsyncPipe, JsonPipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiStepCardComponent } from '../../../../ui/public/ui-step-card/ui-step-card.component';
import { CategoryModel } from '../../../../core/models/category.model';
import { Observable, combineLatest } from 'rxjs';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { UiCategoryPromptsListComponent } from '../../../../ui/public/ui-category-prompts-list/ui-category-prompts-list.component';
import { StatCircleComponent } from '../../../../ui/public/ui-stats/ui-stat-circle/ui-stat-circle.component';
import { UiCategoryCardComponent } from '../../../../ui/public/ui-category-card/ui-category-card.component';
import { PlanGateway } from '../../../../core/ports/plan.gateway';
import { PlanModel } from '../../../../core/models/plan.model';

@Component({
  selector: 'app-dashboard-programme-view',
  standalone: true,
  imports: [
    AsyncPipe, LowerCasePipe, JsonPipe,
    UiCategoryCardComponent, RouterLink,
    UiStepCardComponent, MatBottomSheetModule, StatCircleComponent
  ],
  templateUrl: './dashboard-programme-view.component.html',
  styleUrl: './dashboard-programme-view.component.scss'
})
export class DashboardProgrammeViewComponent {

  plans$: Observable<PlanModel[]> = this.planService.plan$;
  steps$ = this.stepService.steps$;
  categories$: Observable<CategoryModel[]> = this.stepService.categories$;
  user$ = this.userService.user$;
  userDataLoaded: boolean = false;

  // count the total number of prompts in the system
  countTotalPrompts$ = this.stepService.totalPromptsCount$;
  // count the number of prompts that have been completed for each step in the user's history
  completedStepPromptsTotalCount = 0;
  // count the number of all prompts each visible step
  visibleStepPromptsTotalCount = 0;

  constructor(
    private stepService: StepGateway,
    private userService: UserGateway,
    private planService: PlanGateway,
    private bottomSheet: MatBottomSheet
  ) { }


  getPlanImage(plan: PlanModel): string {
    return plan.imageUrl || 'https://fakeimg.pl/650x300/?text=image&font=lobster';
  }

  isUserHasPlan(plan: PlanModel): boolean {
    const user = this.userService.getUserFromSubject();
    if (!user || !user.plans.length) return false;
    return Boolean(user.plans.find(userPlan => userPlan.id === plan.id));
  }

  choosePlanProgramme(plan: PlanModel): void {
    this.stepService.getSteps([plan.slug!]).subscribe();
  }

  ngOnInit(): void {
    // get plans
    this.planService.getPlans().subscribe();
    this.planService.plan$.subscribe(plans => {
      console.log('plans', plans);
    });

    // on all user data loader, do what you want
    this.user$.subscribe(user => {
      if ((user && !user.settings) || !user?.settings?.length) {
        if (this.userDataLoaded === false) {
          this.userDataLoaded = true;
          // do what you want - user data is loaded
          console.log('all user data loaded', user);
        }
      }
    });

    this.stepService.getSteps(['basic']).subscribe();
    this.stepService.fetchCategories().subscribe();
    this.stepService.getPromptsTotalCount().subscribe();

    combineLatest([this.user$, this.steps$]).subscribe(([user, steps]) => {
      this.completedStepPromptsTotalCount = 0;
      this.visibleStepPromptsTotalCount = 0;
      // 1 count the number of prompts that have been completed for each step in the user's history
      if (user?.history?.length) {
        user?.history.forEach(((story: any) => {
          if (story.is_visible) {
            this.completedStepPromptsTotalCount += story.prompts.length;
          }
        })) // end of forEach
      }
      // 2 count the number of all prompts each visible step
      steps.forEach((step) => {
        if (step.isVisible) {
          // console.log('step', step);  // step object
          this.visibleStepPromptsTotalCount += step.prompts.length;
        }
      });
      // this.openDialogUserSettings(user!)
    });

  }


  pluralize(count: number, word: string): string {
    return count <= 1 ? word : word + 's';
  }

  openDialogPromptsByCategory(event: Event, category: CategoryModel): void {
    this.bottomSheet.open(UiCategoryPromptsListComponent, {
      //disableClose: true,
      // width: 'auto',
      // minWidth: '750px',
      // maxWidth: '100%',
      // maxHeight: '85%',
      closeOnNavigation: true,
      panelClass: 'bottomsheet-user-var',
      data: category,
    });
  }


}
