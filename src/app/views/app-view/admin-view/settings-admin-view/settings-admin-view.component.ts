import { AsyncPipe, JsonPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { IAGateway } from '../../../../core/ports/ia.gateway';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-settings-admin-view',
  standalone: true,
  imports: [NgFor, AsyncPipe, ReactiveFormsModule, MatRadioModule],
  templateUrl: './settings-admin-view.component.html',
  styleUrl: './settings-admin-view.component.scss'
})
export class SettingsAdminViewComponent {

  // providers: any[] = [
  //   { id: 1, name: 'chatGPT', api_key: 'sk-xxxxxx', api_secret_key: 'sk-xxxxxx', model: 'gpt-3', status: true },
  //   { id: 2, name: 'Claude AI', api_key: 'sk-xxxxxx', api_secret_key: 'sk-xxxxxx', model: 'Opus', status: true },
  // ]

  providers$ = this.iaService.getIaProviders();
  models$ = this.iaService.getIaModels();

  selectOpenaiModelControl = new FormControl();
  selectClaudeModelControl = new FormControl();
  radioChooseProviderControl = new FormControl();

  constructor(private iaService: IAGateway) { }

  ngOnInit() {
    this.providers$.subscribe((providers) => {
      for (let provider of providers) {
        if (provider.name.toLowerCase().includes('openai')) {
          console.log(provider); // provider.iamodeId = 1
          this.selectOpenaiModelControl.setValue(provider.iamodelId);
        } else if (provider.name.toLowerCase().includes('claude')) {
          console.log(provider); // provider.iamodeId = 4
          this.selectClaudeModelControl.setValue(provider.iamodelId);
        }
      }

      // get the IA provider active
      this.iaService.getActiveProvider().subscribe((activeProvider) => {
        console.log('ACTIVE PROVIDER', activeProvider);
        this.radioChooseProviderControl.setValue(activeProvider.data.provider.id, { emitEvent: false });
      });

      // choose the provider active
      this.radioChooseProviderControl.valueChanges.subscribe((provider) => {
        console.log(provider);
        this.iaService.updateIaProviderActive(provider).subscribe();
      });
    });
  }

  newModelSelected(provider: any) {
    if (provider.name.toLowerCase().includes('openai')) {
      console.log(provider.id, Number(this.selectOpenaiModelControl.value));
      this.iaService.updateIaProviderModel(provider.id, Number(this.selectOpenaiModelControl.value)).subscribe();
    }
    if (provider.name.toLowerCase().includes('claude')) {
      console.log(provider.id, Number(this.selectClaudeModelControl.value));
      this.iaService.updateIaProviderModel(provider.id, Number(this.selectClaudeModelControl.value)).subscribe();
    }
  }








}
