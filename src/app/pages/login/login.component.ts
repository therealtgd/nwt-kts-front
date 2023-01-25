import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginDTO } from 'src/app/dto/login-dto';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveToken } from 'src/app/util/context';
import { TokenResponse } from 'src/app/dto/token-response';


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
  form!: FormGroup;
  errorMessage: string = '';

  login(): void {
    this.authService.login({
      email: this.form.value.email,
      password: this.form.value.password
    })
      .subscribe(
        data => {
          if (data) {
            let tokenResponse = data as TokenResponse;
            saveToken(tokenResponse.accessToken);
            this.authService.getWhoAmI();
            window.location.reload();
          }
        },
        error => {
          this.errorMessage = error.message;
        }
      )
  }
  googleLogIn() {
    window.location.href = this.googleURL;
  }
  facebookLogIn() {
    window.location.href = this.facebookURL;
  }
}
