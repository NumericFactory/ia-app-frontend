import { Component } from '@angular/core';
import { NavbarComponent } from '../../../ui/public/navbar/navbar.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-view.component.html',
  styleUrl: './admin-view.component.scss'
})
export class AdminViewComponent {

}
