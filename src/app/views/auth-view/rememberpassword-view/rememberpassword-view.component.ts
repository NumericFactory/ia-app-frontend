import { Component } from '@angular/core';
import { RememberPasswordComponent } from '../../../ui/public/forms/remember-password/remember-password.component';

@Component({
  selector: 'app-rememberpassword-view',
  standalone: true,
  imports: [RememberPasswordComponent],
  templateUrl: './rememberpassword-view.component.html',
  styleUrl: './rememberpassword-view.component.scss'
})
export class RememberpasswordViewComponent {

  rememberPasswordAction(email: string) {
    console.log(`Remember password action for email: ${email}`);
  }

}
