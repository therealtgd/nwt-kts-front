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
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageService } from 'src/app/services/image/image.service';
import { UserService } from 'src/app/services/user/user.service';
import { ClientRegistrationComponent } from './client-registration.component';

describe('ClientRegistrationComponent', () => {
  let component: ClientRegistrationComponent;
  let fixture: ComponentFixture<ClientRegistrationComponent>;
  let email: DebugElement;
  let displayName: DebugElement;
  let username: DebugElement;
  let city: DebugElement;
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

  let userServiceMock = {
    registerClient(data: FormData): Observable<ApiResponse<null>> {
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
      declarations: [ClientRegistrationComponent],
      providers: [{ provide: UserService, useValue: userServiceMock },
      { provide: ActivatedRoute, useValue: mockedRoute },
      { provide: ImageService, useValue: imageServiceMock },
      { provide: HttpClient, useValue: httpClientMock }],
      imports: [ReactiveFormsModule, PasswordModule, FileUploadModule, CardModule, DialogModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    email = fixture.debugElement.query(By.css('#email'));
    displayName = fixture.debugElement.query(By.css('#display-name'));
    username = fixture.debugElement.query(By.css('#username'));
    city = fixture.debugElement.query(By.css('#city'));
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
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['displayName'].setValue('');
    component.form.controls['username'].setValue('');
    component.form.controls['city'].setValue('');
    component.form.controls['phoneNumber'].setValue('');
    component.form.controls['password'].setValue('');
    component.form.controls['confirmPassword'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.form.controls['email'].setValue('email@gmail.com');
    component.form.controls['displayName'].setValue('Test Test');
    component.form.controls['username'].setValue('test12');
    component.form.controls['city'].setValue('Novi Sad');
    component.form.controls['phoneNumber'].setValue('06612121');
    component.form.controls['password'].setValue('password12');
    component.form.controls['confirmPassword'].setValue('password12');
    expect(component.form.valid).toBeTruthy();
  });

  it('fail email field validity', () => {
    email.nativeElement.value = '';
    email.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['email'].valid).toBeFalsy();
  });

  it('fail displayName field validity', () => {
    displayName.nativeElement.value = '';
    displayName.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['displayName'].valid).toBeFalsy();
  });

  it('fail username field validity', () => {
    username.nativeElement.value = '';
    username.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['username'].valid).toBeFalsy();
  });

  it('fail city field validity', () => {
    city.nativeElement.value = '';
    city.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['city'].valid).toBeFalsy();
  });

  it('fail phoneNumber field validity', () => {
    phoneNumber.nativeElement.value = '';
    phoneNumber.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['phoneNumber'].valid).toBeFalsy();
  });
 
  it('fail password field validity', () => {
    password.nativeElement.value = '';
    password.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['password'].valid).toBeFalsy();
  });

  it('fail confirmPassword field validity', () => {
    confirmPassword.nativeElement.value = '';
    confirmPassword.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['confirmPassword'].valid).toBeFalsy();
  });

  it('should register', () => {
    spyOn(component, 'handleRegistrationSuccess');
    spyOn(userService, 'registerClient').and.returnValue(of(mockApiResponse));

    component.save();
    
    expect(component.handleRegistrationSuccess).toHaveBeenCalled();
  });

});
