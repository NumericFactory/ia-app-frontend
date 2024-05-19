import { Component } from '@angular/core';
import { AuthGateway, registerUserPayload } from '../../../core/ports/auth.gateway';
import { RegisterFormComponent } from '../../../ui/public/forms/register-form/register-form.component';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.scss'
})
export class RegisterViewComponent {

  constructor(private authService: AuthGateway) { }

  registerAction(user: registerUserPayload) {

    this.authService.register(user).subscribe();
  }

}
