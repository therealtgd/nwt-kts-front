import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ForgotPassword } from 'src/app/dto/forgot-password';
import { ResetPassword } from 'src/app/dto/reset-password';
import { UpdatePassword } from 'src/app/dto/update-password';
import { UpdateUser } from 'src/app/dto/update-user';
import { ApiResponse } from 'src/app/models/api-response';
import { post, postWithoutHeader, put } from 'src/app/util/requests';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public registerClient(data: FormData) : Observable<ApiResponse<null>> {
    return postWithoutHeader(this.http, '/auth/signup', data) as Observable<ApiResponse<null>>;
  }
  public updateUser(data: UpdateUser) : Observable<ApiResponse<null>> {
    return put(this.http, '/user/update', data) as Observable<ApiResponse<null>>;
  }
  public updatePassword(data: UpdatePassword) : Observable<ApiResponse<null>> {
    return put(this.http, '/user/update-password', data) as Observable<ApiResponse<null>>;
  }
  public forgotPassword(data: ForgotPassword) : Observable<ApiResponse<null>> {
    return post(this.http, '/user/forgot-password', data) as Observable<ApiResponse<null>>;
  }
  public resetPassword(data: ResetPassword) : Observable<ApiResponse<null>> {
    return put(this.http, '/user/reset-password', data) as Observable<ApiResponse<null>>;
  }

}
