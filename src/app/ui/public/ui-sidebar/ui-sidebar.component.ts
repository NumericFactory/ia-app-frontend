import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { UserGateway } from '../../../core/ports/user.gateway';
import { PromptModel } from '../../../core/models/step.model';
import { StepGateway } from '../../../core/ports/step.gateway';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, NgIf, JsonPipe, AccordionModule],
  templateUrl: './ui-sidebar.component.html',
  styleUrl: './ui-sidebar.component.scss'
})
export class UiSidebarComponent {

  authUser$ = this.authService.user$;
  user$ = this.userService.user$;
  userPromptsHistory: any[] = [];
  // get iconStarElement #starIcon
  @ViewChild('iconStar') iconStar!: ElementRef<HTMLElement>;




  constructor(
    private authService: AuthGateway,
    private userService: UserGateway,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.userService.fetchUserPrompts().subscribe();
    this.userService.fetchUserPromptsHistoryByStep().subscribe();

    this.user$.subscribe((user) => {
      if (user && user.history) {
        this.userPromptsHistory = user.history;
      }
    });
  }

  starMouseOver(iconStar: HTMLElement) {
    console.log('hovered');
    this.renderer.removeClass(iconStar, 'bi-star');
    this.renderer.addClass(iconStar, 'bi-star-fill');
  }
  starMouseOut(iconStar: HTMLElement) {
    console.log('hovered');
    this.renderer.removeClass(iconStar, 'bi-star-fill');
    this.renderer.addClass(iconStar, 'bi-star');
  }

}
