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
import { UserVariablesDialog } from '../step-view/step-view.component';
import { Dialog } from '@angular/cdk/dialog';
import { AuthService } from '../../../../core/adapters/auth.service';

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

  firstLoad: boolean = true;
  user$ = this.userService.user$;
  user!: UserModel;
  // current stepId and promptId (from url)
  stepId!: number;
  // step data and his prompts data array to display (from stepId)
  step!: StepModel;
  promptsList: PromptModel[] = []
  selectedPrompt: PromptModel | undefined;
  countPromptsChecked: number = 0;

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
    private userService: UserGateway,
    private dialog: Dialog
  ) { }

  ngOnInit(): void {
    // get user data from database
    this.user = this.userService.getUserFromSubject() || {} as UserModel;
    this.stepId = this.route.snapshot.params['stepid'];
    const stepAndUserPromptsAiResponses$ = combineLatest([
      this.user$,
      this.stepService.steps$,
      this.userService.fetchUserPrompts()
    ]);

    stepAndUserPromptsAiResponses$.subscribe(([user, steps, promptsAiResponses]) => {
      if (user && this.firstLoad) {
        this.user = user;
        if (steps.length === 0) { this.stepService.getSteps().subscribe(); }
        if (steps.length > 0) {
          this.step = steps.find((step: StepModel) => step.id == this.stepId)!
          this.promptsList = this.step.prompts;
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
          console.log('this.conversationSate.items', this.conversationSate.items);
          this.conversationSate.items.forEach((item: ConversationModel, index: number) => {
            item.checked = item.iaResponse.text.trim() === '' ? false : true;
            item.nextItem = false;
          });
          this.conversationSate.items.forEach((item: ConversationModel, index: number) => {
            if (item.checked) {
              this.countPromptsChecked++
            }
          });
          if (!this.conversationHasIAResponse()) {
            this.selectPrompt(this.promptsList[0]); // select prompt to display the first time, and when the user click on a prompt
          }
          this.setStateOfPrompts();
        } // end if step
      } // end if user
    });

    // get step and user prompts data from database
    // and set this.step, this.promptsList, and this.conversationSate.items


    // this.route.paramMap.subscribe((params: any) => {
    //   // get step id from url
    //   this.stepId = params.params['stepid'];
    //   console.log('this.stepId', this.stepId);
    //   // get step and user prompts data from database
    //   // and set this.step, this.promptsList, and this.conversationSate.items
    //   stepAndUserPromptsAiResponses$.subscribe(([user, steps, promptsAiResponses]) => {
    //     if (user) {
    //       this.user = user;
    //       if (steps) {
    //         //console.log('step', step);
    //         this.step = steps.find((step: StepModel) => step.id === this.stepId)!
    //         this.promptsList = this.step.prompts;
    //         // set conversationSate.items with user question and IA response
    //         this.conversationSate.items = this.promptsList.map((prompt) => {
    //           return {
    //             promptId: prompt.id,
    //             userQuestion: prompt,
    //             iaResponse: {
    //               createdAt: promptsAiResponses.find((AiResponse: any) => AiResponse.id === prompt.id)?.created_at || '',
    //               text: promptsAiResponses.find((AiResponse: any) => AiResponse.id === prompt.id)?.ia_response || ''
    //             },
    //             checked: false,
    //             nextItem: false
    //           }
    //         });
    //         this.conversationSate.items.forEach((item: ConversationModel, index: number) => {
    //           item.checked = item.iaResponse.text.trim() === '' ? false : true;
    //           item.nextItem = false;
    //         });
    //         this.conversationSate.items.forEach((item: ConversationModel, index: number) => {
    //           if (item.checked) {
    //             this.countPromptsChecked++
    //           }
    //         });
    //         if (!this.conversationHasIAResponse()) {
    //           this.selectPrompt(this.promptsList[0]); // select prompt to display the first time, and when the user click on a prompt
    //         }
    //         this.setStateOfPrompts();
    //       } // end if step
    //     } // end if user
    //   });

    // });

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
    this.firstLoad = false;
    this.conversationSate.items.find((item) => item.promptId === prompt.id)!.isLoadingResponse = true;
    this.selectedPrompt = prompt;
    // build secret prompt with user variables
    const newPrompt: string = this.buildPrompt(prompt, this.userService.getUserFromSubject()?.variables);
    // ask the question
    this.loadingGeneral = true;
    this.iaService.ask(newPrompt!, prompt.stepId!, prompt.id).subscribe(
      {
        next: (response: any) => {
          this.loadingGeneral = false;
          console.log('response ASK IA', response.data.content[0].text);
          // updtate conversationSate with IA response
          this.conversationSate.items.find((item) => item.promptId === prompt.id)!.isLoadingResponse = false;
          this.conversationSate.items.find((item) => item.promptId === prompt.id)!.iaResponse.text = response.data.content[0].text;
          this.conversationSate.items.find((item) => item.promptId === prompt.id)!.checked = true;

          // save the IA response in the database
          const payloadAIResponse = {
            ia_response: response.data.content[0].text,
            ia_model: response.data.model,
            tokens_count_input: response.data.usage.input_tokens,
            tokens_count_output: response.data.usage.output_tokens
          };
          // save the IA response in the database
          this.userService.postUserPromptAIResponse(this.step.id, prompt.id, { prompt: { ...payloadAIResponse } })
            .subscribe(
              (response: any) => {
                console.log('response INSCRIPT DB IA', response);
                console.log('payloadAIResponse', payloadAIResponse);
                //this.conversationSate.items.find((item) => item.promptId === prompt.id)!.iaResponse.text = response.data.ia_response;
                this.conversationSate.items.find((item) => item.promptId === prompt.id)!.iaResponse.createdAt = response.data.created_at;
                // //this.setStateOfPrompts();
                // set conversationSate.items with user question and IA response

                // this.conversationSate.items = this.promptsList.map((prompt) => {
                //   if(prompt.id === response.data.id) {
                //     return {
                //       promptId: prompt.id,
                //       userQuestion: prompt,
                //       iaResponse: {
                //         createdAt: response.data.created_at,
                //         text: response.data.ia_response
                //       },
                //       checked: response.data.ia_response == '' ? false : true,
                //       nextItem: false
                //     }
                //   }
                // });
                this.setStateOfPrompts();

              });
          //this.countPromptsChecked++;
        },
        // handle error
        // error: (error) => {
        //   this.loadingGeneral = false;
        //   this.conversationSate.items.find((item) => item.promptId === prompt.id)!.isLoadingResponse = false;
        // }
      }
    );
  }


  conversationHasIAResponse(): boolean {
    return Boolean(this.conversationSate.items.find((item) => item.iaResponse.text !== ''));
  }

  // isThisPromptHasIAResponse(prompt: PromptModel): boolean {
  //   return Boolean(this.conversationSate.items.find((item) => item.promptId === prompt.id && item.iaResponse.text !== ''));
  // }

  setStateOfPrompts(): void {
    let nextIndexTodiscover = this.conversationSate.items.findIndex((item) => item.iaResponse.text === '');
    if (nextIndexTodiscover === -1) return // all prompts have been discovered
    this.conversationSate.items[nextIndexTodiscover].checked = true;
    this.conversationSate.items.forEach((item, index) => {
      //console.log('index', index);
      //console.log('nextIndexTodiscover', nextIndexTodiscover);
      //this.conversationSate.items[index].nextItem = false;
      if (index < nextIndexTodiscover) {
        item.checked = true;

      }
      if (index >= nextIndexTodiscover) {
        item.checked = false;
        this.conversationSate.items[nextIndexTodiscover].nextItem = true;
      }
    });
  }


  openVariablesModal(
    user: UserModel | null,
    title: string = 'Relancer une nouvelle conversation avec l\'IA',
    message: string = 'Modifiez vos données et relancer. Attention vous perdrez les réponses déjà obtenues.',
    modalTextbutton: string = 'Relancer') {


    const dialogRef = this.dialog.open(UserVariablesDialog, {
      width: '850px',
      minWidth: '320px',
      maxWidth: '95%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { step: this.step, user, modalTitle: title, modalMessage: message, modalTextbutton }
    });

    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      let payload = result;

      //this.isVariablesFormCompleted = true;
    })
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
    // replace step_user_variables and user_settings in prompt
    const userVariables = allUserVariables.filter((variable: any) => variable.step_id === prompt.stepId);
    const userSettings = this.user?.settings;
    let userVariablesAndSettings = [...userVariables];
    if (userSettings) {
      userVariablesAndSettings = [...userVariables, ...userSettings]
    }
    // replace variables in prompt
    if (newPrompt && userVariablesAndSettings) {
      userVariablesAndSettings.forEach((variable: any) => {
        newPrompt = this.replaceVariable(newPrompt, variable);
      });
    }
    return newPrompt || '';
  }

}
