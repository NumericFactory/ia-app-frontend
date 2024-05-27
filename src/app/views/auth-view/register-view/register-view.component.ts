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

  isPageVisible!: boolean;

  constructor(private authService: AuthGateway) { }


  ngOnInit() {
    // ask backend if page is visible
    this.authService.fetchSignupPageVisibility()
      .subscribe((isVisible) => {
        console.log('page is visible:', isVisible)
        this.isPageVisible = isVisible
      });

  }

  registerAction(user: registerUserPayload) {
    this.authService.register(user).subscribe();
  }

}
