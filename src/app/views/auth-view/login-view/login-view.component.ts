import { Component } from '@angular/core';
import { AuthGateway, loginUserPayload } from '../../../core/ports/auth.gateway';
import { LoginFormComponent } from '../../../ui/public/forms/login-form/login-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.scss'
})
export class LoginViewComponent {

  email: null | string = null;
  constructor(private authService: AuthGateway, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(val => this.email = val['email']);
  }


  loginAction(credentials: loginUserPayload) {
    this.authService.login(credentials).subscribe();
  }

}
