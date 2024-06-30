import { Component } from '@angular/core';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { AsyncPipe, JsonPipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { UiStepCardComponent } from '../../../../ui/public/ui-step-card/ui-step-card.component';
import { CategoryModel } from '../../../../core/models/category.model';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { UiCategoryPromptsListComponent } from '../../../../ui/public/ui-category-prompts-list/ui-category-prompts-list.component';
import { StatCircleComponent } from '../../../../ui/public/ui-stats/ui-stat-circle/ui-stat-circle.component';
import { UiCategoryCardComponent } from '../../../../ui/public/ui-category-card/ui-category-card.component';
import { PlanGateway } from '../../../../core/ports/plan.gateway';
import { PlanModel } from '../../../../core/models/plan.model';
import { AppStateService } from '../../../../shared/services/app-state.service';

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

  subscription: Subscription = new Subscription();
  // get plans
  plans$: Observable<PlanModel[]> = this.planService.plan$;
  // get the current plan
  plan!: PlanModel;
  // get steps
  steps$ = this.stepService.steps$;
  // get categories
  categories$: Observable<CategoryModel[]> = this.stepService.categories$;
  // get user
  user$ = this.userService.user$;
  // check if user data is loaded
  userDataLoaded: boolean = false;

  // count the total number of prompts in the system
  countTotalPrompts$ = this.stepService.totalPromptsCount$;
  // count the number of prompts that have been completed for each step in the user's history
  completedStepPromptsTotalCount = 0;
  // count the number of all prompts each visible step
  visibleStepPromptsTotalCount = 0;

  constructor(
    private route: ActivatedRoute,
    private stepService: StepGateway,
    private userService: UserGateway,
    private planService: PlanGateway,
    private bottomSheet: MatBottomSheet,
    private appState: AppStateService
  ) { }


  ngOnInit(): void {
    // load data after at loaded 
    this.subscription.add(combineLatest([this.route.parent!.params, this.user$])
      .subscribe(([params, user]) => {
        let programmeSlug = params['title'];
        // on all user data loader, do what you want
        if (user && params['title']) {
          this.userDataLoaded = false;
          // load data after page loaded when user nav to the programme
          this.stepService.getSteps([programmeSlug]).subscribe();
          this.stepService.fetchCategories().subscribe();
          this.stepService.getPromptsTotalCount().subscribe();
          this.plan = user?.plans.find(plan => plan.slug === programmeSlug);
          this.appState.setProgrammeInView(this.plan);
        }
      })
    );

    // stats on the number of prompts completed and visible
    this.subscription.add(combineLatest([this.user$, this.steps$]).subscribe(([user, steps]) => {
      this.userDataLoaded = false;
      let stepPrompts: any = [];
      //console.log('user', user);
      console.log('steps', steps);
      this.completedStepPromptsTotalCount = 0;
      this.visibleStepPromptsTotalCount = 0;
      // 1 count the number of prompts that have been completed 
      // for each step in the user's history
      if (steps.length) {
        // 2 count the number of all prompts in step
        steps.forEach((step) => {
          stepPrompts.push(step.prompts);
        }); // end of steps.forEach

        this.visibleStepPromptsTotalCount = stepPrompts.flat(2).length;
        console.log('user.prompts', user?.prompts);
        console.log('step.prompts', stepPrompts.flat(2));

        // 3 count the number of prompts that have been completed

        this.completedStepPromptsTotalCount = this.countMatchingIds(user?.prompts, stepPrompts.flat(2));
        console.log('completedStepPromptsTotalCount', this.completedStepPromptsTotalCount);
        this.userDataLoaded = true;



      } // end of if (steps.length)
    })); // end of combineLatest

  } // end of ngOnInit

  // Fonction pour vérifier et compter les entrées avec le même id
  countMatchingIds(arrA: any, arrB: any) {
    const idsB = arrB.map((item: any) => item.id); // Extraire les ids du tableau B
    const matchingEntries = arrA.filter((item: any) => idsB.includes(item.id)); // Filtrer les entrées de A qui ont le même id dans B
    return matchingEntries.length; // Retourner le nombre d'entrées correspondantes
  }

  openDialogPromptsByCategory(event: Event, category: CategoryModel): void {
    this.bottomSheet.open(UiCategoryPromptsListComponent, {
      // disableClose: true,
      // maxHeight: '85%',
      closeOnNavigation: true,
      panelClass: 'bottomsheet-user-var',
      data: category,
    });
  }

  isUserHasPlan(plan: PlanModel): boolean {
    const user = this.userService.getUserFromSubject();
    if (!user || !user.plans.length) return false;
    return Boolean(user.plans.find(userPlan => userPlan.id === plan.id));
  }

  getPlanImage(plan: PlanModel): string {
    return plan.imageUrl || 'https://fakeimg.pl/650x300/?text=image&font=lobster';
  }

  pluralize(count: number, word: string): string {
    return count <= 1 ? word : word + 's';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
