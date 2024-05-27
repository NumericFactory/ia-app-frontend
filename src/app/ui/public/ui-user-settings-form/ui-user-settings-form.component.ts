import { CommonModule, JsonPipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormUISchema } from '../../../core/models/step.model';
import { UserModel } from '../../../core/models/user.model';
import { UserGateway } from '../../../core/ports/user.gateway';
import { AlertService } from '../../../shared/services/alert.service';
import { DynamicFormQuestionComponent } from '../../../shared/services/question/dynamic-form-question/dynamic-form-question.component';
import { QuestionControlService } from '../../../shared/services/question/question-control.service';
import { QuestionBase } from '../../../shared/services/question/question.model';
import { FormUserSettingSchema } from '../../../core/models/user-settings.model';
import { AdminGateway } from '../../../core/ports/admin.gateway';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Router } from '@angular/router';

/**
 * UserVariablesDialog Component
 * Role : expose a form to collect user variables for a given step
 */
@Component({
  selector: 'ui-user-settings-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCheckboxModule, JsonPipe,
    MatButtonModule, DynamicFormQuestionComponent,
    MatDialogTitle, MatDialogContent
  ],
  templateUrl: './ui-user-settings-form.component.html',
  styleUrl: './ui-user-settings-form.component.scss'
})

export class UserSettingsFormComponent {

  userSettingsFields!: FormUserSettingSchema[];
  user: UserModel | null = this.auth.getUserFromSubject();

  userSettingsForm!: FormGroup;

  formIsSubmit: boolean = false;
  questions: QuestionBase<string>[] = [];

  // modalTitle: string = this.data.title ?? null;

  constructor(
    public qcs: QuestionControlService,
    private adminService: AdminGateway,
    private auth: UserGateway,
    private userService: UserGateway,
    private alertService: AlertService,
    private router: Router
    // @Inject(DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {

    // get user settings fields
    this.adminService.getUserParametersFields().subscribe((fields) => {
      this.userSettingsFields = fields;

      // create form questions
      this.userSettingsFields?.forEach((variable: FormUISchema) => {
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

      // create userSettingsForm
      this.userSettingsForm = this.qcs.toFormGroup(
        this.questions as QuestionBase<string>[]
      );

      // fill form with user variables
      this.logKeyValuePairs(this.userSettingsForm);
    });


  }

  //Submit form
  onSubmit() {
    this.formIsSubmit = true;
    if (this.userSettingsForm.valid) {
      const payload: any = {};
      for (const [key, value] of Object.entries(this.userSettingsForm.value)) {
        payload[key] = { value }
      }
      this.userService.postUserSettings(payload).subscribe(
        () => this.router.navigate(['/dashboard']),
      );
    }
    else {
      this.alertService.show('Veuillez renseigner tous les champs requis', 'error');
    }
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
        console.log('Key = ' + key + ' && Value = ' + this.user?.settings.find((v) => v.id == key)?.value);
        abstractControl?.setValue(this.user?.settings.find((v) => v.id == key)?.value);
      }
    });
  }

}

