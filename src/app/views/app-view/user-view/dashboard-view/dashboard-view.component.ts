import { Component } from '@angular/core';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { AsyncPipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UiStepCardComponent } from '../../../../ui/public/ui-step-card/ui-step-card.component';
import { CategoryModel } from '../../../../core/models/category.model';
import { Observable, combineLatest } from 'rxjs';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { Dialog } from '@angular/cdk/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { UiCategoryPromptsListComponent } from '../../../../ui/public/ui-category-prompts-list/ui-category-prompts-list.component';
import { StatCircleComponent } from '../../../../ui/public/ui-stats/ui-stat-circle/ui-stat-circle.component';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [AsyncPipe, LowerCasePipe, RouterLink, UiStepCardComponent, MatBottomSheetModule, StatCircleComponent],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {

  steps$ = this.stepService.steps$;
  categories$: Observable<CategoryModel[]> = this.stepService.categories$;
  user$ = this.userService.user$;

  // count the total number of prompts in the system
  countTotalPrompts$ = this.stepService.totalPromptsCount$;
  // count the number of prompts that have been completed for each step in the user's history
  completedStepPromptsTotalCount = 0;
  // count the number of all prompts each visible step
  visibleStepPromptsTotalCount = 0;

  constructor(
    private stepService: StepGateway,
    private userService: UserGateway,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {

    this.stepService.getSteps().subscribe();
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

  // openDialogPromptsByCategory(event: Event, category: CategoryModel): void {
  //   // open dialog with prompts for category
  //   if (category?.id) {
  //     this.dialog.open(UiCategoryPromptsListComponent, {
  //       //disableClose: true,
  //       width: 'auto',
  //       minWidth: '750px',
  //       maxWidth: '100%',
  //       maxHeight: '85%',
  //       panelClass: 'dialog-user-var',
  //       data: category
  //     });
  //   }
  // }

}
