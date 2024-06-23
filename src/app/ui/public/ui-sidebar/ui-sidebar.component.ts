import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { UserGateway } from '../../../core/ports/user.gateway';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { AppStateService } from '../../../shared/services/app-state.service';
import { Observable } from 'rxjs';
import { PlanModel } from '../../../core/models/plan.model';
import { PlanGateway } from '../../../core/ports/plan.gateway';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, NgIf, JsonPipe, AccordionModule],
  templateUrl: './ui-sidebar.component.html',
  styleUrl: './ui-sidebar.component.scss'
})
export class UiSidebarComponent {

  plans$: Observable<PlanModel[]> = this.planService.plan$;
  authUser$ = this.authService.user$;
  user$ = this.userService.user$;
  userPromptsHistory: any[] = [];
  userPromptsHistoryInvisible: any[] = [];
  // get iconStarElement #starIcon
  @ViewChild('iconStar') iconStar!: ElementRef<HTMLElement>;

  isMenuOpened$ = this.appState.isMenuOpened$;


  constructor(
    private authService: AuthGateway,
    private userService: UserGateway,
    private renderer: Renderer2,
    private appState: AppStateService,
    private planService: PlanGateway
  ) { }

  isUserHasPlan(plan: PlanModel): boolean {
    const user = this.userService.getUserFromSubject();
    if (!user || !user.plans.length) return false;
    return Boolean(user.plans.find(userPlan => userPlan.id === plan.id));
  }

  ngOnInit() {
    this.userService.fetchUserPrompts().subscribe();
    this.userService.fetchUserPromptsHistoryByStep().subscribe();

    this.user$.subscribe((user) => {
      if (user && user.history) {
        this.userPromptsHistory = user.history.filter((history: any) => history.is_visible == 1);
        this.userPromptsHistoryInvisible = user.history.filter((history: any) => history.is_visible == 0);
      }
    });
  }

  starMouseOver(iconStar: HTMLElement) {

    this.renderer.removeClass(iconStar, 'bi-star');
    this.renderer.addClass(iconStar, 'bi-star-fill');
  }
  starMouseOut(iconStar: HTMLElement) {

    this.renderer.removeClass(iconStar, 'bi-star-fill');
    this.renderer.addClass(iconStar, 'bi-star');
  }

}
