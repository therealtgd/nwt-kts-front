import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContextData } from 'src/app/dto/context-data';
import { LoginRequest } from 'src/app/dto/login-request';
import { ApiResponse } from 'src/app/models/api-response';
import { saveSession, invalidateSession, invalidateToken, getSession } from 'src/app/util/context';
import { get, post, put } from 'src/app/util/requests';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  roleSubject = new Subject<ContextData | null>();

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<ApiResponse<null>> {
    return post(this.http, '/auth/signin', data) as Observable<ApiResponse<null>>;
  }

  logout(): void {
    put(this.http, '/auth/signout', {}).subscribe({
      next: (response: any) => {
        console.log(response.message)
        this.roleSubject.next(null);
      },
      error: (error) => console.error(error),
    });
    invalidateSession();
    invalidateToken();
  }

  getWhoAmI(): void {
    (get(this.http, '/user/me') as Observable<ApiResponse<ContextData>>)
      .subscribe({
        next: (data: ApiResponse<ContextData>) => { 
          if (data.success && data.body) {
            saveSession(data.body as ContextData);
            this.roleSubject.next(data.body);
          }
        } ,
        error: (error) => this.logout(),
      })
  }

}
