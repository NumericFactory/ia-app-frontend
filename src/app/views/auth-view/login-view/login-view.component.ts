import { Component } from '@angular/core';
import { AuthGateway, loginUserPayload } from '../../../core/ports/auth.gateway';
import { LoginFormComponent } from '../../../ui/public/forms/login-form/login-form.component';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent {

  constructor(private authService: AuthGateway) { }

  loginAction(credentials: loginUserPayload) {
    console.log(credentials);
    this.authService.login(credentials).subscribe();
  }

}
