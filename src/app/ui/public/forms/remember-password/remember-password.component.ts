import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ui-remember-password-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './remember-password.component.html',
  styleUrl: './remember-password.component.scss'
})
export class RememberPasswordComponent {
  rememberPasswordForm!: FormGroup;
  isFormSubmitted = false;
  @Output() rememberPasswordFormSubmittedEvent = new EventEmitter();

  constructor() {
    this.rememberPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmitRememberPassowrdForm() {
    this.isFormSubmitted = true;
    this.rememberPasswordFormSubmittedEvent.emit(this.rememberPasswordForm.value);
  }
}
