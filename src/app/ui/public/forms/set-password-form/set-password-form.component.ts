import { Component, output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordConfirmValidator: ValidatorFn = (
  form: AbstractControl
): null | ValidationErrors => {
  return form.value.password1 === form.value.password2
    ? null
    : { passwordNoMatch: true }
}

interface passwordForm {
  password1: FormControl<string | null>,
  password2: FormControl<string | null>,
}

type payloadPWD = {
  password: string
}

@Component({
  selector: 'ui-set-password-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './set-password-form.component.html',
  styleUrl: './set-password-form.component.scss'
})
export class SetPasswordFormComponent {

  setPasswordFormSubmittedEvent = output<payloadPWD>();
  setPasswordForm: FormGroup;
  isFormSubmitted: boolean = false;


  constructor() {
    this.setPasswordForm = new FormGroup<passwordForm>({
      password1: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
      ]),

      password2: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)
      ]),
    },
      { validators: [passwordConfirmValidator] }
    );
  }

  onSubmitSetPassowrdForm() {
    console.log(this.setPasswordForm);
    this.isFormSubmitted = true;
    if (this.setPasswordForm.valid) {
      const pwd: payloadPWD = {
        password: this.setPasswordForm.get('password1')?.value
      }
      this.setPasswordFormSubmittedEvent.emit(pwd);
    }
  }

  isPasswordPatternVerified(): boolean {
    return !this.setPasswordForm.get('password1')?.hasError('pattern')
      && this.setPasswordForm.get('password1')?.value.length > 0
  }

}
