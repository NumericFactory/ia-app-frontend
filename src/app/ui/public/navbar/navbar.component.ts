import { Component, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

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

  constructor(private authService: AuthGateway, private router: Router) { }

  logoutAction() {
    this.authService.logout().subscribe();
  }

  goToAdminPage() {
    this.router.navigate(['/admin']);
  }

}
