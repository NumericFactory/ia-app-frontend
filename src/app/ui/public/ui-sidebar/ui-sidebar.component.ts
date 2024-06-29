import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthGateway } from '../../../core/ports/auth.gateway';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { UserGateway } from '../../../core/ports/user.gateway';
import { Router, RouterLink, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { AppStateService } from '../../../shared/services/app-state.service';
import { Observable, Subscription } from 'rxjs';
import { PlanModel } from '../../../core/models/plan.model';
import { PlanGateway } from '../../../core/ports/plan.gateway';

@Component({
  selector: 'ui-sidebar',
  standalone: true,
  imports: [
    AsyncPipe, RouterLink, NgIf, JsonPipe, AccordionModule,
    RouterLink, RouterLinkActive, RouterLinkWithHref
  ],
  templateUrl: './ui-sidebar.component.html',
  styleUrl: './ui-sidebar.component.scss'
})
export class UiSidebarComponent {

  subscription: Subscription = new Subscription();

  plans!: PlanModel[]
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
    private appState: AppStateService,
    private planService: PlanGateway,
    private router: Router
  ) { }

  navigateToProgrammePage(plan: PlanModel) {
    this.router.navigate(['programme', plan.slug]);
  }

  isUserHasPlan(plan: PlanModel): boolean {
    const user = this.userService.getUserFromSubject();
    if (!user || !user.plans.length) return false;
    return Boolean(user.plans.find(userPlan => userPlan.id === plan.id));
  }

  ngOnInit() {
    // get plans
    this.subscription.add(this.planService.plan$.subscribe((plans) => {
      if (plans.length === 0) {
        this.subscription.add(this.planService.getPlans().subscribe());
      }
      this.plans = plans
    }
    ));

    // get user history
    this.user$.subscribe((user) => {
      if (user && user.history) {
        this.userPromptsHistory = user.history.filter((history: any) => history.is_visible == 1);
        this.userPromptsHistoryInvisible = user.history.filter((history: any) => history.is_visible == 0);
      }
    });
  }

  starMouseOver(iconStar: HTMLElement) {
    //this.renderer.removeClass(iconStar, 'bi-star');
    //this.renderer.addClass(iconStar, 'bi-star-fill');
  }
  starMouseOut(iconStar: HTMLElement) {
    //this.renderer.removeClass(iconStar, 'bi-star-fill');
    //this.renderer.addClass(iconStar, 'bi-star');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
