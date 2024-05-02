import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'ui-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  loginForm!: FormGroup;
  isFormSubmitted = false;
  @Output() loginFormSubmittedEvent = new EventEmitter();

  constructor(private alertService: AlertService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSubmitLoginForm() {
    this.isFormSubmitted = true;
    if (this.loginForm.valid) {
      this.loginFormSubmittedEvent.emit(this.loginForm.value);
    }
    else {
      this.alertService.show('Corrigez vos erreurs', 'error');
    }
  }

}
