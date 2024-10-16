import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthGateway } from '../../core/ports/auth.gateway';

@Component({
  selector: 'app-auth-view',
  standalone: true,
  imports: [RouterOutlet],
  template: `
  <main class="flex flex-row items-center justify-center bg-white">

    <aside style="background: url(https://res.cloudinary.com/dg5w52yqv/image/upload/c_scale,w_auto,q_auto,dpr_auto,f_auto/drawsql.app/drawsql-landing-1.png) right center / cover rgb(178, 245, 234);"></aside>

    <div class="form">
      <div class="d-block text-center block-logo">
        <img class="logo" src="/assets/images/logo-virtuoze-white.png">
      </div>
      <router-outlet></router-outlet>
    </div>
</main>`,
  styles: `
  main {
    height: 100vh;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .block-logo {
      width:70%;
      margin-bottom:40px
    }
  img.logo {
    width:100%;
    margin-bottom:40px;
    opacity: .85;
  }
  @media (max-width : 960px) {
    main {
      align-items: flex-start;
      padding-top: 20px;
    }
  }
  aside { display: none; height: 100vh; width:0;}
  @media (min-width: 576px) {
    aside {display: block;width:20%}
    .block-logo {
      width:50%;
      margin-bottom:40px
    }
    
  }
  @media (min-width: 768px) {
    aside { width: 33.333333%;}
    .block-logo {
      width:40%;
      margin-bottom:40px
    }
  }

  @media (min-width:960px) {
    .block-logo {
      width:30%;
      margin-bottom:40px
    }
  }

  @media (min-width: 1199px) {
    aside { width: 50%;}
    .block-logo {
      width:35%;
      margin-bottom:40px
    }
    
  }

  .form {
    width: 100%;
    padding: 20px;
    background: #fff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    flex-direction:column;
    align-items: center;
   
  }
  @media (min-width: 768px) {
    .form {width: 66.666667%;}
  }
  // @media (min-width: 992px) {
  //   .form {width: 50%;}
  // }
  ui-login-form, ui-register-form, ui-setpassword-form {
    width: 100%;
  }
  
  `
})
export class AuthViewComponent {

}
