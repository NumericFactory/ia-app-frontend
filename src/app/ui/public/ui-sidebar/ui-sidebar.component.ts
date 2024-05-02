import { Component } from '@angular/core';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './ui-sidebar.component.html',
  styleUrl: './ui-sidebar.component.scss'
})
export class UiSidebarComponent {

  user$ = this.authService.user$;
  constructor(private authService: AuthGateway) { }

}
