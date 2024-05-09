import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { PromptModel, StepModel } from '../../../../core/models/step.model';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { IAGateway } from '../../../../core/ports/ia.gateway';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { UiConversationUserComponent } from '../../../../ui/public/ui-prompt-view/ui-conversation-user/ui-conversation-user.component';
import { UiConversationIaComponent } from '../../../../ui/public/ui-prompt-view/ui-conversation-ia/ui-conversation-ia.component';
import { UiHeaderPromptViewComponent } from '../../../../ui/public/ui-prompt-view/ui-header/ui-header.component';
import { UiToolbarPromptViewComponent } from '../../../../ui/public/ui-prompt-view/ui-toolbar/ui-toolbar.component';
import { combineLatest } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { UserModel } from '../../../../core/models/user.model';
import { ScrollTopModule } from 'primeng/scrolltop';

interface IAResponseModel {
  createdAt: string;
  text: string;
}

interface ConversationModel {
  promptId: number;
  userQuestion: PromptModel;
  iaResponse: IAResponseModel;
  isLoadingResponse?: boolean;
  nextItem: boolean;
  checked: boolean
}

@Component({
  selector: 'app-prompt-view',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, AsyncPipe, JsonPipe, NgIf, ProgressBarModule, ScrollTopModule,
    UiConversationUserComponent, UiConversationIaComponent, UiHeaderPromptViewComponent, UiToolbarPromptViewComponent
  ],
  templateUrl: './prompt-view.component.html',
  styleUrl: './prompt-view.component.scss'
})
export class PromptViewComponent {

  user!: UserModel;
  // current stepId and promptId (from url)
  stepId!: number;
  // step data and his prompts data array to display (from stepId)
  step!: StepModel;
  promptsList: PromptModel[] = []
  selectedPrompt: PromptModel | undefined;

  currentPromptIdFragment!: string; // ex: #prompt9

  items: ConversationModel[] = []
  // conversation state (user question and IA response) based on real database returns
  conversationSate = {
    nextItemIndex: 0,
    items: this.items as ConversationModel[]
  }

  loadingGeneral: boolean = false
  // true if the user has already asked a question

  constructor(
    private route: ActivatedRoute,
    private stepService: StepGateway,
    private iaService: IAGateway,
    private userService: UserGateway
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserFromSubject() || {} as UserModel;

    // get step id from url
    this.stepId = this.route.snapshot.params['stepid'];

    // get step and user prompts data from database
    // and set this.step, this.promptsList, and this.conversationSate.items
    const stepAndUserPromptsAiResponses$ = combineLatest([
      this.stepService.getStepById(this.stepId),
      this.userService.fetchUserPrompts()
    ]);
    stepAndUserPromptsAiResponses$.subscribe(([step, promptsAiResponses]) => {
      if (step) {
        this.step = step
        this.promptsList = step.prompts;
        // set conversationSate.items with user question and IA response
        this.conversationSate.items = this.promptsList.map((prompt) => {
          return {
            promptId: prompt.id,
            userQuestion: prompt,
            iaResponse: {
              createdAt: promptsAiResponses.find((AiResponse: any) => AiResponse.id === prompt.id)?.created_at || '',
              text: promptsAiResponses.find((AiResponse: any) => AiResponse.id === prompt.id)?.ia_response || ''
            },
            checked: false,
            nextItem: false
          }
        });
        this.conversationSate.items.forEach((item: ConversationModel, index: number) => {
          item.checked = item.iaResponse.text.trim() === '' ? false : true;
          item.nextItem = false;
        });
        if (!this.conversationHasIAResponse()) {
          this.selectPrompt(this.promptsList[0]); // select prompt to display the first time, and when the user click on a prompt
        }
        this.setStateOfPrompts();
      }
    })
    // get current url fragement for routing
    this.route.fragment.subscribe((fragment: string | null) => {
      if (fragment)
        this.currentPromptIdFragment = fragment; // ex: 'prompt9'
    });
  }

  /**
   * selet a prompt to display
   * @param prompt 
   */
  selectPrompt(prompt: PromptModel): void {
    this.conversationSate.items.find((item) => item.promptId === prompt.id)!.isLoadingResponse = true;
    this.selectedPrompt = prompt;
    // build secret prompt with user variables
    const newPrompt: string = this.buildPrompt(prompt, this.userService.getUserFromSubject()?.variables);
    // ask the question
    this.loadingGeneral = true;
    this.iaService.ask(newPrompt!).subscribe(response => {
      this.loadingGeneral = false;
      // updtate conversationSate with IA response
      this.conversationSate.items.find((item) => item.promptId === prompt.id)!.iaResponse.text = response.data.content[0].text;
      this.conversationSate.items.find((item) => item.promptId === prompt.id)!.isLoadingResponse = false;
      // save the IA response in the database
      const payloadAIResponse = {
        ia_response: response.data.content[0].text,
        ia_model: response.data.model,
        tokens_count_input: response.data.usage.input_tokens,
        tokens_count_output: response.data.usage.output_tokens
      };
      // save the IA response in the database
      this.userService.postUserPromptAIResponse(this.step.id, prompt.id, { prompt: { ...payloadAIResponse } }).subscribe(
        (response: any) => {
          this.conversationSate.items.find((item) => item.promptId === prompt.id)!.iaResponse.createdAt = response.data.created_at;
          this.setStateOfPrompts();

        }
      );
    });
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

  conversationHasIAResponse(): boolean {
    return Boolean(this.conversationSate.items.find((item) => item.iaResponse.text !== ''));
  }

  isThisPromptHasIAResponse(prompt: PromptModel): boolean {
    return Boolean(this.conversationSate.items.find((item) => item.promptId === prompt.id && item.iaResponse.text !== ''));
  }

  setStateOfPrompts(): void {
    let nextIndexTodiscover = this.conversationSate.items.findIndex((item) => item.iaResponse.text === '');
    if (nextIndexTodiscover === -1) return // all prompts have been discovered
    this.conversationSate.items[nextIndexTodiscover].checked = true;
    this.conversationSate.items.forEach((item, index) => {
      this.conversationSate.items[index].nextItem = false;
      if (index < nextIndexTodiscover) {
        item.checked = true;

      }
      if (index >= nextIndexTodiscover) {
        item.checked = false;
      }
    });
    this.conversationSate.items[nextIndexTodiscover].nextItem = true;
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

}
