import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router, RouterOutlet } from '@angular/router';
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
  route = inject(ActivatedRoute)

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
      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationStart) {
      //     console.log('event', event.url)
      //     this.currentUrl = event.url;
      //   }
      // });

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
