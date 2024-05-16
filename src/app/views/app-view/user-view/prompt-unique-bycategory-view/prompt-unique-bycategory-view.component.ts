import { Component, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormUISchema, PromptModel } from '../../../../core/models/step.model';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { CommonModule, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserModel } from '../../../../core/models/user.model';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { AlertService } from '../../../../shared/services/alert.service';
import { DynamicFormQuestionComponent } from '../../../../shared/services/question/dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService } from '../../../../shared/services/question/question-control.service';
import { QuestionBase } from '../../../../shared/services/question/question.model';
import { UniquePromptUserVariablesForm } from '../../../../ui/public/ui-prompt-unique-view/ui-prompt-unique-form';
import { UiConversationUserComponent } from '../../../../ui/public/ui-prompt-view/ui-conversation-user/ui-conversation-user.component';
import { UiConversationIaComponent } from '../../../../ui/public/ui-prompt-view/ui-conversation-ia/ui-conversation-ia.component';

@Component({
  selector: 'app-prompt-unique-bycategory-view',
  standalone: true,
  imports: [UniquePromptUserVariablesForm, UiConversationUserComponent, UiConversationIaComponent],
  templateUrl: './prompt-unique-bycategory-view.component.html',
  styleUrl: './prompt-unique-bycategory-view.component.scss'
})
export class PromptUniqueBycategoryViewComponent {

  prompt!: PromptModel
  variables: any[] = []
  user_variables: any[] = []
  stepId!: number;
  ia_response: any = null;
  user = this.userService.getUserFromSubject()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stepService: StepGateway,
    private userService: UserGateway,
  ) { }

  ngOnInit() {
    const promptId = this.route.snapshot.params['promptid']
    this.stepService.getPrompt(Number(promptId)).subscribe(
      (response: any) => {
        this.prompt = response.data.prompt
        this.variables = response.data.variables
        this.user_variables = response.data.user_variables
        this.stepId = response.data.step_id
        if (response.data.ia_response) {
          this.ia_response = response.data.ia_response
        }
      }
    );
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  selectPrompt(prompt: PromptModel) {
    console.log(prompt)
  }

}
