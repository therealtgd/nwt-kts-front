import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextData } from 'src/app/dto/context-data';
import { LoginDTO } from 'src/app/dto/login-dto';
import { RegistrationRequestDTO } from 'src/app/dto/RegistrationRequestDTO';
import { saveToken, saveSession, invalidateSession, invalidateToken } from 'src/app/util/context';
import { get, post } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: LoginDTO): Observable<Object> {
    return post(this.http, '/auth/signin', data);
  }

  logout(): void {
    console.log("invalidating")
    invalidateSession();
    invalidateToken();
  }
  
  getWhoAmI(): void {
    get(this.http, '/user/me')
      .subscribe(data => {
        saveSession(data as ContextData);
      })
  }

  public registerClient(data: RegistrationRequestDTO) : Observable<Object> {
    return post(this.http, '/auth/signup', data);
  }
  
}
