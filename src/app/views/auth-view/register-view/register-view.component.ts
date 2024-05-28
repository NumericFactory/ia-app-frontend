import { Component } from '@angular/core';
import { AuthGateway, registerUserPayload } from '../../../core/ports/auth.gateway';
import { RegisterFormComponent } from '../../../ui/public/forms/register-form/register-form.component';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.scss'
})
export class RegisterViewComponent {

  isPageVisible!: boolean;
  isUserEmailInvited: boolean = false;

  constructor(private authService: AuthGateway, private route: ActivatedRoute) { }


  ngOnInit() {

    this.route.queryParams.subscribe((params: any) => {
      if (params?.email) {
        const emailInQueryString = params.email
        // ask backend if user is invited by email
        this.authService.checkInvitedSignupUser(emailInQueryString)
          .subscribe((isInvited) => {
            if (isInvited.user) {
              this.isUserEmailInvited = true
            }
          });
      }
    });

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
