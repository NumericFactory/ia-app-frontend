import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiSidebarComponent } from '../../../ui/public/ui-sidebar/ui-sidebar.component';
import { NavbarComponent } from '../../../ui/public/navbar/navbar.component';
import { UserGateway } from '../../../core/ports/user.gateway';
import { AppStateService } from '../../../shared/services/app-state.service';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [RouterOutlet, UiSidebarComponent, NavbarComponent, AsyncPipe],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent {

  userService = inject(UserGateway);
  user$ = this.userService.user$;
  isMenuOpened$ = this.appState.isMenuOpened$;

  constructor(private appState: AppStateService) { }

  ngOnInit() {
    // load user variables values into the store
    //this.userService.fetchUserVariables().subscribe();
  }

}
