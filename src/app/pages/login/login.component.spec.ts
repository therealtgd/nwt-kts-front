import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { Observable, of } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response';
import { AuthService } from 'src/app/services/auth/auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let emailInput: DebugElement;
  let passwordInput: DebugElement;
  let logInBtn;
  let authService: any;
  let mockedRoute: ActivatedRoute;
  let mockApiResponse: ApiResponse<null> = {
    success: true,
    status: { name: "success", value: 200 },
    message: 'Login successful',
    body: null
  };

  let authServiceMock = {
    login(email: string, password: string): Observable<ApiResponse<null>> {
      return of(mockApiResponse);
    },
    getWhoAmI(): void { }
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
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock },
      { provide: ActivatedRoute, useValue: mockedRoute }],
      imports: [ReactiveFormsModule, PasswordModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    emailInput = fixture.debugElement.query(By.css('#emailInput'));
    passwordInput = fixture.debugElement.query(By.css('#passwordInput input'));
    logInBtn = fixture.debugElement.query(By.css('#logInBtn'));
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');
    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.form.controls['email'].setValue('client@gmail.com');
    component.form.controls['password'].setValue('client');
    expect(component.form.valid).toBeTruthy();
  });

  it('fail email field validity', () => {
    emailInput.nativeElement.value = '';
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['email'].valid).toBeFalsy();
  });

  it('fail password field validity', () => {
    passwordInput.nativeElement.value = '';
    passwordInput.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.form.controls['password'].valid).toBeFalsy();
  });

  it('should login', () => {
    spyOn(component, 'handleLoginSuccess');
    spyOn(authService, 'login').and.returnValue(of(mockApiResponse));

    component.login();
    
    expect(component.handleLoginSuccess).toHaveBeenCalled();
  });

});
