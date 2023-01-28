import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveToken } from 'src/app/util/context';
import { TokenResponse } from 'src/app/dto/token-response';
import { HttpErrorResponse } from '@angular/common/http';


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
        next: (response) => this.handleLoginSuccess(response as TokenResponse),
        error : (error) => this.handleLoginError(error)
      });
  }
  handleLoginSuccess(response: TokenResponse) {
    saveToken(response.accessToken);
    this.authService.getWhoAmI();
    window.location.reload();
    this.router.navigate(['home']);
  }
  googleLogIn() {
    window.location.href = this.googleURL;
  }
  facebookLogIn() {
    window.location.href = this.facebookURL;
  }
  handleLoginError(error: HttpErrorResponse) {
    console.log(error)
    if (typeof error.error.error === "string")
      this.displayModal("Oops!", error.error.error);
    else
      this.displayModal("Oops!", error.error.message);
  }
  displayModal(header : string, content : Object) {
    this.modalContent = content.toString();
    this.modalHeader = header;
    this.modalVisibility = true;
  }
}
