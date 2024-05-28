import { AsyncPipe, DatePipe, JsonPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { IAGateway } from '../../../../core/ports/ia.gateway';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminGateway } from '../../../../core/ports/admin.gateway';

import { AuthGateway } from '../../../../core/ports/auth.gateway';

@Component({
  selector: 'app-settings-admin-view',
  standalone: true,
  imports: [NgFor, JsonPipe, AsyncPipe, DatePipe, ReactiveFormsModule, MatRadioModule, MatSlideToggleModule, FormsModule],
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
  selectGeminiModelControl = new FormControl();
  radioChooseProviderControl = new FormControl();

  IsSignupPageVisible: boolean = true;

  // form invitation emails
  addEmailsInvitationForm!: FormGroup;
  invitedSignupUsers: any[] = [];


  constructor(
    private iaService: IAGateway,
    private adminService: AdminGateway,
    private authService: AuthGateway,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    // fetch invited users emails from db
    this.adminService.fetchInvitedSignupUsers().subscribe(
      (response) => {
        console.log(response);
        this.invitedSignupUsers = response
      }
    );

    // form 
    this.addEmailsInvitationForm = this.formBuilder.group({
      emails: ['', Validators.required]
    });

    // get the visibility of the signup page
    this.authService.fetchSignupPageVisibility().subscribe(
      {
        next: (response) => {
          console.log('response fetch', response);
          response === true
            ? this.IsSignupPageVisible = true
            : this.IsSignupPageVisible = false
        }
      }
    );


    this.providers$.subscribe((providers) => {
      for (let provider of providers) {
        if (provider.name.toLowerCase().includes('openai')) {
          console.log(provider); // provider.iamodeId = 1
          this.selectOpenaiModelControl.setValue(provider.iamodelId);
        } else if (provider.name.toLowerCase().includes('claude')) {
          console.log(provider); // provider.iamodeId = 4
          this.selectClaudeModelControl.setValue(provider.iamodelId);
        } else if (provider.name.toLowerCase().includes('gemini')) {
          console.log(provider); // provider.iamodeId = 4
          this.selectGeminiModelControl.setValue(provider.iamodelId);
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
  } // end ngOnInit



  setEmailsInvitInDBAction() {
    let emails = this.addEmailsInvitationForm.value.emails.trim().replaceAll(' ', '').split('\n');
    emails = emails.map((email: string) => { return { email: email.trim() } })
    this.adminService.inviteSignupUsers(emails).subscribe((response) => {
      this.invitedSignupUsers = response;
      this.addEmailsInvitationForm.reset();
    }
    );
  }

  changeSignupVisibilityAction() {
    this.IsSignupPageVisible = !this.IsSignupPageVisible;
    this.adminService.setSignupPageVisibility(this.IsSignupPageVisible).subscribe(
      {
        next: (response) => {
          //console.log('response', response);
          // response == true
          //   ? this.IsSignupPageVisible = true
          //   : this.IsSignupPageVisible = false;
        },
        error: (error) => { this.IsSignupPageVisible = this.IsSignupPageVisible; }
      }
    );
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
    if (provider.name.toLowerCase().includes('gemini')) {
      console.log(provider.id, Number(this.selectGeminiModelControl.value));
      this.iaService.updateIaProviderModel(provider.id, Number(this.selectGeminiModelControl.value)).subscribe();
    }

  }


}
