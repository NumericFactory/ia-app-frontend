import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StepGateway } from '../../../../core/ports/step.gateway';
import { Observable } from 'rxjs';
import { FormUISchema, StepModel } from '../../../../core/models/step.model';
import { AsyncPipe, CommonModule, JsonPipe, NgFor, NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { UserModel } from '../../../../core/models/user.model';
import { AuthGateway } from '../../../../core/ports/auth.gateway';
import { QuestionBase } from '../../../../shared/services/question/question.model';
import { QuestionControlService } from '../../../../shared/services/question/question-control.service';
import { DynamicFormQuestionComponent } from '../../../../shared/services/question/dynamic-form-question/dynamic-form-question.component';
import { UserGateway } from '../../../../core/ports/user.gateway';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-step-view',
  standalone: true,
  imports: [AsyncPipe, RouterLink, JsonPipe, ReactiveFormsModule, NgIf],
  templateUrl: './step-view.component.html',
  styleUrl: './step-view.component.scss'
})
export class StepViewComponent {

  user: UserModel | null = this.auth.getUserFromSubject();
  stepId!: number;
  step$!: Observable<StepModel | null>;
  step: StepModel | null = null;

  isFormCompleted: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private stepService: StepGateway,
    private dialog: Dialog,
    private auth: AuthGateway,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.stepId = this.route.snapshot.params['id'];
    this.step$ = this.stepService.getStepById(this.stepId);
    this.stepService.getStepById(this.stepId).subscribe((step) => {
      this.step = step;
    });
  }

  openVariablesModal(
    user: UserModel | null,
    title: string = 'Renseignez vos informations',
    message: string = 'Validez pour mettre à jour',
    modalTextbutton: string = 'Valider'
  ) {
    console.log('step', this.step);
    const dialogRef = this.dialog.open(UserVariablesDialog, {
      width: '650px',
      minWidth: '350px',
      maxWidth: '95%',
      maxHeight: '85%',
      panelClass: 'dialog-user-var',
      data: { step: this.step, user, modalTitle: title, modalMessage: message, modalTextbutton }
    });

    dialogRef.closed.subscribe((result: any) => {
      if (!result) return;
      let payload = result;
      console.log('payload', payload)
      this.isFormCompleted = true;
    })
  }

  isThisStepHasUserVariables(step: StepModel): boolean {
    return Boolean(this.user?.variables.find((v) => v.step_id == step.id));
  }

  goToPromptView(step: StepModel) {
    if (!this.isThisStepHasUserVariables(step)) {
      this.openVariablesModal(this.user);
      this.alertService.show('Veuillez renseigner vos informations', 'info');
      return;
    }
    else {
      // navigate to prompt view
      this.router.navigate(['/dashboard/step', step.id, 'prompt']);

    }

  }

}



/**
 * UserVariablesDialog Component
 * Role : expose a form to collect user variables for a given step
 */
@Component({
  selector: 'ui-user-variables-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe,
    MatButtonModule, DynamicFormQuestionComponent
  ],
  template: `
  <div>
    <h3 class="fs-5 mb-0">{{data.modalTitle}}</h3>
    <p class="text-secondary info-text">
      <i class="bi bi-info-circle-fill text-primary"></i>
      {{data.modalMessage}}
    </p>
    <hr>

  <form (ngSubmit)="onSubmit()" [formGroup]="userVariablesForm">

    @for(question of questions; track question) {
      <app-question [isFormSubmitted]="formIsSubmit" [question]="question" [form]="userVariablesForm"></app-question>
      @if(question.information && question.information.length) {
      <div style="margin-top:-0.55rem" class="alert alert-dark py-1 border-0">
        <p class="m-0">{{question.information}}</p>
      </div>
      }
    }

    <div class="form-group d-flex justify-content-end">
        <button type="submit" class="btn btn-primary">{{data.modalTextbutton}}</button>
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
    background: #fff;
    border-radius: 8px;
    padding: 8px 16px 16px;
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
export class UserVariablesDialog {

  stepVariables: FormUISchema[] = this.data.step.variables;
  user: UserModel | null = this.data.user;
  userVariablesForm!: FormGroup;
  stepId: number = this.data.step.id;

  formIsSubmit: boolean = false;
  questions: QuestionBase<string>[] = [];

  constructor(
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any,
    public qcs: QuestionControlService,
    private userService: UserGateway,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.stepVariables.forEach((variable: FormUISchema) => {
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
  }

  //Submit form
  onSubmit() {
    console.log('form', this.stepId);
    this.formIsSubmit = true;
    if (this.userVariablesForm.valid) {
      const payload: any = {};
      for (const [key, value] of Object.entries(this.userVariablesForm.value)) {
        payload[key] = { value }
      }
      this.userService.postStepUserVariables(this.stepId, payload).subscribe((response) => {
        this.dialogRef.close(this.userVariablesForm.value);
      });
    }
    else {
      this.alertService.show('Veuillez renseigner tous les champs requis', 'error');
    }
  }


  // Close dialog
  closeDialog() {
    this.dialogRef.close();
  }


  /********* UTIL******* */
  /**
   * fill form with user variables
   * @param group 
   */
  logKeyValuePairs(group: FormGroup): void {
    console.log('user', this.user)
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
        //console.log('Key = ' + key + ' && Value = ' + this.user?.variables.find((v) => v.id == key)?.value);
        abstractControl?.setValue(this.user?.variables.find((v) => v.id == key)?.value);
      }
    });
  }

}

