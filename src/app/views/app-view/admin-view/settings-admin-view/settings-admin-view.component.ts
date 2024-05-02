import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-admin-view',
  standalone: true,
  imports: [NgFor],
  templateUrl: './settings-admin-view.component.html',
  styleUrl: './settings-admin-view.component.scss'
})
export class SettingsAdminViewComponent {

  providers: any[] = [
    { id: 1, name: 'chatGPT', api_key: 'sk-xxxxxx', api_secret_key: 'sk-xxxxxx', model: 'gpt-3', status: true },
    { id: 2, name: 'Claude AI', api_key: 'sk-xxxxxx', api_secret_key: 'sk-xxxxxx', model: 'Opus', status: true },

  ]

}
