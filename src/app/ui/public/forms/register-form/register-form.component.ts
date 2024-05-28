import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertService } from '../../../../shared/services/alert.service';
import { PhoneCodeCountriesSelectComponent } from '../../../../views/auth-view/register-view/phone-code-countries-select/phone-code-countries-select.component';
import { InputNumberModule } from 'primeng/inputnumber';


@Component({
  selector: 'ui-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumberModule, RouterLink, NgIf, PhoneCodeCountriesSelectComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss'
})
export class RegisterFormComponent {

  registerForm!: FormGroup;
  confirmpassword: FormControl = new FormControl('', [Validators.required]);
  isFormSubmitted = false;
  countryCodePhone: string = '';
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

  setCountryCode(countryCode: string) {
    console.log('countryCode', countryCode);
    this.countryCodePhone = countryCode;
    // this.registerForm.get('phone')?.setValue($event);
  }

  onSubmitRegisterForm() {
    this.isFormSubmitted = true;
    if (this.registerForm.valid) {
      const value = {
        ...this.registerForm.value,
        phone: this.countryCodePhone + this.registerForm.get('phone')?.value.trim().replaceAll(' ', '')
      };
      this.registerFormSubmittedEvent.emit(value);
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
