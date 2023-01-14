import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDTO } from 'src/app/dto/login-dto';
import { saveToken, saveSession, invalidateSession, invalidateToken } from 'src/app/util/context';
import { get, post } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: LoginDTO): Observable<Object> {
    return post(this.http, '/auth/login', data);
  }

  logout(): void {
    invalidateSession();
    invalidateToken();
  }
  
  getWhoAmI(): void {
    get(this.http, '/auth/whoami')
      .subscribe(data => {
        saveSession(data);
      })
  }
  
}
