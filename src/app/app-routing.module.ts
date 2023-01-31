import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BuyCreditsComponent } from './pages/buy-credits/buy-credits.component';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register/client', component: ClientRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'confirm-registration/:token', component: RegistrationConfirmationComponent },
  { path: 'buy-credits', component: BuyCreditsComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard] },
  { path: 'reset-password/:token', component: ResetPasswordComponent, canActivate: [AuthGuard] },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
