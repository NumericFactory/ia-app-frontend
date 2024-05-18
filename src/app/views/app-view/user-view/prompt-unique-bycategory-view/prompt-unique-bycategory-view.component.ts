import { Component, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptModel } from '../../../../core/models/step.model';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { AlertService } from '../../../../shared/services/alert.service';
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
    loadingPrompt: true,      //1
    variables: false,         //2
    userVariables: false,     //3
    iaResponse: false,        //4
    loadingIaResponse: false  //5
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

    this.userService.user$.subscribe(
      (user) => {
        this.user_variables = user?.variables ?? []
      }
    )
    // get the prompt with the *variables, *user variables and *ia response
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

  formValidAction(event: any) {
    console.log('form valid', event);
    this.viewState.userVariables = event
    console.log('view state', this.viewState);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  selectPrompt(prompt: PromptModel) {
    if (this.user_variables.length === 0 || this.viewState.userVariables === false) {
      this.alertService.show('Veuillez remplir le formulaire', 'error', 3000, 'right');
      return;
    }
    // build secret prompt with user variables
    const newPrompt: string = this.buildPrompt(prompt, this.user_variables);
    console.log('new prompt', newPrompt);
    // ask the question
    this.viewState.loadingIaResponse = true;
    this.iaService.ask(newPrompt).subscribe(
      (response: any) => {
        this.ia_response = response.data.content[0]; // .text and .createdAt
        this.viewState.loadingIaResponse = false;
        // save the ia response
        const payloadAIResponse = {
          ia_response: response.data.content[0].text,
          ia_model: response.data.model,
          tokens_count_input: response.data.usage.input_tokens,
          tokens_count_output: response.data.usage.output_tokens
        };
        this.userService.postUserPromptAIResponse(
          this.stepId,
          prompt.id,
          { prompt: { ...payloadAIResponse } }
        ).subscribe();
      }
    );


  }



  // UTILS


  buildPrompt(prompt: PromptModel, allUserVariables: any): string {
    let newPrompt: string | undefined = prompt.secretprompt || undefined;
    // replace step_user_variables and user_settings in prompt
    const userVariables = allUserVariables.filter((variable: any) => variable.step_id === prompt.stepId);
    const userSettings = this.user?.settings;
    let userVariablesAndSettings = [...userVariables];
    if (userSettings) {
      userVariablesAndSettings = [...userVariables, ...userSettings]
    }
    console.log('userVariablesAndSettings', userVariablesAndSettings);
    // replace variables in prompt
    if (newPrompt && userVariablesAndSettings) {
      userVariablesAndSettings.forEach((variable: any) => {
        newPrompt = this.replaceVariable(newPrompt, variable);
      });
    }
    return newPrompt || '';
  }


  // replace a variable in a string
  replaceVariable(chaine: string | undefined, variables: any) {
    if (!chaine || !variables) return chaine
    // Extraire la clé et la valeur de l'objet variables
    const { key, value } = variables
    // Remplacer la variable dans la chaîne
    const newString = chaine.replace(`{${key}}`, value)
    return newString
  }

}
