import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GMapModule } from 'primeng/gmap';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';

import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RideFormComponent } from './components/ride-form/ride-form.component';
import { AuthGuard } from './guards/auth.guard';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';
import { AuthService } from './services/auth/auth.service';
import { HttpInterceptorService } from './services/interceptor/http-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ClientRegistrationComponent,
    RegistrationConfirmationComponent,
    NavbarComponent,
    GoogleMapsComponent,
    HomeComponent,
    RideFormComponent,
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
    HttpClientJsonpModule,
    CardModule,
    DialogModule,
    MenubarModule,
    CoolSocialLoginButtonsModule,
    GoogleMapsModule,
    GMapModule,
    GooglePlaceModule,
  ],
  providers: [
    MessageService,
    AuthGuard,
    AuthService,
    GoogleMap, 
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
