import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './ui/public/navbar/navbar.component';
import { AuthGateway } from './core/ports/auth.gateway';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AdminGateway } from './core/ports/admin.gateway';
import { AppStateService } from './shared/services/app-state.service';
import { PlanService } from './core/adapters/plan.service';
import { Observable } from 'rxjs';
import { PlanModel } from './core/models/plan.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  appState = inject(AppStateService);
  bottomSheet = inject(MatBottomSheet);

  authService = inject(AuthGateway)
  adminService = inject(AdminGateway)
  appStateService = inject(AppStateService)
  planService = inject(PlanService)


  router = inject(Router)
  route = inject(ActivatedRoute)

  plans$: Observable<PlanModel[]> = this.planService.plan$;
  user$ = this.authService.user$;
  userDataLoaded: boolean = false;
  currentUrl = '';

  ngOnInit() {
    /**
     * LoadUser and redirect user based on their role
     * If user is not authenticated, redirect to login page
     * If user is authenticated, redirect to dashboard or admin page based on their role
    */
    this.authService.fetchUser()

    // set programmeInView when user navigates to a programme
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.currentUrl = event.url;
        if (event.url.includes('programme')) {
          // find the programme object

          this.plans$.subscribe(plans => {
            const plan = plans.find(plan => plan.slug === event.url.split('/')[2])
            console.log('plan router', plan)
            if (plan)
              this.appStateService.setProgrammeInView(plan)
          })
        }
        else {
          this.appStateService.setProgrammeInView(null)
        }
      }
    });

    (async () => {
      //load user 
      //const user = await this.authService.getUser()
      // redirect user


      // this.authService.isAuth$.subscribe((isAuth) => {
      //   console.log('CURRENT', this.currentUrl)
      //   if (!isAuth && !this.currentUrl.includes('/auth/register')) this.router.navigate(['/auth/login'])
      //   else if (!isAuth && this.currentUrl.includes('/auth/register')) {
      //     // this.router.navigate(['/auth/register'])
      //   }
      //   else {
      //     user?.roles.find(role => role > 1)
      //       ? this.router.navigate(['/dashboard']) // /admin
      //       : this.router.navigate(['/dashboard'])
      //   }
      // })
    })();




    // remove # from url
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     if (!!event.url && event.url.match(/^\/#/)) {
    //       this.router.navigate([event.url.replace('/#', '')]);
    //     }
    //   }
    // });
  }


}
