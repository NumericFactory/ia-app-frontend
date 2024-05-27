import { Component } from '@angular/core';
import { NavbarComponent } from '../../../ui/public/navbar/navbar.component';
import { UserSettingsFormComponent } from '../../../ui/public/ui-user-settings-form/ui-user-settings-form.component';

@Component({
  selector: 'app-onboarding-view',
  standalone: true,
  imports: [NavbarComponent, UserSettingsFormComponent],
  templateUrl: './onboarding-view.component.html',
  styleUrl: './onboarding-view.component.scss'
})
export class OnboardingViewComponent {

}
