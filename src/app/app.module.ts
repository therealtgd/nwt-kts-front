import { HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { StarRatingConfigService, StarRatingModule } from 'angular-star-rating';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { NgxPayPalModule } from 'ngx-paypal';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from "primeng/divider";
import { DragDropModule } from 'primeng/dragdrop';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GMapModule } from 'primeng/gmap';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabViewModule } from 'primeng/tabview';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';

import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { CoolSocialLoginButtonsModule } from '@angular-cool/social-login-buttons';
import { DatePipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientActiveRideComponent } from './components/client-active-ride/client-active-ride.component';
import { DetailedParticipantsComponent } from './components/detailed-participants/detailed-participants.component';
import { DetailedReviewsComponent } from './components/detailed-reviews/detailed-reviews.component';
import { DetailedRouteComponent } from './components/detailed-route/detailed-route.component';
import { EditDriverProfileComponent } from './components/edit-driver-profile/edit-driver-profile.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { FavoriteRoutesComponent } from './components/favorite-routes/favorite-routes.component';
import { GoogleMapsComponent } from './components/google-maps/google-maps.component';
import { LiveChatComponent } from './components/live-chat/live-chat.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaypalModalComponent } from './components/paypal-modal/paypal-modal.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';
import { RideCardComponent } from './components/ride-card/ride-card.component';
import { RideFormComponent } from './components/ride-form/ride-form.component';
import { RideHistoryComponent } from './components/ride-history/ride-history.component';
import { RouteCardComponent } from './components/route-card/route-card.component';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminHomeComponent } from './pages/admin-home/admin-home.component';
import { AdminLiveChatComponent } from './pages/admin-live-chat/admin-live-chat.component';
import { AdminReportsComponent } from './pages/admin-reports/admin-reports.component';
import { AllClientsComponent } from './pages/all-clients/all-clients.component';
import { AllDriversComponent } from './pages/all-drivers/all-drivers.component';
import { BuyCreditsComponent } from './pages/buy-credits/buy-credits.component';
import { ClientRegistrationComponent } from './pages/client-registration/client-registration.component';
import { DetailedRideComponent } from './pages/detailed-ride/detailed-ride.component';
import { DriverHomeComponent } from './pages/driver-home/driver-home.component';
import { DriverRegistrationComponent } from './pages/driver-registration/driver-registration.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegistrationConfirmationComponent } from './pages/registration-confirmation/registration-confirmation.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AddressPipe } from './pipes/address.pipe';
import { DistancePipe } from './pipes/distance.pipe';
import { MinutesPipe } from './pipes/minutes.pipe';
import { TimePipe } from './pipes/time.pipe';
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
    DistancePipe,
    MinutesPipe,
    ReportsComponent,
    LiveChatComponent,
    FavoriteRoutesComponent,
    RouteCardComponent,
    ClientActiveRideComponent,
    TimePipe,
    DriverHomeComponent,
    EditDriverProfileComponent,
    AdminLiveChatComponent,
    AdminHomeComponent,
    AdminReportsComponent,
    DriverRegistrationComponent,
    DetailedRideComponent,
    DetailedRouteComponent,
    DetailedParticipantsComponent,
    DetailedReviewsComponent,
    ReviewCardComponent,
    AllClientsComponent,
    AllDriversComponent,
    UsersTableComponent,
  ],
  imports: [
    TableModule,
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
    CheckboxModule,
    DropdownModule,
    CalendarModule,
    ChartModule,
    ConfirmDialogModule,
    DividerModule,
    KeyFilterModule,
    ToastModule,
    TimelineModule,
    InputTextareaModule,
    StarRatingModule,
    TabViewModule,
  ],
  providers: [
    DatePipe,
    MessageService,
    AuthGuard,
    AuthService,
    ConfirmationService,
    StarRatingConfigService,
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
