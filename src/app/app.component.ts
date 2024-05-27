import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './ui/public/navbar/navbar.component';
import { AuthGateway } from './core/ports/auth.gateway';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AdminGateway } from './core/ports/admin.gateway';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  bottomSheet = inject(MatBottomSheet);

  authService = inject(AuthGateway)
  adminService = inject(AdminGateway)
  router = inject(Router)

  user$ = this.authService.user$;
  userDataLoaded: boolean = false;

  ngOnInit() {
    /**
     * LoadUser and redirect user based on their role
     * If user is not authenticated, redirect to login page
     * If user is authenticated, redirect to dashboard or admin page based on their role
     */
    (async () => {
      //load user 
      const user = await this.authService.getUser()
      // redirect user
      this.authService.isAuth$.subscribe((isAuth) => {
        if (!isAuth) this.router.navigate(['/auth/login'])
        else {
          user?.roles.find(role => role > 1)
            ? this.router.navigate(['/dashboard'])
            : this.router.navigate(['/dashboard'])
        }
      })
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
