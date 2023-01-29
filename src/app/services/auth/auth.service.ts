import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextData } from 'src/app/dto/context-data';
import { LoginRequest } from 'src/app/dto/login-request';
import { RegistrationRequest } from 'src/app/dto/registration-request';
import { saveToken, saveSession, invalidateSession, invalidateToken } from 'src/app/util/context';
import { get, post } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<Object> {
    return post(this.http, '/auth/signin', data);
  }

  logout(): void {
    console.log("invalidating")
    invalidateSession();
    invalidateToken();
    window.location.reload();
  }
  
  getWhoAmI(): void {
    get(this.http, '/user/me')
      .subscribe({
        next: (data) => saveSession(data as ContextData),
        error: (error) => this.logout()
      })
  }

  public registerClient(data: RegistrationRequest) : Observable<Object> {
    return post(this.http, '/auth/signup', data);
  }
  
}
