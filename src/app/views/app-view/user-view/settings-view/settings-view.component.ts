import { Component } from '@angular/core';
import { UserSettingsFormComponent } from '../../../../ui/public/ui-user-settings-form/ui-user-settings-form.component';
import { AuthGateway } from '../../../../core/ports/auth.gateway';
import { UserModel } from '../../../../core/models/user.model';
import { AdminGateway } from '../../../../core/ports/admin.gateway';
import { FormUserSettingSchema } from '../../../../core/models/user-settings.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [UserSettingsFormComponent, JsonPipe],
  templateUrl: './settings-view.component.html',
  styleUrl: './settings-view.component.scss'
})
export class SettingsViewComponent {

  userSettingsFields!: FormUserSettingSchema[];
  user: UserModel | null = this.auth.getUserFromSubject();

  constructor(private auth: AuthGateway, private adminService: AdminGateway) { }

  ngOnInit(): void {
    // get user settings fields
    this.adminService.getUserParametersFields().subscribe((fields) => {
      this.userSettingsFields = fields;
    });

  }

}
