import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';

import { HttpClient } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { DriverService } from 'src/app/services/driver/driver.service';
import { ImageService } from 'src/app/services/image/image.service';
import { UserService } from 'src/app/services/user/user.service';
import { DriverRegistrationComponent } from './driver-registration.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

describe('DriverRegistrationComponent', () => {
  let component: DriverRegistrationComponent;
  let fixture: ComponentFixture<DriverRegistrationComponent>;
  let email: DebugElement;
  let displayName: DebugElement;
  let username: DebugElement;
  let city: DebugElement;
  let capacity: DebugElement;
  let licencePlate: DebugElement;
  let vehicleType: DebugElement;
  let petsAllowed: DebugElement;
  let babiesAllowed: DebugElement;
  let phoneNumber: DebugElement;
  let password: DebugElement;
  let confirmPassword: DebugElement;
  let fileUpload: DebugElement;
  let registerBtn;
  let userService: UserService;
  let mockedRoute: ActivatedRoute;
  let mockApiResponse: ApiResponse<null> = {
    success: true,
    status: { name: "success", value: 200 },
    message: 'Registration successful',
    body: null
  };
  let mockImageApiReponse: ApiResponse<null> = {
    success: true,
    status: { name: "success", value: 200 },
    message: 'File uploaded successfully: image.png',
    body: null
  }

  let driverServiceMock = {
    registerDriver(data: FormData): Observable<ApiResponse<null>> {
      return of(mockApiResponse);
    },
    getWhoAmI(): void { }
  }


  let imageServiceMock = {
    upload(data: FormData): Observable<ApiResponse<null>> {
      return of(mockImageApiReponse)
    }
  }

  let httpClientMock = {

  }

  beforeEach(() => {
    mockedRoute = {
      snapshot: {
        queryParamMap: new Map<string, string>([
          ['token', ''],
          ['error', '']
        ])
      }
    } as unknown as ActivatedRoute;

    TestBed.configureTestingModule({
      declarations: [DriverRegistrationComponent],
      providers: [{ provide: DriverService, useValue: driverServiceMock },
      { provide: ActivatedRoute, useValue: mockedRoute },
      { provide: ImageService, useValue: imageServiceMock },
      { provide: HttpClient, useValue: httpClientMock }],
      imports: [
        ReactiveFormsModule,
        PasswordModule,
        FileUploadModule,
        CardModule,
        DialogModule,
        DropdownModule,
        CheckboxModule,
        KeyFilterModule,
        DividerModule,
        InputTextModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    email = fixture.debugElement.query(By.css('#email'));
    displayName = fixture.debugElement.query(By.css('#display-name'));
    username = fixture.debugElement.query(By.css('#username'));
    city = fixture.debugElement.query(By.css('#city'));
    capacity = fixture.debugElement.query(By.css('#capacity')),
      licencePlate = fixture.debugElement.query(By.css('#licence-plate')),
      vehicleType = fixture.debugElement.query(By.css('#vehicle-type')),
      petsAllowed = fixture.debugElement.query(By.css('#pets-allowed')),
      babiesAllowed = fixture.debugElement.query(By.css('#babies-allowed')),
      phoneNumber = fixture.debugElement.query(By.css('#phone-number'));
    password = fixture.debugElement.query(By.css('#password'));
    confirmPassword = fixture.debugElement.query(By.css('#confirm-password'));
    fileUpload = fixture.debugElement.query(By.css('#file-upload'));
    registerBtn = fixture.debugElement.query(By.css('#register-btn'));
    userService = TestBed.inject(UserService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('form should be invalid', () => {
    component.registrationForm.controls['email'].setValue('');
    component.registrationForm.controls['displayName'].setValue('');
    component.registrationForm.controls['username'].setValue('');
    component.registrationForm.controls['city'].setValue('');
    component.registrationForm.controls['phoneNumber'].setValue('');
    component.registrationForm.controls['capacity'].setValue('');
    component.registrationForm.controls['licencePlate'].setValue('');
    component.registrationForm.controls['vehicleType'].setValue('');
    component.registrationForm.controls['petsAllowed'].setValue('');
    component.registrationForm.controls['babiesAllowed'].setValue('');
    component.registrationForm.controls['password'].setValue('');
    component.registrationForm.controls['confirmPassword'].setValue('');
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.registrationForm.controls['email'].setValue('email@gmail.com');
    component.registrationForm.controls['displayName'].setValue('Test Test');
    component.registrationForm.controls['username'].setValue('test12');
    component.registrationForm.controls['city'].setValue('Novi Sad');
    component.registrationForm.controls['phoneNumber'].setValue('06612121');
    component.registrationForm.controls['capacity'].setValue('4');
    component.registrationForm.controls['licencePlate'].setValue('SF12312');
    component.registrationForm.controls['vehicleType'].setValue('SEDAN');
    component.registrationForm.controls['petsAllowed'].setValue('true');
    component.registrationForm.controls['babiesAllowed'].setValue('false');
    component.registrationForm.controls['password'].setValue('password12');
    component.registrationForm.controls['confirmPassword'].setValue('password12');
    expect(component.registrationForm.valid).toBeTruthy();
  });

  it('fail email field validity', () => {
    email.nativeElement.value = '';
    email.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['email'].valid).toBeFalsy();
  });

  it('fail displayName field validity', () => {
    displayName.nativeElement.value = '';
    displayName.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['displayName'].valid).toBeFalsy();
  });

  it('fail username field validity', () => {
    username.nativeElement.value = '';
    username.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['username'].valid).toBeFalsy();
  });

  it('fail city field validity', () => {
    city.nativeElement.value = '';
    city.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['city'].valid).toBeFalsy();
  });

  it('fail phoneNumber field validity', () => {
    phoneNumber.nativeElement.value = '';
    phoneNumber.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['phoneNumber'].valid).toBeFalsy();
  });
  it('fail capacity field validity', () => {
    capacity.nativeElement.value = '';
    capacity.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['capacity'].valid).toBeFalsy();
  });

  it('fail licencePlate field validity', () => {
    licencePlate.nativeElement.value = '';
    licencePlate.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['licencePlate'].valid).toBeFalsy();
  });


  it('fail password field validity', () => {
    password.nativeElement.value = '';
    password.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['password'].valid).toBeFalsy();
  });

  it('fail confirmPassword field validity', () => {
    confirmPassword.nativeElement.value = '';
    confirmPassword.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.registrationForm.controls['confirmPassword'].valid).toBeFalsy();
  });

  it('should register', () => {
    spyOn(component, 'displaySuccessModal');
    spyOn(userService, 'registerClient').and.returnValue(of(mockApiResponse));

    component.registerDriver();

    expect(component.displaySuccessModal).toHaveBeenCalled();
  });

});
