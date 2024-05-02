import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';



@Component({
  selector: 'ui-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {

  registerForm!: FormGroup;
  confirmpassword: FormControl = new FormControl('', [Validators.required]);
  isFormSubmitted = false;
  @Output() registerFormSubmittedEvent = new EventEmitter();

  constructor(private alertService: AlertService) {
    this.registerForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]),
      phone: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!\\-_]).{8,}$"),
        Validators.minLength(6)
      ]),
    });
  }

  onSubmitRegisterForm() {
    this.isFormSubmitted = true;
    if (this.registerForm.valid) {
      this.registerFormSubmittedEvent.emit(this.registerForm.value);
    }
    else {
      this.alertService.show('Corrigez vos erreurs', 'error');
    }
  }

  // verifyPassword() {
  //   if (this.registerForm.get('password')?.value !== this.confirmpassword.value) {
  //     this.registerForm.get('password')?.setErrors({ notMatch: true });
  //   }
  // }

}
