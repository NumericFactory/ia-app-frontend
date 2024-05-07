import { Component } from '@angular/core';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { UserGateway } from '../../../core/ports/user.gateway';
import { PromptModel } from '../../../core/models/step.model';
import { StepGateway } from '../../../core/ports/step.gateway';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, NgIf, JsonPipe],
  templateUrl: './ui-sidebar.component.html',
  styleUrl: './ui-sidebar.component.scss'
})
export class UiSidebarComponent {

  authUser$ = this.authService.user$;
  user$ = this.userService.user$;
  prompts: PromptModel[] = [];
  constructor(private authService: AuthGateway, private userService: UserGateway, private stepService: StepGateway) { }

  ngOnInit() {
    this.userService.fetchUserPrompts().subscribe();
  }

}
