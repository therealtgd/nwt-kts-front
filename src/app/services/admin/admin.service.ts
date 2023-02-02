import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/dto/user-brief';
import { ApiResponse } from 'src/app/models/api-response';
import { get } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public getUserInfo(username: string): Observable<ApiResponse<User>> {
    return get(this.http, '/user/get/' + username) as Observable<ApiResponse<User>>;
  }
}
