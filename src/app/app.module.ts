import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { NgxPayPalModule } from 'ngx-paypal';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DragDropModule } from 'primeng/dragdrop';
import { FileUploadModule } from 'primeng/fileupload';
import { GMapModule } from 'primeng/gmap';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';
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
import { ModalComponent } from './components/modal/modal.component';
import { AddressPipe } from './pipes/address.pipe';
import { BuyCreditsComponent } from './pages/buy-credits/buy-credits.component';
import { PaypalModalComponent } from './components/paypal-modal/paypal-modal.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { RideHistoryComponent } from './components/ride-history/ride-history.component';
import { RideCardComponent } from './components/ride-card/ride-card.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

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
    ModalComponent,
    AddressPipe,
    BuyCreditsComponent,
    PaypalModalComponent,
    ProfileComponent,
    EditProfileComponent,
    RideHistoryComponent,
    RideCardComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
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
    DragDropModule,
    NgxPayPalModule,
    ProgressSpinnerModule,
    AvatarModule,
    AvatarGroupModule,
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
