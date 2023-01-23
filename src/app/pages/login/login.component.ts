import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.authService.logout();
  }

  form!: FormGroup;
  error: string = '';

  login(): void {
    this.authService.login({
      username: this.form.value.username,
      password: this.form.value.password
    })
      .subscribe(
        data => {
          console.log(data);
          if (data) {
            let tokenResponse = data as TokenResponse;
            saveToken(tokenResponse.accessToken);
            this.authService.getWhoAmI();
            this.router.navigate(['/']);
          }
        },
        error => {
          this.error = error.message;
        }
      )
  }

}
