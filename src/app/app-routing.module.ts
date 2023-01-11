import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: ClientRegistrationComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
