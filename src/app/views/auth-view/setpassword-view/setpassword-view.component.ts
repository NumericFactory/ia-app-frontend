import { Component, inject } from '@angular/core';
import { SetPasswordFormComponent } from '../../../ui/public/forms/set-password-form/set-password-form.component';
import { AuthService } from '../../../core/adapters/auth.service';
import { ActivatedRoute } from '@angular/router';

type QueryStr = {
  email: string,
  token: string,
  tokenId: string
}

@Component({
  selector: 'app-setpassword-view',
  standalone: true,
  imports: [SetPasswordFormComponent],
  templateUrl: './setpassword-view.component.html',
  styleUrl: './setpassword-view.component.scss'
})
export class SetpasswordViewComponent {

  route = inject(ActivatedRoute);
  service = inject(AuthService);

  constructor() {
    console.log(this.route.snapshot.queryParams)
  }

  setPasswordAction(password: any) {
    console.log(password);//  {password: '123456'}
    const qs = this.route.snapshot.queryParams as QueryStr
    this.service.setPassword(password, qs.email, qs.token, qs.tokenId)
  }

}
