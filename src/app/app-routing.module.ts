import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminLiveChatComponent } from './pages/admin-live-chat/admin-live-chat.component';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';
import { BuyCreditsComponent } from './pages/buy-credits/buy-credits.component';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { DriverRegistrationComponent } from './pages/driver-registration/driver-registration.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register/client',
    component: ClientRegistrationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'register/driver',
    component: DriverRegistrationComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'confirm-registration/:token',
    component: RegistrationConfirmationComponent
  },
  {
    path: 'buy-credits',
    component: BuyCreditsComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN', 'ROLE_DRIVER', 'ROLE_CLIENT']
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'support-chat',
    component: AdminLiveChatComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'statistics',
    component: AdminReportsComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['ROLE_ADMIN']
    }
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
