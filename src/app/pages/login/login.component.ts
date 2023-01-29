import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveToken } from 'src/app/util/context';
import { TokenResponse } from 'src/app/dto/token-response';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from 'src/app/models/api-response';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const token: string = this.route.snapshot.queryParamMap.get('token') || '';
    const error: string = this.route.snapshot.queryParamMap.get('error') || '';

    if (token !== '') {
      saveToken(token);
      this.authService.getWhoAmI();
      window.location.reload();
    }
    else if(error){
  		this.errorMessage = error;
  	}

    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
    
  }

  googleURL: string = "http://localhost:8080/oauth2/authorization/google?redirect_uri=http://localhost:4200/login";
  facebookURL: string = "http://localhost:8080/oauth2/authorization/facebook?redirect_uri=http://localhost:4200/login";
  modalVisibility: boolean = false;
  modalContent: string = '';
  modalHeader: string = '';
  errorMessage: string = '';
  form!: FormGroup;

  login(): void {
    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    })
      .subscribe({
        next: (response) => this.handleLoginSuccess(response),
        error : (error) => this.handleLoginError(error.error)
      });
  }
  handleLoginSuccess(response: ApiResponse<null>) {
    saveToken(response.message);
    this.authService.getWhoAmI();
    window.location.reload();
    this.router.navigate(['home']);
  }
  handleLoginError(error: ApiResponse<null>) {
    console.log(error)
    this.displayModal("Oops!", error.message);
  }
  googleLogIn() {
    window.location.href = this.googleURL;
  }
  facebookLogIn() {
    window.location.href = this.facebookURL;
  }
  displayModal(header : string, content : string) {
    this.modalContent = content;
    this.modalHeader = header;
    this.modalVisibility = true;
  }
}
