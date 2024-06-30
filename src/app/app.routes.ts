import { NavigationStart, Router, Routes } from '@angular/router';
import { LoginViewComponent } from './views/auth-view/login-view/login-view.component';
import { RegisterViewComponent } from './views/auth-view/register-view/register-view.component';
import { AdminViewComponent } from './views/app-view/admin-view/admin-view.component';
import { AuthViewComponent } from './views/auth-view/auth-view.component';
import { UserViewComponent } from './views/app-view/user-view/user-view.component';
import { RememberpasswordViewComponent } from './views/auth-view/rememberpassword-view/rememberpassword-view.component';
import { authGuard } from './shared/guards/auth.guard';
import { UsersAdminViewComponent } from './views/app-view/admin-view/users-admin-view/users-admin-view.component';
import { roleGuard } from './shared/guards/role.guard';
import { StepViewComponent } from './views/app-view/user-view/step-view/step-view.component';
import { PromptViewComponent } from './views/app-view/user-view/prompt-view/prompt-view.component';
import { DashboardViewComponent } from './views/app-view/user-view/dashboard-view/dashboard-view.component';
import { StepAdminViewComponent } from './views/app-view/admin-view/step-admin-view/step-admin-view.component';
import { SettingsAdminViewComponent } from './views/app-view/admin-view/settings-admin-view/settings-admin-view.component';
import { SettingsViewComponent } from './views/app-view/user-view/settings-view/settings-view.component';
import { PromptUniqueBycategoryViewComponent } from './views/app-view/user-view/prompt-unique-bycategory-view/prompt-unique-bycategory-view.component';
import { OnboardingViewComponent } from './views/app-view/onboarding-view/onboarding-view.component';
import { onboardingPassedGuard } from './shared/guards/onboarding-passed.guard';
import { PlansListComponent } from './ui/admin/plans/plans-list/plans-list.component';
import { inject } from '@angular/core';
import { AuthService } from './core/adapters/auth.service';
import { DashboardProgrammeViewComponent } from './views/app-view/user-view/dashboard-programme-view/dashboard-programme-view.component';
import { hasPlanGuard } from './shared/guards/has-plan.guard';

export const routes: Routes = [


    // Auth Routes
    { path: 'onboarding', component: OnboardingViewComponent },
    {
        path: 'auth',
        component: AuthViewComponent,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginViewComponent },
            { path: 'register', component: RegisterViewComponent },
            { path: 'remember-password', component: RememberpasswordViewComponent }
        ]
    },
    // user Routes
    {
        path: 'user',
        canActivate: [authGuard, onboardingPassedGuard],
        component: UserViewComponent,
        children: [
            { path: '', redirectTo: 'settings', pathMatch: 'full' },
            { path: 'settings', component: SettingsViewComponent },
        ]
    },

    // programmes USER Routes
    {
        path: 'programme/:title',
        canActivate: [authGuard, hasPlanGuard],
        component: UserViewComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            {
                path: 'home',
                loadComponent: () => import('./views/app-view/user-view/dashboard-programme-view/dashboard-programme-view.component')
                    .then(m => m.DashboardProgrammeViewComponent),
                pathMatch: 'full'
            },
            { path: 'step/:id', component: StepViewComponent },
            { path: 'step/:stepid/prompt', component: PromptViewComponent },
            { path: 'category/:categoryid/prompt/:promptid', component: PromptUniqueBycategoryViewComponent }
        ]
    },


    // Dashboard USER Routes
    {
        path: 'dashboard',
        canActivate: [
            authGuard,
            //roleGuard,
            //onboardingPassedGuard
        ],
        component: UserViewComponent,
        children: [
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: DashboardViewComponent },
            { path: 'step/:id', component: StepViewComponent },
            { path: 'step/:stepid/prompt', component: PromptViewComponent },
            { path: 'category/:categoryid/prompt/:promptid', component: PromptUniqueBycategoryViewComponent }
        ]
    },




    // Dashboard ADMIN Routes
    {
        path: 'admin',
        canActivate: [],
        component: AdminViewComponent,
        children: [
            { path: '', redirectTo: 'manage-step', pathMatch: 'full' },
            { path: 'users', component: UsersAdminViewComponent },
            { path: 'manage-step', component: StepAdminViewComponent },
            { path: 'plans', component: PlansListComponent },
            { path: 'settings', component: SettingsAdminViewComponent },
        ]
    },

    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    { path: '**', redirectTo: '/dashboard' }

];

const routerOptions = {
    enableTracing: false,
    useHash: false,
    relativeLinkResolution: 'corrected'
};
