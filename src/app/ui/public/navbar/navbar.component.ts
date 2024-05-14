import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { UserGateway } from '../../../core/ports/user.gateway';
import { AppStateService } from '../../../shared/services/app-state.service';

@Component({
  selector: 'ui-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, JsonPipe, MatMenuModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  @Input() title!: string;
  user$ = this.authService.user$;
  isMenuOpen = true;

  constructor(
    private authService: AuthGateway,
    private router: Router,
    private appState: AppStateService

  ) { }

  logoutAction() {
    this.authService.logout().subscribe();
  }

  goToAdminPage() {
    this.router.navigate(['/admin']);
  }

  openCloseMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.appState.setIsMenuOpened(this.isMenuOpen);
  }

}
