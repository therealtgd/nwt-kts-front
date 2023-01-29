import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { BuyCreditsComponent } from './pages/buy-credits/buy-credits.component';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register/client', component: ClientRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'confirm-registration/:token', component: RegistrationConfirmationComponent },
  { path: 'buy-credits', component: BuyCreditsComponent },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
