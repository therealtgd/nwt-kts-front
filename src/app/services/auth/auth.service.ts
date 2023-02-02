import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextData } from 'src/app/dto/context-data';
import { LoginRequest } from 'src/app/dto/login-request';
import { ApiResponse } from 'src/app/models/api-response';
import { saveSession, invalidateSession, invalidateToken } from 'src/app/util/context';
import { get, post, put } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<ApiResponse<null>> {
    return post(this.http, '/auth/signin', data) as Observable<ApiResponse<null>>;
  }

  logout(): void {
    put(this.http, '/auth/signout', {}).subscribe({
      next: (response: any) => {
        console.log(response.message)
        console.log("invalidating")
        invalidateSession();
        invalidateToken();
        window.location.reload();
      },
      error: (error) => console.error(error),
    });
   
  }
  
  getWhoAmI(): void {
    (get(this.http, '/user/me') as Observable<ApiResponse<ContextData>>)
      .subscribe({
        next: (data) => saveSession(data.body as ContextData),
        error: (error) => this.logout()
      })
  }
  
}
