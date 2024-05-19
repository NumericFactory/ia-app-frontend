import { CommonModule, JsonPipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ReactiveFormsModule, FormGroup } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormUISchema } from "../../../core/models/step.model";
import { UserModel } from "../../../core/models/user.model";
import { UserGateway } from "../../../core/ports/user.gateway";
import { AlertService } from "../../../shared/services/alert.service";
import { DynamicFormQuestionComponent } from "../../../shared/services/question/dynamic-form-question/dynamic-form-question.component";
import { QuestionControlService } from "../../../shared/services/question/question-control.service";
import { QuestionBase } from "../../../shared/services/question/question.model";


/**
 * UserVariablesForm for Unique prompt Component
 * Role : expose a form to collect user variables for a given step
 */
@Component({
  selector: 'ui-unique-prompt-variables-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe,
    MatButtonModule, DynamicFormQuestionComponent
  ],
  template: `
    <div style="padding-top:7px">
      <h3 class="fs-5 mb-0 text-center">Vos informations</h3>
      <p class="text-secondary info-text text-center">
        <i class="bi bi-info-circle-fill text-primary me-2"></i>
        <small>Saisir les informations pour executer le prompt.</small>
      </p>
      <hr>
  
    <form (ngSubmit)="onSubmit()" [formGroup]="userVariablesForm">
  
      @for(question of questions; track question) {
        <app-question [isFormSubmitted]="formIsSubmit" [question]="question" [form]="userVariablesForm"></app-question>
        @if(question.information && question.information.length) {
        <div style="margin-top:-0.55rem; background: #edeae6;" class="alert alert-dark py-1 border-0">
          <p class="m-0">{{question.information}}</p>
        </div>
        }
      }
  
      <div class="form-group d-flex justify-content-end">
          <button type="submit" class="btn btn-primary">Sauvegarder</button>
      </div>
    </form>
  
    <hr>
    <p style="font-size: 0.875rem" class="text-center text-secondary">
    *Renseignez tous les champs requis.
    </p>
  
    <!-- <div *ngIf="payLoad" class="form-row">
      <strong>Saved the following values</strong><br>{{payLoad}}
    </div> -->
  </div>
    `,
  styles: [
    `:host {
      display: block;
      background: #f0f8ff;
      border-radius: 8px;
      padding: 8px 16px 16px;
      height: 100%;
    }
    .alert {
      margin-top: 0.5rem;
      padding: 0.5rem;
      font-size: 0.875rem;
    }
    
    input {
      margin: 8px 0;
    }
    
    button + button {
      margin-left: 8px;
    } `]
})
export class UniquePromptUserVariablesForm {

  @Input() variables!: FormUISchema[];
  @Input() user_variables!: any[];
  @Input() stepId!: number;
  @Output() formValidEvent = new EventEmitter<boolean>();
  user: UserModel | null = this.userService.getUserFromSubject();
  userVariablesForm!: FormGroup;

  formIsSubmit: boolean = false;
  questions: QuestionBase<string>[] = [];

  constructor(
    public qcs: QuestionControlService,
    private userService: UserGateway,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    // create questions
    this.variables.forEach((variable: FormUISchema) => {
      let question = new QuestionBase<string>({
        variable_id: variable.id,
        key: variable.key,
        label: variable.label,
        controlType: variable.controltype,
        type: variable.type,
        required: variable.required,
        order: variable.order,
        //options: [{ key: 'user', value: 'User' }],
        information: variable.information
      });
      this.questions.push(question);
    });

    // create userVariablesForm
    this.userVariablesForm = this.qcs.toFormGroup(
      this.questions as QuestionBase<string>[]
    );
    // fill form with user variables
    this.logKeyValuePairs(this.userVariablesForm);

    // if form is invalid, emit event
    this.userVariablesForm.valueChanges.subscribe(() => {
      this.userVariablesForm.invalid ? this.formValidEvent.emit(false) : null;
    });
  }

  //Submit form
  onSubmit() {
    this.formIsSubmit = true;
    if (this.userVariablesForm.valid) {
      const payload: any = {};
      for (const [key, value] of Object.entries(this.userVariablesForm.value)) {
        payload[key] = { value }
      }
      this.userService.postStepUserVariables(this.stepId, payload).subscribe((response) => {
        this.formValidEvent.emit(true);
      });
    }
    else {
      this.formValidEvent.emit(false);
      this.alertService.show('Veuillez renseigner tous les champs requis', 'error');
    }
  }




  /********* UTIL******* */
  /**
   * fill form with user variables
   * @param group 
   */
  logKeyValuePairs(group: FormGroup): void {

    // loop through each key in the FormGroup
    Object.keys(group.controls).forEach((key: any) => {
      // Get a reference to the control using the FormGroup.get() method
      const abstractControl = group.get(key);
      // If the control is an instance of FormGroup i.e a nested FormGroup
      // then recursively call this same method (logKeyValuePairs) passing it
      // the FormGroup so we can get to the form controls in it
      if (abstractControl instanceof FormGroup) {
        this.logKeyValuePairs(abstractControl);
        // If the control is not a FormGroup then we know it's a FormControl
      } else {
        //
        abstractControl?.setValue(this.user?.variables.find((v) => v.id == key)?.value);
      }
    });
  }

}


