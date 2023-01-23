import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';

const routes: Routes = [
  // { path: 'somepath', component: SomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: ClientRegistrationComponent, canActivate: [AuthGuard] },
  { path: 'confirm-registration/:token', component: RegistrationConfirmationComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
