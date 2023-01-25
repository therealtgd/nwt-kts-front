import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';

import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import {CardModule} from 'primeng/card';

import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';
import { DialogModule } from 'primeng/dialog';
import { AuthGuard } from './guards/auth.guard'; 
import { AuthService } from './services/auth/auth.service';
import { HttpInterceptorService } from './services/interceptor/http-interceptor.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientRegistrationComponent,
    RegistrationConfirmationComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    AutoCompleteModule,
    FileUploadModule,
    HttpClientModule,
    CardModule,
    DialogModule,
    MenubarModule,
    CoolSocialLoginButtonsModule
  ],
  providers: [
    MessageService,
    AuthGuard,
    AuthService , 
  {
   provide: HTTP_INTERCEPTORS,
   useClass: HttpInterceptorService,
   multi: true
  },
  {
    provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('Google-Client-ID-Goes-Here'),
          },
        ],
      } as SocialAuthServiceConfig,
  }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
