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
import { IAGateway } from '../../../../core/ports/ia.gateway';

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

  viewState = { // manage the view state of the component
    loadingPrompt: true, //1
    variables: false, //2
    userVariables: false, //3
    iaResponse: false, //4
    loadingIaResponse: false //5
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private stepService: StepGateway,
    private userService: UserGateway,
    private iaService: IAGateway,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const promptId = this.route.snapshot.params['promptid']
    // get the prompt with the variables, user variables and ia response
    this.stepService.getPrompt(Number(promptId)).subscribe(
      (response: any) => {
        this.prompt = response.data.prompt
        this.variables = response.data.variables
        this.user_variables = response.data.user_variables
        this.stepId = response.data.step_id
        if (response.data.ia_response) {
          this.ia_response = response.data.ia_response
        }

        // manage the view state

        // 1 hide the loading prompt
        this.viewState.loadingPrompt = false
        // 2 show the variables form
        if (response.data.variables.length > 0)
          this.viewState.variables = true
        // 3 show the user variables, set the form
        if (response.data.user_variables.length > 0)
          this.viewState.userVariables = true
        // 4 show the ia response
        if (response.data.ia_response)
          this.viewState.iaResponse = true
      }
    );
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  selectPrompt(prompt: PromptModel) {
    if (this.user_variables.length === 0) {
      this.alertService.show('Veuillez remplir le formulaire', 'error', 3000, 'right');
      return;
    }
    // build secret prompt with user variables
    const newPrompt: string = this.buildPrompt(prompt, this.user_variables);
    // ask the question
    this.viewState.loadingIaResponse = true;
    this.iaService.ask(newPrompt).subscribe(
      (response: any) => {
        this.ia_response = response.data.content[0]; // .text and .createdAt
        this.viewState.loadingIaResponse = false;
      }
    );


  }



  // UTILS
  replaceVariable(chaine: string | undefined, variables: any) {
    if (!chaine || !variables) return chaine
    // Extraire la clé et la valeur de l'objet variables
    const { key, value } = variables
    // Remplacer la variable dans la chaîne
    const newString = chaine.replace(`{${key}}`, value)
    return newString
  }

  buildPrompt(prompt: PromptModel, allUserVariables: any): string {
    let newPrompt: string | undefined = prompt.secretprompt || undefined;
    // replace variables in prompt
    const userVariables = allUserVariables
      .filter((variable: any) => variable.step_id === prompt.stepId);
    // replace variables in prompt
    if (newPrompt && userVariables) {
      userVariables.forEach((variable: any) => {
        newPrompt = this.replaceVariable(newPrompt, variable);
      });
    }
    return newPrompt || '';
  }

}
