import { Component, Input, inject } from '@angular/core';
import { PromptModel, StepModel } from '../../../../core/models/step.model';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UiBreadcrumbDashboard, UiBreadcrumbProgramme } from '../../ui-breadcrumb/ui-breadcrumb-dashboard.component';

@Component({
  selector: 'ui-header-prompt-view',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UiBreadcrumbDashboard, UiBreadcrumbProgramme],
  templateUrl: './ui-header.component.html',
  styleUrl: './ui-header.component.scss'
})
export class UiHeaderPromptViewComponent {

  @Input() step: StepModel | undefined;
  @Input() promptsToDisplay: PromptModel[] = [];
  @Input() countPromptsChecked: number = 0;

  router = inject(Router)
  route = inject(ActivatedRoute)
  urlNavigateToPromptView: any = ['/dashboard/step', 0, 'prompt'];

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params: any) => {
      (params['title'])
        ? this.urlNavigateToPromptView = [`/programme/${params['title']}/step`, 0, 'prompt']
        : this.urlNavigateToPromptView = ['/dashboard/step', 0, 'prompt'];
    });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
