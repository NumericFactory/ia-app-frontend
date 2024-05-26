import { Component, Input, inject } from '@angular/core';
import { PromptModel, StepModel } from '../../../../core/models/step.model';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'ui-header-prompt-view',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './ui-header.component.html',
  styleUrl: './ui-header.component.scss'
})
export class UiHeaderPromptViewComponent {

  @Input() step: StepModel | undefined;
  @Input() promptsToDisplay: PromptModel[] = [];
  @Input() countPromptsChecked: number = 0;

  router = inject(Router)
  route = inject(ActivatedRoute)

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
